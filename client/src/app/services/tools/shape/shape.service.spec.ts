import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ShapeService } from './shape.service';

fdescribe('Shape', () => {
    let service: ShapeService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawingService, ColorManagerService],
        });
        service = TestBed.inject(ShapeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    fit('says hello world', () => {
        expect(service.helloWorld()).toEqual('Hello World');
    });
});
