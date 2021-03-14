import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0.l4dzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'PolyDessin';
const DATABASE_COLLECTION = 'Drawings';

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
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async addDrawingMetadata(drawing: DrawingData): Promise<void> {
        let metadata: DrawingMetadata = {
            title: drawing.title,
            tags: drawing.labels,
        };
        await this.db.collection(DATABASE_COLLECTION).insertOne(metadata);
    }

    get database(): Db {
        return this.db;
    }
}
