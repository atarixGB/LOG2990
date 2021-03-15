import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0.l4dzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'PolyDessin';
const DATABASE_COLLECTION = 'Drawings';

const ALPHANUMERIC_REGEX = /^[a-z0-9]+$/i;
const MIN_LENGTH_TITLE = 1;
const MAX_LENGTH_INPUT = 15;
const NB_TAGS_ALLOWED = 5;
interface DrawingMetadata {
    title: string;
    tags: string[];
}
@injectable()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            let client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = this.client.db(DATABASE_NAME);
            console.log(this.db, client);
        } catch {
            throw new Error('Database connection error');
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async addDrawing(drawing: DrawingData): Promise<void> {
        if (this.validateRequest(drawing) && this.db) {
            let metadata: DrawingMetadata = {
                title: drawing.title,
                tags: drawing.labels,
            };

            try {
                await this.db.collection(DATABASE_COLLECTION).insertOne(metadata);
            } catch (error) {
                console.error(`Error with addDrawing!'\n${error}`);
            }
        }
    }

    get database(): Db {
        return this.db;
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
        return this.validateString(request.title, MIN_LENGTH_TITLE) && this.validateTags(request.labels);
    }
}
