import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IndexService } from './index.service';

// tslint: disabled
fdescribe('IndexService', () => {
    let httpMock: HttpTestingController;
    let indexService: IndexService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        indexService = TestBed.inject(IndexService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(indexService).toBeTruthy();
    });

    it('should call http request GET on getAllDrawingUrls', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/drawings';
        indexService.getAllDrawingUrls();
        expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl);
    });

    xit('should call http request POST on postDrawing', () => {
        // const postDrawingSpy = spyOn(indexService['http'], 'post').and.stub();
        // const pipeSpy = spyOn<any>(indexService['http'], 'pipe').and.stub();
        // indexService.postDrawing(mockDrawing).pipe();
        // expect(postDrawingSpy).toHaveBeenCalled();
    });

    xit('should call http request DELETE on deleteDrawingById', async () => {
        const httpDeleteSpy = spyOn(indexService['http'], 'delete').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/drawings/12345.png';
        indexService.deleteDrawingById('12345');
        expect(httpDeleteSpy).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http request GET on findDrawingById', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        const expectedId = 'http://localhost:3000/api/database/drawings/12345.png';
        indexService.findDrawingById('12345.png');
        expect(httpGetSpy).toHaveBeenCalledWith(expectedId);
    });

    it('should call http request GET on getTitles', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/drawings/meta/titles';
        indexService.getTitles();
        expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call http request GET on getTags', async () => {
        const httpGetSpy = spyOn(indexService['http'], 'get').and.stub();
        const expectedUrl = 'http://localhost:3000/api/database/drawings/meta/tags';
        indexService.getTags();
        expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl);
    });
});
