import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

fdescribe('EllipseService', () => {
    let service: EllipseService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
    let drawSquareSpy: jasmine.Spy<any>;
    let drawEllipseSpy: jasmine.Spy<any>;
    let drawCircleSpy: jasmine.Spy<any>;

    let mockPathData: Vec2[];

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'pathData']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mockPathData = [
            { x: 10, y: 10 },
            { x: 100, y: 100 },
        ];
        service['pathData'] = mockPathData;
        mouseEvent = {
            offsetX: 10,
            offsetY: 10,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawShape should call drawRectangle and drawEllipse if Shift key is not pressed', () => {
        service['isShiftShape'] = false;
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.stub();
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.stub();
        service.drawShape(previewCtxStub, mockPathData);
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('drawShape should call drawSquare and drawCircle if Shift key is pressed', () => {
        service['isShiftShape'] = true;
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.stub();
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.stub();
        service.drawShape(previewCtxStub, mockPathData);
        expect(drawSquareSpy).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    // to fix
    it('onMouseUp shoud set mouseDown property to false', () => {
        service.onMouseUp(mouseEvent);
        console.log(service.mouseDown);
        expect(service.mouseDown).toBeFalsy();
    });

    // to fix
    it('onMouseUp should call drawCircle on base context if Shift key is pressed', () => {
        service['isShiftShape'] = true;
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.stub();
        service.drawShape(baseCtxStub, mockPathData);
        expect(drawCircleSpy).toHaveBeenCalled();
    });
});
