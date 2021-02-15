import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS, TypeOfJunctions } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

// tslint:disable:no-any
fdescribe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawingServiceSpy: any;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        drawingServiceSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    fit('should be created', () => {
        expect(service).toBeTruthy();
    });

    fit('should have a DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS and a regular junction type on start', () => {
        const junctionRadius = service.junctionRadius;
        const lineWidth = service.lineWidth;
        const junctionType = service.junctionType;
        expect(junctionRadius).toEqual(DEFAULT_JUNCTION_RADIUS);
        expect(lineWidth).toEqual(DEFAULT_LINE_THICKNESS);
        expect(junctionType).toEqual(TypeOfJunctions.Regular);
    });

    fit('should set mouseDownCoord to correct position when onMouseClick is called', () => {
        const leftClickMouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        spyOn(service.mouseDownCoord, 'getPositionFromMouse').and.returnValue(leftClickMouseEvent);
        service.onMouseClick(mouseEvent);
        console.log(service.mouseDownCoord);
        expect(service.mouseDownCoord).toEqual(leftClickMouseEvent);
    });

    it('should set mouseDown property to true on left click', () => {
        service.onMouseClick(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    fit('should set mouseDown to false when onMouseDoubleClick is called', () => {
        service.onMouseDoubleClick(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });
});
