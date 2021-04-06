import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Segment } from '@app/classes/math-utils';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '../line/line.service';
import { LassoService } from './lasso.service';

// tslint:disable
fdescribe('LassoService', () => {
    let service: LassoService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxSpy: CanvasRenderingContext2D;
    let previewCtxSpy: CanvasRenderingContext2D;
    let lassoPreviewCtxSpy: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['drawLine', 'calculatePosition']);
        previewCtxSpy = jasmine.createSpyObj('CanvasRenderingContext', [
            'putImageData',
            'beginPath',
            'stroke',
            'lineWidth',
            'getImageData',
            'moveTo',
            'lineTo',
        ]);
        lassoPreviewCtxSpy = jasmine.createSpyObj('CanvasRenderingContext', [
            'putImageData',
            'beginPath',
            'stroke',
            'lineWidth',
            'getImageData',
            'moveTo',
            'lineTo',
        ]);
        baseCtxSpy = jasmine.createSpyObj('CanvasRenderingContext', [
            'putImageData',
            'beginPath',
            'stroke',
            'lineWidth',
            'getImageData',
            'moveTo',
            'lineTo',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        service = TestBed.inject(LassoService);
        service['drawingService'].baseCtx = baseCtxSpy;
        service['drawingService'].previewCtx = previewCtxSpy;
        service['drawingService'].lassoPreviewCtx = lassoPreviewCtxSpy;
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add mouse position to currentSegment vector', () => {
        const leftMouseEvent = {
            x: 25,
            y: 25,
            button: MouseButton.Left,
        } as MouseEvent;

        service.onMouseClick(leftMouseEvent);
        expect(service['currentSegment'].length).toEqual(1);
    });

    it('should reset all attribute and clear canvases if Escape is pressed', () => {
        service.mouseDown = true;
        service['nbSegments'] = 4;
        service['areIntesected'] = true;
        service['shiftKeyDown'] = true;
        service['currentSegment'] = [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            { x: 20, y: 20 },
        ];
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            { x: 20, y: 20 },
        ];
        const escapeKeyEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
        });
        service.handleKeyDown(escapeKeyEvent);

        expect(service.mouseDown).toBeFalse();
        expect(service['nbSegments']).toEqual(0);
        expect(service['areIntesected']).toBeFalse();
        expect(service['shiftKeyDown']).toBeFalse();
        expect(service['currentSegment'].length).toEqual(0);
        expect(service.polygonCoords.length).toEqual(0);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledTimes(2);
    });

    it('should call redrawPreviousState if Backspace key is pressed', () => {
        const redrawPreviousStateSpy = spyOn<any>(service, 'redrawPreviousState').and.stub();
        const backspaceKeyEvent = new KeyboardEvent('keydown', {
            key: 'Backspace',
        });
        service.handleKeyDown(backspaceKeyEvent);
        expect(redrawPreviousStateSpy).toHaveBeenCalled();
    });

    it('should set shiftKeyDown attribute to true if Shift key is pressed', () => {
        service['shiftKeyDown'] = false;
        const shiftKeyEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
        });
        service.handleKeyDown(shiftKeyEvent);
        expect(service['shiftKeyDown']).toBeTrue();
    });

    it('should set shiftKeyDown attribute to false if Shift key is up', () => {
        service['shiftKeyDown'] = true;
        const shiftKeyEvent = new KeyboardEvent('keyup', {
            key: 'Shift',
        });
        service.handleKeyUp(shiftKeyEvent);
        expect(service['shiftKeyDown']).toBeFalse();
    });

    it('should return true if two segments are confused', () => {
        const segment1: Segment = {
            initial: { x: 1, y: 4 },
            final: { x: 2, y: 2 },
        };
        const segment2: Segment = {
            initial: { x: 1, y: 4 },
            final: { x: 2, y: 2 },
        };
        const result = service['segmentsAreConfused'](segment1, segment2);
        expect(result).toBeTrue();
    });

    it('should return false if two segments are NOT confused', () => {
        const segment1: Segment = {
            initial: { x: 1, y: 4 },
            final: { x: 2, y: 2 },
        };
        const segment2: Segment = {
            initial: { x: 2, y: 2 },
            final: { x: 4, y: 3 },
        };
        const result = service['segmentsAreConfused'](segment1, segment2);
        expect(result).toBeFalse();
    });

    it('should set areIntersected attribute to true if two segments intersect', () => {
        service.mouseDownCoord = { x: 0, y: 2 };
        service['areIntesected'] = false;
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 2, y: 4 },
            { x: 3, y: 2 },
        ];
        service['checkIfCurrentSegmentIntersectWithPolygon']();
        expect(service['areIntesected']).toBeTrue();
    });

    it('should set areIntersected attribute to true if two segments are confused', () => {
        service.mouseDownCoord = { x: 2, y: 4 };
        service['areIntesected'] = false;
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 2, y: 4 },
            { x: 3, y: 2 },
        ];
        service['checkIfCurrentSegmentIntersectWithPolygon']();
        expect(service['areIntesected']).toBeTrue();
    });

    it('should set areIntersected attribute to false if two segments does NOT intersect', () => {
        service.mouseDownCoord = { x: 2, y: 1 };
        service['areIntesected'] = true;
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 2, y: 4 },
            { x: 3, y: 2 },
        ];
        service['checkIfCurrentSegmentIntersectWithPolygon']();
        expect(service['areIntesected']).toBeFalse();
    });

    it('should clear current segment', () => {
        service['currentSegment'] = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
        ];
        service['clearCurrentSegment']();
        expect(service['currentSegment'].length).toEqual(0);
    });

    it("should clear all polygon's coordinates", () => {
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];
        service['clearPolygonCoords']();
        expect(service.polygonCoords.length).toEqual(0);
    });
});
