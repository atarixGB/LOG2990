import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0.l4dzm.mongodb.net/PolyDessin?retryWrites=true&w=majority';
const DATABASE_NAME = 'PolyDessin';
const DATABASE_COLLECTION = 'Drawings';

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
            console.log(this.db);
        } catch {
            throw new Error('Database connection error');
        }

        await this.addDrawing(); // TEMPORARY

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    // TEMPORARY
    async addDrawing(): Promise<void> {
        let mock: DrawingData = {
            title: 'Title',
            labels: ['tag1', 'tag2'],
            height: 0,
            width: 0,
            body: 'Base64 data',
        };

        if (this.db) {
            let metadata: DrawingMetadata = {
                title: mock.title,
                labels: mock.labels,
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
}
