import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeService } from '@app/services/tools/shape/shape.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

describe('Shape', () => {
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
});
