import { TestBed } from '@angular/core/testing';
import { SprayService } from './spray.service';

// tslint:disable:
describe('SprayHandlerService', () => {
    let service: SprayService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SprayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
