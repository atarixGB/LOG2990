import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.gridCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw grid on setgrid', () => {
        service.canvas.width = 10;
        service.canvas.height = 10;
        service.gridSpaces = 5;
        const moveToSpy = spyOn(service.gridCtx, 'moveTo');
        const lineToSpy = spyOn(service.gridCtx, 'lineTo');
        service.setGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(6);
        expect(lineToSpy).toHaveBeenCalledTimes(6);
    });
});
