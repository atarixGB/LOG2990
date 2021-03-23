//import { ColorOrder } from './../../../interfaces-enums/color-order';
import { TestBed } from '@angular/core/testing';
//import { Vec2 } from '@app/classes/vec2';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DOUBLE_MATH } from './../../../constants';
import { TypeStyle } from './../../../interfaces-enums/type-style';
import { PolygonService } from './polygon.service';

fdescribe('PolygonService', () => {
    let polygonService: PolygonService;
    let canvasTestHelper: CanvasTestHelper;
    let mouseEvent: MouseEvent;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let ctxPreviewPerimeterSpy: jasmine.Spy<any>;
    let drawPolygonSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'pathData']);
        canvasSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['lineTo']);
        TestBed.configureTestingModule({ providers: [{ provide: DrawingService, useValue: drawServiceSpy },{ provide: CanvasRenderingContext2D, useValue: canvasSpy }] });

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

    it('onMouseUp should call drawPolygon if mouse was down', () => {
        polygonService.mouseDown = true;
        polygonService.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call drawPolygon if mouse was not down', () => {
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

    it('onMouseMove with perimeter drawing style should call drawPolygon and ctxPreviewPerimeter', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = true;
        
        polygonService['selectType'] = 'stroke';

        polygonService.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPolygonSpy).toHaveBeenCalled();
        expect(ctxPreviewPerimeterSpy).toHaveBeenCalled();
    });

    it('onMouseMove with plain drawing style should call drawPolygon and ctxPreviewPerimeter', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = true;
        
        polygonService['selectType'] = 'fill';

        polygonService.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPolygonSpy).toHaveBeenCalled();
        expect(ctxPreviewPerimeterSpy).toHaveBeenCalled();
    });

    it('onMouseMove with plain drawing style should call drawPolygon and ctxPreviewPerimeter', () => {
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['mouseDown'] = true;
        
        polygonService['selectType'] = 'strokeFill';

        polygonService.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPolygonSpy).toHaveBeenCalled();
        expect(ctxPreviewPerimeterSpy).toHaveBeenCalled();
    });
    // it('drawPolygon should initialize Polygon Variables', () => {
    //     let initializePolygonVariablesSpy = spyOn<any>(polygonService, 'initializePolygonVariables');
    //     polygonService['drawPolygon'](baseCtxStub);
    //     expect(initializePolygonVariablesSpy).toHaveBeenCalled();
    // });

    // it('drawPolygon should update canvas path line while respecting sides number', () => {
    //     // const lineToSpy = spyOn<any>(baseCtxStub, 'lineTo').and.stub();
    //     polygonService.sides = 4;
    //     polygonService['drawPolygon'](canvasSpy);
    //     expect(canvasSpy.lineTo).toHaveBeenCalledTimes(4);
    // });
    // it('drawPolygon should call changeSelectedType', () => {
    //     let changeSelectedTypeSpy = spyOn<any>(polygonService, 'changeSelectedType');
    //     expect(changeSelectedTypeSpy).toHaveBeenCalled();
    // });
    //=========================================
    // it('drawPolygon should update strokeStyle with secondary and fillStyle with primary', () => {
        
    //     polygonService['firstPoint'] = { x: 25, y: 25 };
    //     polygonService['finalPoint'] = { x: 0, y: 0 };
    //     polygonService['pointCircleCenter'] = { x: 25, y: 25 };
    //     polygonService['lineWidth']=2;
        
    //     polygonService['colorManager'].selectedColor[ColorOrder.PrimaryColor].inString='#FFFFFF';
    //     polygonService['colorManager'].selectedColor[ColorOrder.SecondaryColor].inString='#23AABB';
    //     polygonService.drawPolygon(baseCtxStub);

    //     expect(baseCtxStub.strokeStyle).toEqual('#FFFFFF');
    //     expect(baseCtxStub.fillStyle).toEqual('#23AABB');
    //     expect(baseCtxStub.lineWidth).toEqual(2);
    //     expect(baseCtxStub.moveTo).toHaveBeenCalled();
        
    // });

    // it('drawPolygon should call initializePolygoneVariables and changeSelectedType', () => {
    //     let initializePolygonVariablesSpy = spyOn<any>(polygonService, 'initializePolygonVariables').and.stub();
    //     let changeSelectedTypeSpy = spyOn<any>(polygonService, 'changeSelectedType').and.stub();
    //     polygonService['firstPoint'] = { x: 25, y: 25 };
    //     polygonService['finalPoint'] = { x: 0, y: 0 };
    //     polygonService['pointCircleCenter'] = { x: 25, y: 25 };
    //     polygonService['lineWidth']=2;
        
    //     polygonService['colorManager'].selectedColor[ColorOrder.PrimaryColor].inString='#FFFFFF';
    //     polygonService['colorManager'].selectedColor[ColorOrder.SecondaryColor].inString='#23AABB';
    //     polygonService.drawPolygon(previewCtxStub);
    //     expect(initializePolygonVariablesSpy).toHaveBeenCalled();
    //     expect(changeSelectedTypeSpy).toHaveBeenCalled();
    // });
//-----------------------------------------
    it('getCircleCenter should be called while initializing polygon Variables', () => {
        const getCircleCenterSpy = spyOn<any>(polygonService, 'getCircleCenter');
        polygonService['firstPoint'] = { x: 25, y: 25 };
        polygonService['finalPoint'] = { x: 0, y: 0 };
        polygonService['initializePolygonVariables']();
        expect(getCircleCenterSpy).toHaveBeenCalled();
    });

    it('Radius value of polygone service should be correctly updated', () => {
        const firstPoint = { x: 25, y: 25 };
        const finalPoint = { x: 10, y: 10 };
        const result = Math.abs(finalPoint.x-firstPoint.y)/DOUBLE_MATH;
        polygonService['firstPoint'] = firstPoint;
        polygonService['finalPoint'] = finalPoint;
        polygonService['initializePolygonVariables']();
        expect(polygonService.radius).toEqual(result);
    });

    it('changeSelectedType should activate outline when stroke value received', () => {
        polygonService.selectType = TypeStyle.Stroke;
        polygonService.changeSelectedType();
        expect(polygonService.strokeValue).toEqual(true);
        expect(polygonService.fillValue).toEqual(false);
    });

    it('changeSelectedType should activate plein when fill value received', () => {
        polygonService.selectType = TypeStyle.Fill;
        polygonService.changeSelectedType();
        expect(polygonService.strokeValue).toEqual(false);
        expect(polygonService.fillValue).toEqual(true);
    });

    it('changeSelectedType should activate plein with outline when strokeFill value received', () => {
        polygonService.selectType = TypeStyle.StrokeFill;
        polygonService.changeSelectedType();
        expect(polygonService.strokeValue).toEqual(true);
        expect(polygonService.fillValue).toEqual(true);
    });
   
})