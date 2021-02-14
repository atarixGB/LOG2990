import { TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { LineService } from './line.service';

describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let drawingServiceSpy = jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let pathData: Vec2[];
    let drawLineSpy

    beforeEach(() => {
        TestBed.configureTestingModule({

        });
        service = TestBed.inject(LineService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
