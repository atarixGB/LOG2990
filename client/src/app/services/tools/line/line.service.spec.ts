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
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawLineSpy: jasmine.Spy<any>;

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

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
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

    fit('should called drawLine when onMouseUp is called', () => {
        const mockMousePosition: Vec2 = { x: 25, y: 25 };
        spyOn(service, 'getPositionFromMouse').and.returnValue(mockMousePosition);
        service.mouseDown = true;
        service['hasPressedShiftKey'] = false;
        drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalledWith(baseCtxStub, service['pathData']);
    });
});
