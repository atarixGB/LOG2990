import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS, TypeOfJunctions } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

// tslint:disable
fdescribe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let pathData: Vec2[];
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawLineSpy: jasmine.Spy<any>;
    let drawConstrainedLineSpy: jasmine.Spy<any>;
    let getPositionFromMouseSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            x: 25,
            y: 25,
            button: 0,
        } as MouseEvent;

        pathData = [
            { x: 10, y: 10 },
            { x: 25, y: 25 },
        ] as Vec2[];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS and a regular junction type on start', () => {
        const junctionRadius = service.junctionRadius;
        const lineWidth = service.lineWidth;
        const junctionType = service.junctionType;
        expect(junctionRadius).toEqual(DEFAULT_JUNCTION_RADIUS);
        expect(lineWidth).toEqual(DEFAULT_LINE_THICKNESS);
        expect(junctionType).toEqual(TypeOfJunctions.Regular);
    });

    // onMouseClick
    it('should set mouseDown property to true on left click', () => {
        service.onMouseClick(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('should set mouseDownCoord to correct position when onMouseClick is called', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;
        spyOn(service, 'getPositionFromMouse').and.returnValue(expectedResult);
        service.onMouseClick(mouseEvent);

        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(service['coordinates'].length).toEqual(1);
        expect(service['coordinates'][0]).toEqual(expectedResult);
    });

    // onMouseDoucleClick
    it('should set mouseDown to false when onMouseDoubleClick is called', () => {
        service.onMouseDoubleClick(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('should clear path data when mouse is double click', () => {
        spyOn<any>(service, 'clearPath');
        service.onMouseDoubleClick(mouseEvent);
        expect(service['pathData'].length).toEqual(0);
    });

    // On mouseUp
    it('should call drawLine when onMouseUp is called and shift key is not pressed', () => {
        const mockMousePosition: Vec2 = { x: 25, y: 25 };
        service['pathData'] = pathData;
        service.mouseDown = true;
        service['hasPressedShiftKey'] = false;

        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.returnValue(mockMousePosition);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.stub().and.callThrough();

        service.onMouseUp(mouseEvent);

        expect(getPositionFromMouseSpy).toHaveBeenCalledWith(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalledWith(service['drawingService'].baseCtx, pathData);
    });

    it('should call drawConstrainedLine when onMouseUp is called and shift key is pressed', () => {
        service['coordinates'] = pathData;
        service.mouseDown = true;
        service['hasPressedShiftKey'] = true;

        drawConstrainedLineSpy = spyOn<any>(service, 'drawConstrainedLine').and.stub();

        service.onMouseUp(mouseEvent);
        expect(drawConstrainedLineSpy).toHaveBeenCalledWith(service['drawingService'].baseCtx, service['coordinates'], mouseEvent);
    });

    it('should call getCanvasState when onMouseUp is called', () => {
        let getCanvasStateSpy = spyOn<any>(service, 'getCanvasState').and.stub();
        service.onMouseUp(mouseEvent);
        expect(getCanvasStateSpy).toHaveBeenCalled();
    });

    it('should clear path when onMouseUp is called', () => {
        let clearPathSpy = spyOn<any>(service, 'clearPath').and.stub();
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(service['pathData'].length).toEqual(0);
    });
});
