import * as chai from 'chai';
import 'chai-http';
import { testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';
import { DatabaseController } from './database.controller';
chai.use(require('chai-http'));

// tslint:disable
// const HTTP_STATUS_OK = 200;

describe('DatabaseController', () => {
    let databaseController: DatabaseController;
    // let application: Application;

    beforeEach(async () => {
        await testingContainer().then((instance) => {
            // application = instance[0].get<Application>(TYPES.Application);
            databaseController = instance[0].get<DatabaseController>(TYPES.DatabaseController);
        });
    });

    it('should instanciate correctly', (done: Mocha.Done) => {
        chai.expect(databaseController).to.be.instanceOf(DatabaseController);
        done();
    });

    // it('should call getAllDrawings when accessing api/database/drawings', (done: Mocha.Done) => {
    //     const stub = Sinon.stub(DatabaseService.prototype, 'getAllDrawingUrls').resolves({ statusCode: 200, documents: [] });
    //     chai.request(application.app)
    //         .get('/')
    //         .then(() => {
    //             chai.expect(stub.called).to.equal(true);
    //             stub.restore();
    //             done();
    //         });
    // });

    // it('should call addDrawing when accessing route api/database/send', (done: Mocha.Done) => {
    //     const stub = sinon.stub(DatabaseService.prototype, 'addDrawing').resolves();
    //     chai.request(application.app)
    //         .get('/send')
    //         .then(() => {
    //             chai.expect(stub.called).to.equal(true);
    //             stub.restore();
    //             done();
    //         });
    // });

    // it('should return time from dateservice on get request', async () => {
    //     databaseService.drawingURLS = ['url1', 'url2'];
    //     const expectedMessage: DrawingMe = { title: 'Test', body: new Date().toString() } as Message;
    //     databaseService.currentTime.resolves(expectedMessage);

    //     return supertest(app)
    //         .get('/')
    //         .expect(HTTP_STATUS_OK)
    //         .then((response: any) => {
    //             expect(response.body).to.deep.equal(expectedMessage);
    //         });
    // });

    // it('should return an error as a message on service fail', async () => {
    //     databaseService.currentTime.rejects(new Error('service error'));

    //     return supertest(app)
    //         .get('/api/date')
    //         .expect(HTTP_STATUS_OK)
    //         .then((response: any) => {
    //             expect(response.body.title).to.equal('Error');
    //         });
    // });
});
