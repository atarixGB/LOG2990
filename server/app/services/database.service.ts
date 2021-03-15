import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';
import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0.l4dzm.mongodb.net/PolyDessin?retryWrites=true&w=majority';
const DATABASE_NAME = 'PolyDessin';
const DATABASE_DRAWINGS_COLLECTION = 'Drawings';

@injectable()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;
    drawingsCollection: Collection<DrawingMetadata>;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            let client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = this.client.db(DATABASE_NAME);
            this.drawingsCollection = this.db.collection(DATABASE_DRAWINGS_COLLECTION);
            console.log('drawingscollection', this.drawingsCollection);
            // console.log(this.db.collection(DATABASE_COLLECTION));
        } catch {
            throw new Error('Database connection error');
        }

        // await this.addDrawing(); // TEMPORARY

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
            console.log('db defined');
            let metadata: DrawingMetadata = {
                title: mock.title,
                labels: mock.labels,
            };
            console.log(this.db.collection(DATABASE_DRAWINGS_COLLECTION));

            await this.db.collection(DATABASE_DRAWINGS_COLLECTION).insertOne(metadata);
        }
    }

    get database(): Db {
        return this.db;
    }
}
