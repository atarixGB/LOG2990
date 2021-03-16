import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { BASE_URL, INDEX_URL } from '@app/constants';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DatabaseService } from './database.service';

// const DATABASE_COLLECTION = 'Drawings';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
const IMAGE_FORMAT = 'png';
const DATA_ENCODING = 'base64';

const IMAGE_DATA_PREFIX = /^data:image\/\w+;base64,/;

const ALPHANUMERIC_REGEX = /^[a-z0-9]+$/i;

const MIN_LENGTH_TITLE = 1;
const MAX_LENGTH_INPUT = 15;
const NB_TAGS_ALLOWED = 5;
@injectable()
export class IndexService {
    clientMessages: DrawingData[];
    drawingURLS: string[];

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.clientMessages = [];
        this.drawingURLS = [];

        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) throw error;
            files.forEach((file) => {
                this.drawingURLS.push(`${BASE_URL}${INDEX_URL}/drawings/${file}`);
            });
            console.log('Dessins actuellement sur le serveur:', this.drawingURLS);
        });
    }

    about(): string {
        const description =
            "Bienvenue sur le serveur de PolyDessin. Ce serveur permet de sauvegarder les dessins de l'application PolyDessin dans le format png";
        return description;
    }

    async addDrawing(drawingData: DrawingData): Promise<void> {
        const requestValid = this.validateRequest(drawingData);

        if (requestValid) {
            // Save as PNG to server
            const dataBuffer = this.parseImageData(drawingData);
            fs.writeFile(SAVED_DRAWINGS_PATH + drawingData.title + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
                if (error) throw error;
                this.drawingURLS.push(`${BASE_URL}${INDEX_URL}/drawings/${drawingData.title}.${IMAGE_FORMAT}`);
                this.clientMessages.push(drawingData);
            });

            const metadata: DrawingMetadata = {
                title: drawingData.title,
                labels: drawingData.labels,
            };

            console.log('avant', this.databaseService.drawingsCollection);
            console.log(this.databaseService.drawingsCollection);
            await this.databaseService.drawingsCollection.insertOne(metadata).catch((error: Error) => {
                console.log();
                // throw new HttpException();
                console.error('Failed to add drawing to database');
            });
        }
    }

    async lastDrawing(): Promise<DrawingData> {
        return this.getLastMessage()
            .then((message: DrawingData) => {
                return {
                    title: message.title,
                    labels: message.labels,
                    height: message.height,
                    width: message.width,
                    body: message.body,
                };
            })
            .catch((error: unknown) => {
                console.error('There was an error!!!', error);

                return {
                    title: 'Error',
                    labels: [],
                    height: 0,
                    width: 0,
                    body: error as string,
                };
            });
    }

    async getLastMessage(): Promise<DrawingData> {
        return this.clientMessages[this.clientMessages.length - 1];
    }

    private parseImageData(drawingData: DrawingData): Buffer {
        const metadata = drawingData.body.replace(IMAGE_DATA_PREFIX, '');
        const dataBuffer = Buffer.from(metadata, DATA_ENCODING);
        return dataBuffer;
    }

    private validateRequestBody(body: string): boolean {
        return IMAGE_DATA_PREFIX.test(body);
    }

    private validateString(str: string, minLength: number): boolean {
        const isAlphanumeric = ALPHANUMERIC_REGEX.test(str);
        const isValidSize = str.length >= minLength && str.length <= MAX_LENGTH_INPUT;
        return isValidSize && isAlphanumeric;
    }

    private validateTags(tags: string[]): boolean {
        if (tags.length < 0 || tags.length > NB_TAGS_ALLOWED) return false;
        for (const tag in tags) {
            if (!this.validateString(tag, 0)) {
                return false;
            }
        }
        return true;
    }

    private validateRequest(request: DrawingData): boolean {
        return this.validateString(request.title, MIN_LENGTH_TITLE) && this.validateTags(request.labels) && this.validateRequestBody(request.body);
    }
}
