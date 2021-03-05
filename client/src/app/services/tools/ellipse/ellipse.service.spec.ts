import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

//tslint:disable
describe('EllipseService', () => {
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
    let baseCtxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;

    let mockPathData: Vec2[];

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'pathData', 'fill', 'beginPath']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        baseCtxSpy = jasmine.createSpyObj('CanvasRenderingContext', ['ellipse', 'beginPath', 'fill', 'stroke']);

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
        service.drawShape(previewCtxStub, false);
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('drawShape should call drawSquare and drawCircle if Shift key is pressed', () => {
        service['isShiftShape'] = true;
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.stub();
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.stub();
        service.drawShape(previewCtxStub, false);
        expect(drawSquareSpy).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call drawEllipse if is shiftShape is false', () => {
        service['isShiftShape'] = false;

        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.stub();
        service.onMouseUp(mouseEvent);

        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('onMouseUp shoud set mouseDown property to false if not already', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalsy();
    });

    it('onMouseUp should call drawCircle on base context if Shift key is pressed', () => {
        service['isShiftShape'] = true;
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it('drawEllipse should ajust xRadius < 0 && yRadius < 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 2;
        const expectedOrigin1 = 3;
        const expectedXradius = 2;
        const expectedYradius = 3;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 4, y: 6 },
        //     { x: 0, y: 0 },
        // ];

        service['drawEllipse'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedXradius, expectedYradius, 0, rest, 0);
    });

    it('drawEllipse should ajust if only xRadius < 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 2;
        const expectedOrigin1 = 8;
        const expectedXradius = 2;
        const expectedYradius = 2;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 4, y: 6 },
        //     { x: 0, y: 10 },
        // ];

        service['drawEllipse'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedXradius, expectedYradius, 0, rest, 0);
    });

    it('drawEllipse should ajust if only yRadius < 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 8;
        const expectedOrigin1 = 2;
        const expectedXradius = 2;
        const expectedYradius = 2;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 6, y: 4 },
        //     { x: 10, y: 0 },
        // ];

        service['drawEllipse'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedXradius, expectedYradius, 0, rest, 0);
    });

    it('drawEllipse should ajust else', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 2;
        const expectedOrigin1 = 2;
        const expectedXradius = 2;
        const expectedYradius = 2;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 0, y: 0 },
        //     { x: 4, y: 4 },
        // ];

        service['drawEllipse'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedXradius, expectedYradius, 0, rest, 0);
    });

    it('drawCircle should ajust if width <= 0 && height >= 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 1;
        const expectedOrigin1 = 1;
        const expectedRadius = 1;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 2, y: 0 },
        //     { x: 0, y: 4 },
        // ];

        service['drawCircle'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedRadius, expectedRadius, 0, rest, 0);
    });

    it('drawCircle should ajust if height <= 0 && width >= 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 1;
        const expectedOrigin1 = 1;
        const expectedRadius = 1;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 0, y: 2 },
        //     { x: 4, y: 0 },
        // ];

        service['drawCircle'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedRadius, expectedRadius, 0, rest, 0);
    });

    it('drawCircle should ajust if height <= 0 && width <= 0', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 1;
        const expectedOrigin1 = 1;
        const expectedRadius = 1;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 2, y: 2 },
        //     { x: 0, y: 0 },
        // ];

        service['drawCircle'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedRadius, expectedRadius, 0, rest, 0);
    });

    it('drawCircle should ajust if other', () => {
        const expectedWidth = 5;

        const expectedOrigin0 = 4;
        const expectedOrigin1 = 4;
        const expectedRadius = 2;
        const rest = 2 * Math.PI;

        service.lineWidth = expectedWidth;

        // let path = [
        //     { x: 2, y: 2 },
        //     { x: 6, y: 6 },
        // ];

        service['drawCircle'](baseCtxSpy);

        expect(service.lineWidth).toEqual(expectedWidth);
        expect(baseCtxSpy.ellipse).toHaveBeenCalledWith(expectedOrigin0, expectedOrigin1, expectedRadius, expectedRadius, 0, rest, 0);
    });
});
