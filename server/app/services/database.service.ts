import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { BASE_URL, DATABASE_DRAWINGS_COLLECTION, DATABASE_MONGO_URL, DATABASE_NAME, DATABASE_URL, DRAWINGS_URL } from '@app/constants';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
const IMAGE_FORMAT = 'png';
const DATA_ENCODING = 'base64';
const DATA_URL_BASE64_PREFIX = /^data:image\/\w+;base64,/;
const ALPHANUMERIC_REGEX = /^[a-z0-9]+$/i;
const MIN_LENGTH_TITLE = 1;
const MAX_LENGTH_INPUT = 15;
const NB_TAGS_ALLOWED = 5;

@injectable()
export class DatabaseService {
    drawingsCollection: Collection<DrawingMetadata>;
    clientMessages: DrawingData[];
    drawingURLS: string[];

    private db: Db;
    private client: MongoClient;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        this.clientMessages = [];
        this.drawingURLS = [];

        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) throw error;
            files.forEach((file) => {
                this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${file}`);
            });
            console.log('Dessins actuellement sur le serveur:', this.drawingURLS);
        });
    }

    async start(url: string = DATABASE_MONGO_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = this.client.db(DATABASE_NAME);
            this.drawingsCollection = this.db.collection(DATABASE_DRAWINGS_COLLECTION);
        } catch {
            throw new Error('Database connection error');
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async addDrawing(drawingData: DrawingData): Promise<void> {
        if (this.validateRequest(drawingData)) {
            this.saveImageAsPNG(drawingData);

            const drawingMetadata: DrawingMetadata = {
                title: drawingData.title,
                labels: drawingData.labels,
            };

            await this.drawingsCollection.insertOne(drawingMetadata).catch((error: Error) => {
                console.error('Failed to add drawing to database', error);
                throw error;
            });
        }
    }

    private parseImageData(drawingData: DrawingData): Buffer {
        const metadata = drawingData.body.replace(DATA_URL_BASE64_PREFIX, '');
        const dataBuffer = Buffer.from(metadata, DATA_ENCODING);
        return dataBuffer;
    }

    private saveImageAsPNG(drawingData: DrawingData): void {
        // Save as PNG to server
        const dataBuffer = this.parseImageData(drawingData);
        fs.writeFile(SAVED_DRAWINGS_PATH + drawingData.title + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
            if (error) throw error;
            this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${drawingData.title}.${IMAGE_FORMAT}`);
            this.clientMessages.push(drawingData);
        });
    }

    private validateRequestBody(body: string): boolean {
        return DATA_URL_BASE64_PREFIX.test(body);
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

    get database(): Db {
        return this.db;
    }
}
