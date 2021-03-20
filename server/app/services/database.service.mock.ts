import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { BASE_URL, DATABASE_URL, DRAWINGS_URL } from '@app/constants';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { Collection, Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DATABASE_NAME = 'PolyDessin';
const SAVED_DRAWINGS_PATH = './saved-drawings/';
const IMAGE_FORMAT = 'png';
const DATA_ENCODING = 'base64';
const DATA_URL_BASE64_PREFIX = /^data:image\/\w+;base64,/;
const ALPHANUMERIC_REGEX = /^[a-z0-9]+$/i;
const MIN_LENGTH_TITLE = 1;
const MAX_LENGTH_INPUT = 15;
const NB_TAGS_ALLOWED = 5;

export class DatabaseServiceMock {
    db: Db;
    private client: MongoClient;
    mongoServer: MongoMemoryServer;
    drawingsCollection: Collection<DrawingMetadata>;
    clientMessages: DrawingData[];
    drawingURLS: string[];

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url?: string): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = new MongoMemoryServer();
            const mongoUri = await this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri, this.options);
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }

    async addDrawing(drawingData: DrawingData): Promise<void> {
        if (this.validateRequest(drawingData)) {
            const drawingMetadata: DrawingMetadata = {
                title: drawingData.title,
                labels: drawingData.labels ? drawingData.labels : undefined,
            };

            await this.drawingsCollection
                .insertOne(drawingMetadata)
                .then((result) => {
                    drawingData._id = result.insertedId.toHexString();
                    this.saveImageAsPNG(drawingData);
                    console.log(`Drawing ${drawingData.title} has been successfully added!`);
                })
                .catch((error: Error) => {
                    console.error(`Failed to add drawing ${drawingData.title} to database`, error);
                    throw error;
                });
        }
    }

    async findDrawingByIdName(id: string): Promise<DrawingMetadata> {
        const objectId = new ObjectId(id);
        return this.drawingsCollection
            .findOne({ _id: objectId })
            .then((drawing: DrawingMetadata) => {
                console.log(`Drawing with id:${id} has been successfully added.`);
                return drawing;
            })
            .catch((error) => {
                throw new Error(`Failed to get drawing with id ${id}\n${error}`);
            });
    }

    async deleteDrawingByIdName(id: string): Promise<void> {
        const objectId = new ObjectId(id);
        return this.drawingsCollection
            .findOneAndDelete({ _id: objectId })
            .then(() => {
                this.deleteDrawingFromServer(id);
                console.log(`Drawing with id:${id} has been successfully deleted from database.`);
            })
            .catch((error) => {
                throw new Error(`Failed to delete drawing with id ${id}\n${error}`);
            });
    }

    private parseImageData(drawingData: DrawingData): Buffer {
        const metadata = drawingData.body.replace(DATA_URL_BASE64_PREFIX, '');
        const dataBuffer = Buffer.from(metadata, DATA_ENCODING);
        return dataBuffer;
    }

    private saveImageAsPNG(drawingData: DrawingData): void {
        const dataBuffer = this.parseImageData(drawingData);
        fs.writeFile(SAVED_DRAWINGS_PATH + drawingData._id + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
            if (error) throw error;
            this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${drawingData._id}.${IMAGE_FORMAT}`);
            this.clientMessages.push(drawingData);
        });
    }

    private deleteDrawingFromServer(id: string): void {
        const url = SAVED_DRAWINGS_PATH + id + `.${IMAGE_FORMAT}`;
        fs.unlink(url, (error) => {
            if (error) {
                throw error;
            } else {
                console.log(`Drawing with id ${id} has been successfully deleted from server.`);
                this.readDrawingDirectory();
            }
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

    private validateTags(tags: string[] | undefined): boolean {
        if (tags) {
            if (tags.length < 0 || tags.length > NB_TAGS_ALLOWED) return false;
            for (const tag in tags) {
                if (!this.validateString(tag, 0)) {
                    return false;
                }
            }
        }
        return true;
    }

    private validateRequest(request: DrawingData): boolean {
        return this.validateString(request.title, MIN_LENGTH_TITLE) && this.validateRequestBody(request.body) && this.validateTags(request.labels);
    }

    private readDrawingDirectory(): void {
        this.drawingURLS = [];
        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) throw error;
            files.forEach((file) => {
                this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${file}`);
            });
            console.log('Dessins actuellement sur le serveur:', this.drawingURLS);
        });
    }
}
