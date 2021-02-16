import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

// tslint:disable
describe('RectangleService', () => {
    let service: RectangleService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
    let drawSquareSpy: jasmine.Spy<any>;

    let mockPathData: Vec2[];

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mockPathData = [
            { x: 10, y: 10 },
            { x: 100, y: 100 },
        ];

        mouseEvent = {
            offsetX: 10,
            offsetY: 10,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawShape should call drawRectangle is isShiftShape is false', () => {
        service['isShiftShape'] = false;
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.stub();
        service.drawShape(previewCtxStub, mockPathData);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('drawShape should call drawSquare is isShiftShape is true', () => {
        service['isShiftShape'] = true;
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.stub();
        service.drawShape(previewCtxStub, mockPathData);
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalsy();
    });

    it('onMouseUp should clear canvas on preview context', () => {
        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseUp should call drawRectangle if isShiftShape is false', () => {
        service['isShiftShape'] = false;
        drawRectangleSpy = spyOn<any>(service, 'drawSquare').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call drawSquare if isShiftShape is true', () => {
        service['isShiftShape'] = true;
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it('onMouseUp should clear path', () => {
        let clearPathSpy = spyOn<any>(service, 'clearPath').and.stub();
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(service['pathData'].length).toEqual(0);
    });
});
