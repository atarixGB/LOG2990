import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingData } from '@common/communication/drawing-data';
import { IndexService } from './index.service';

// tslint: disabled
describe('IndexService', () => {
    let httpMock: HttpTestingController;
    let indexService: IndexService;
    let mockDrawing: DrawingData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        indexService = TestBed.inject(IndexService);
        httpMock = TestBed.inject(HttpTestingController);
        mockDrawing = {
            title: 'title',
            labels: ['tag'],
            width: 100,
            height: 100,
            body: 'data',
        };
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(indexService).toBeTruthy();
    });

    it('should call http request GET on getAllDrawing', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database';
        indexService.getAllDrawings();
        expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl);
    });

    xit('should call http request POST on postDrawing', () => {
        const httpPostSpy = spyOn(indexService['http'], 'post').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/send';
        const expectedMessage: DrawingData = {
            title: 'title',
            labels: ['tag'],
            width: 100,
            height: 100,
            body: 'data',
        };
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json',
        };
        indexService.postDrawing(mockDrawing).subscribe((res) => {
            expect(httpPostSpy).toHaveBeenCalledWith(expectedUrl, expectedMessage, httpOptions);
            expect(res).toEqual(expectedMessage);
        });
    });

    xit('should call http request DELETE on deleteDrawingById', async () => {
        const httpDeleteSpy = spyOn(indexService['http'], 'delete').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/drawings/12345.png';
        indexService
            .deleteDrawingById('12345')
            .then(() => {
                expect(httpDeleteSpy).toHaveBeenCalledWith(expectedUrl);
            })
            .catch(fail);
    });
});
