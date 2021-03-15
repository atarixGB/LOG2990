import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DatabaseService } from './database.service';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
const IMAGE_FORMAT = 'png';
const DATA_ENCODING = 'base64';
const IMAGE_DATA_PREFIX = /^data:image\/\w+;base64,/;

@injectable()
export class IndexService {
    fs = require('fs');
    clientMessages: DrawingData[];
    drawingsPath: string[];

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.clientMessages = [];
        this.drawingsPath = [];

        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) throw error;
            files.forEach((file) => {
                this.drawingsPath.push(file);
            });
            console.log('Dessins actuellement sur le serveur:', this.drawingsPath);
        });
    }

    about(): string {
        const description: string =
            "Bienvenue sur le serveur de PolyDessin. Ce serveur permet de sauvegarder les dessins de l'application PolyDessin dans le format png";
        return description;
    }

    storeDrawing(drawingData: DrawingData): void {
        const requestValid = this.validateRequestBody(drawingData.body);

        if (requestValid) {
            const dataBuffer = this.parseImageData(drawingData);
            fs.writeFile(SAVED_DRAWINGS_PATH + drawingData.title + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
                if (error) throw error;

                try {
                    this.drawingsPath.push(drawingData.title + `.${IMAGE_FORMAT}`);
                    this.clientMessages.push(drawingData);
                    this.databaseService.addDrawing(drawingData).catch((error: Error) => {
                        throw error;
                    });
                } catch {
                    console.error('Cannot save data on database !');
                }
            });
        }
    }

    getAllDrawingsPath(): string[] {
        return this.drawingsPath;
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
}
