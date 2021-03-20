import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    // let databaseService: DatabaseService;
    // let mongoServer: MongoMemoryServer;
    // beforeEach(async () => {
    //     databaseService = new DatabaseService();
    //     // Start a local test server
    //     mongoServer = new MongoMemoryServer();
    // });
    // afterEach(async () => {
    //     if (databaseService['client'] && databaseService['client'].isConnected()) {
    //         await databaseService['client'].close();
    //     }
    // });
});
