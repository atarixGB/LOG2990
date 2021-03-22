import { DOUBLE_MATH } from './../../../constants';
import { TestBed } from '@angular/core/testing';
//import { Vec2 } from '@app/classes/vec2';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TypeStyle } from './../../../interfaces-enums/type-style';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
    let polygonService: PolygonService;
    let canvasTestHelper: CanvasTestHelper;
    let mouseEvent: MouseEvent;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxPreviewPerimeterSpy: jasmine.Spy<any>;
    let drawPolygonSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'pathData']);
        TestBed.configureTestingModule({ providers: [{ provide: DrawingService, useValue: drawServiceSpy }] });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        polygonService = TestBed.inject(PolygonService);

        ctxPreviewPerimeterSpy = spyOn<any>(polygonService, 'ctxPreviewPerimeter');
        drawPolygonSpy = spyOn<any>(polygonService, 'drawPolygon');
        polygonService['drawingService'].baseCtx = baseCtxStub;
        polygonService['drawingService'].previewCtx = previewCtxStub;
        polygonService['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(polygonService).toBeTruthy();
    });

    it('onMouseUp should call clearCanvas if mouse was down', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = true;
        polygonService['radius'] = 2;
        polygonService['pointCircleCenter'] = { x: 25, y: 25 };

        polygonService.onMouseUp(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(polygonService['mouseDown']).toEqual(false);
    });

    it('onMouseUp should  not call clearCanvas if mouse was not down', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = false;

        polygonService.onMouseUp(mouseEvent);

        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should call drawPolygon if mouse was down', () => {
        polygonService.mouseDown = true;
        polygonService.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalled();
    });

    it('should not call drawPolygon if mouse was not down', () => {
        polygonService.mouseDown = false;
        polygonService.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalledTimes(0);
    });

    it('onMouseMove should call drawPolygon and ctxPreviewPerimeter', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService.mouseDown = true;

        polygonService.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPolygonSpy).toHaveBeenCalled();
        expect(ctxPreviewPerimeterSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call drawPolygon if mouseDown is false', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = false;

        polygonService.onMouseMove(mouseEvent);

        expect(drawPolygonSpy).not.toHaveBeenCalled();
    });

    it('drawPolygon should initialize Polygon Variables', () => {
        let initializePolygonVariablesSpy = spyOn<any>(polygonService, 'initializePolygonVariables');
        expect(initializePolygonVariablesSpy).toHaveBeenCalled();
    });

    it('drawPolygon should update canvas path line while respecting sides number', () => {
        polygonService.sides = 4;
        expect(baseCtxStub.lineTo).toHaveBeenCalledTimes(4);
    });
    it('drawPolygon should call changeSelectedType', () => {
        let changeSelectedTypeSpy = spyOn<any>(polygonService, 'changeSelectedType');
        expect(changeSelectedTypeSpy).toHaveBeenCalled();
    });

    it('getCircleCenter should be called while initializing polygon Variables', () => {
        const getCircleCenterSpy = spyOn<any>(polygonService, 'getCircleCenterSpy');
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        expect(getCircleCenterSpy).toHaveBeenCalled();
    });

    it('Radius value of polygone service should be correctly updated', () => {
        const firstPoint = { x: 25, y: 25 };
        const finalPoint = { x: 10, y: 10 };
        const result = Math.abs(finalPoint.x-firstPoint.y)/DOUBLE_MATH;
        expect(polygonService.radius).toEqual(result);
    });

    it('changeSelectedType should activate outline when stroke value received', () => {
        polygonService.selectType = TypeStyle.Stroke;
        expect(polygonService.strokeValue).toEqual(true);
        expect(polygonService.fillValue).toEqual(false);
    });

   
});
