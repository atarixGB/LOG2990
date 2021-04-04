import { TestBed } from '@angular/core/testing';
import { NewDrawingService } from './new-drawing.service';

//tslint:disable
describe('NewDrawingService', () => {
    let service: NewDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NewDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    xit('should change clean to true', () => {
        service.requestCleaning();
        expect(service['clean']).toBeTrue();
    });

    it('should test clean is observable', () => {
        const spy = spyOn(service['clean'], 'asObservable').and.stub();
        service.getCleanStatus();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
