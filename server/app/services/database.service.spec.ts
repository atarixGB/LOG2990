import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DrawingData } from '../classes/drawing-data';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let validDrawing: DrawingData;
    // const options: MongoClientOptions = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // };
    // let collection: Collection<DrawingMetadata>;
    // let clientTest: MongoClient

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();

        validDrawing = {
            _id: '123',
            title: 'title',
            labels: ['tag1', 'tag2'],
            height: 0,
            width: 0,
            body: 'data:image/png;base64,imagedatahere12345',
        };
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    it('should instanciate correctly', (done: Mocha.Done) => {
        chai.expect(databaseService).to.be.instanceOf(DatabaseService);
        done();
    });

    it('should connect to the database when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal('PolyDessin');
    });

    it('should no longer be connected if close is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('should add drawing', (done: Mocha.Done) => {
        databaseService.addDrawing(validDrawing).then((result) => {
            return expect(result).to.equal({
                _id: '123',
                title: 'title',
                labels: ['tag1', 'tag2'],
                height: 0,
                width: 0,
                body: 'data:image/png;base64,imagedatahere12345',
            });
        });
        done();
    });

    it('should delete drawing', (done: Mocha.Done) => {
        const drawingToRemove: string = 'title';

        databaseService.deleteDrawingByIdName(drawingToRemove).then((result) => {
            return expect(result).to.equal(null);
        });
        done();
    });
});
