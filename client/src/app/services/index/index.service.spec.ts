import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingData } from '@common/communication/drawing-data';
import { IndexService } from './index.service';

// tslint: disabled
fdescribe('IndexService', () => {
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
            labels: ['tag1'],
            width: 100,
            height: 100,
            body: 'Drawing data',
        };
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(indexService).toBeTruthy();
    });

    it('should call http request GET on getAllDrawingUrls', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        indexService.getAllDrawingUrls();
        expect(httpGetSpy).toHaveBeenCalled();
    });

    fit('should call http request DELETE on deleteDrawingById', async () => {
        const httpDeleteSpy = spyOn(indexService['http'], 'delete').and.stub();
        indexService.deleteDrawingById('1.png');
        expect(httpDeleteSpy).toHaveBeenCalled();
    });

    it('should call http request POST on postDrawing', () => {
        const postDrawingSpy = spyOn(indexService['http'], 'post').and.stub();
        // const pipeSpy = spyOn<any>(indexService['http'], 'pipe').and.stub();

        indexService.postDrawing(mockDrawing).pipe();
        expect(postDrawingSpy).toHaveBeenCalled();
    });
});
