import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionTool } from '@app/classes/selection';
import { mouseEventLClick } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeSelectionService } from '@app/services/selection/resize-selection.service';
import { RectangleService } from '@app/services/tools//rectangle/rectangle.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionUtilsService } from '@app/services/utils/selection-utils.service';
import { EllipseSelectionService } from './ellipse-selection/ellipse-selection.service';
import { LassoService } from './lasso/lasso.service';
import { SelectionService } from './selection.service';

// tslint:disable
describe('SelectionService', () => {
    let service: SelectionService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let ellipseSelectionServiceSpy: jasmine.SpyObj<EllipseSelectionService>;
    let lassoServiceSpy: jasmine.SpyObj<LassoService>;
    let selectionUtilsServiceSpy: jasmine.SpyObj<SelectionUtilsService>;
    let resizeSelectionServiceSpy: jasmine.SpyObj<ResizeSelectionService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    let canvasSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onMouseDown', 'onMouseMove', 'handleKeyDown', 'handleKeyUp']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onMouseDown', 'onMouseMove', 'handleKeyDown', 'handleKeyUp']);
        ellipseSelectionServiceSpy = jasmine.createSpyObj('EllipseSelectionService', ['printEllipse', 'checkPixelInEllipse']);
        lassoServiceSpy = jasmine.createSpyObj('LassoService', [
            'onMouseClick',
            'onMouseDown',
            'onMouseMove',
            'onMouseUp',
            'handleKeyDown',
            'handleKeyUp',
            'resetAttributes',
            'printPolygon',
            'checkPixelInPolygon',
        ]);
        selectionUtilsServiceSpy = jasmine.createSpyObj('SelectionUtilsService', ['resizeSelection', 'resetParametersTools']);
        resizeSelectionServiceSpy = jasmine.createSpyObj('ResizeSelectionService', ['handleKeyDown', 'handleKeyUp']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addToStack', 'setToolInUse']);
        canvasSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: EllipseSelectionService, useValue: ellipseSelectionServiceSpy },
                { provide: LassoService, useValue: lassoServiceSpy },
                { provide: SelectionUtilsService, useValue: selectionUtilsServiceSpy },
                { provide: ResizeSelectionService, useValue: resizeSelectionServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: CanvasRenderingContext2D, useValue: canvasSpy },
            ],
        });
        service = TestBed.inject(SelectionService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call onMouseClick of LassoService if selection is Lasso on mouse click', () => {
        service.isLasso = true;
        lassoServiceSpy.selectionOver = false;
        service.newSelection = true;
        selectionUtilsServiceSpy.isResizing = false;
        service.selectionTerminated = true;

        service.onMouseClick(mouseEventLClick);
        expect(service.selectionTerminated).toBeFalse();
        expect(lassoServiceSpy.onMouseClick).toHaveBeenCalledWith(mouseEventLClick);
    });

    it('should not call onMouseClick of LassoService if selection is not Lasso on mouse click', () => {
        service.isLasso = false;
        lassoServiceSpy.selectionOver = false;
        service.newSelection = true;
        selectionUtilsServiceSpy.isResizing = false;
        service.selectionTerminated = true;

        service.onMouseClick(mouseEventLClick);
        expect(service.selectionTerminated).toBeTrue();
        expect(lassoServiceSpy.onMouseClick).not.toHaveBeenCalledWith(mouseEventLClick);
    });

    it('should handle selection correctly on mouse down', () => {
        const activeSelectionSpy = spyOn<any>(service, 'handleActiveSelectionOnMouseDown').and.stub();
        const resizedSelectionSpy = spyOn<any>(service, 'handleResizedSelectionOnMouseDown').and.stub();
        const activeLassoSelectionSpy = spyOn<any>(service, 'handleActiveLassoSelectionOnMouseDown').and.stub();

        service.onMouseDown(mouseEventLClick);
        expect(service.mouseDown).toBeTrue();
        expect(activeSelectionSpy).toHaveBeenCalled();
        expect(resizedSelectionSpy).toHaveBeenCalled();
        expect(activeLassoSelectionSpy).toHaveBeenCalled();
    });

    it('should resize selection correctly if Lasso is selected', () => {
        service.isLasso = true;
        lassoServiceSpy.selectionOver = false;
        service.mouseDown = true;
        selectionUtilsServiceSpy.isResizing = true;

        service.onMouseMove(mouseEventLClick);
        expect(lassoServiceSpy.onMouseMove).toHaveBeenCalled();
        expect(selectionUtilsServiceSpy.resizeSelection).toHaveBeenCalled();
    });

    xit('should call onMouseMove of ellipseService if isEllipse is true', () => {});

    it('should call onMouseUp of LassoService if isLasso is true', () => {
        service.isLasso = true;
        lassoServiceSpy.selectionOver = false;
        const handleLassoSelectionWhenOverSpy = spyOn<any>(service, 'handleLassoSelectionWhenOverOnMouseUp').and.stub();
        const handleResizedSelectionSpy = spyOn<any>(service, 'handleResizedSelectionOnMouseUp').and.stub();
        const handleActiveSelection = spyOn<any>(service, 'handleActiveSelectionOnMouseUp').and.stub();

        service.onMouseUp(mouseEventLClick);
        expect(lassoServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(handleLassoSelectionWhenOverSpy).toHaveBeenCalled();
        expect(handleResizedSelectionSpy).toHaveBeenCalled();
        expect(handleActiveSelection).toHaveBeenCalled();
    });

    it('should not call onMouseUp of LassoService if isLasso is false', () => {
        service.isLasso = false;
        lassoServiceSpy.selectionOver = false;
        const handleLassoSelectionWhenOverSpy = spyOn<any>(service, 'handleLassoSelectionWhenOverOnMouseUp').and.stub();
        const handleResizedSelectionSpy = spyOn<any>(service, 'handleResizedSelectionOnMouseUp').and.stub();
        const handleActiveSelection = spyOn<any>(service, 'handleActiveSelectionOnMouseUp').and.stub();

        service.onMouseUp(mouseEventLClick);
        expect(lassoServiceSpy.onMouseUp).not.toHaveBeenCalled();
        expect(handleLassoSelectionWhenOverSpy).toHaveBeenCalled();
        expect(handleResizedSelectionSpy).toHaveBeenCalled();
        expect(handleActiveSelection).toHaveBeenCalled();
    });

    it('should call onMouseUp if mouse is down and selection is not Lasso on mouse leave', () => {
        service.mouseDown = true;
        service.isLasso = false;
        const onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.stub();

        service.onMouseLeave(mouseEventLClick);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('should not call onMouseUp if mouse is not down or selection is Lasso on mouse leave', () => {
        service.mouseDown = false;
        service.isLasso = true;
        const onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.stub();

        service.onMouseLeave(mouseEventLClick);
        expect(onMouseUpSpy).not.toHaveBeenCalled();
    });

    it('should terminate selection if Escape key is pressed', () => {
        const keyboardEvent = { key: 'Escape', preventDefault(): void {} } as KeyboardEvent;
        const terminateSelectionSpy = spyOn<any>(service, 'terminateSelection').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(terminateSelectionSpy).toHaveBeenCalled();
    });

    it('should call handleKeyDown of resizeSelectionService if Shift key is pressed', () => {
        const keyboardEvent = { key: 'Shift', preventDefault(): void {} } as KeyboardEvent;
        resizeSelectionServiceSpy.handleKeyDown.and.stub();
        ellipseServiceSpy.handleKeyDown.and.stub();
        lassoServiceSpy.handleKeyDown.and.stub();
        rectangleServiceSpy.handleKeyDown.and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(resizeSelectionServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyDown).toHaveBeenCalled();
    });

    it('should not call handleKeyDown of resizeSelectionService if Shift key is not pressed', () => {
        const keyboardEvent = { key: 'x', preventDefault(): void {} } as KeyboardEvent;
        resizeSelectionServiceSpy.handleKeyDown.and.stub();
        ellipseServiceSpy.handleKeyDown.and.stub();
        lassoServiceSpy.handleKeyDown.and.stub();
        rectangleServiceSpy.handleKeyDown.and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyDown).toHaveBeenCalled();
    });

    it('should call handleKeyDown of ellipseService if isEllipse is true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.isEllipse = true;
        service.isLasso = false;
        ellipseServiceSpy.handleKeyDown.and.stub();
        lassoServiceSpy.handleKeyDown.and.stub();
        rectangleServiceSpy.handleKeyDown.and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(ellipseServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyDown).not.toHaveBeenCalled();
    });

    it('should call handleKeyDown of lassoService if isLasso is true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.isEllipse = false;
        service.isLasso = true;
        ellipseServiceSpy.handleKeyDown.and.stub();
        lassoServiceSpy.handleKeyDown.and.stub();
        rectangleServiceSpy.handleKeyDown.and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(ellipseServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyDown).not.toHaveBeenCalled();
    });

    it('should call handleKeyUp of resizeSelectionService if Shift key is pressed', () => {
        const keyboardEvent = { key: 'Shift', preventDefault(): void {} } as KeyboardEvent;
        resizeSelectionServiceSpy.handleKeyUp.and.stub();
        ellipseServiceSpy.handleKeyUp.and.stub();
        lassoServiceSpy.handleKeyUp.and.stub();
        rectangleServiceSpy.handleKeyUp.and.stub();

        service.handleKeyUp(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyUp).toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should not call handleKeyUp of resizeSelectionService if Shift key is not pressed', () => {
        const keyboardEvent = { key: 'x', preventDefault(): void {} } as KeyboardEvent;
        resizeSelectionServiceSpy.handleKeyUp.and.stub();
        ellipseServiceSpy.handleKeyUp.and.stub();
        lassoServiceSpy.handleKeyUp.and.stub();
        rectangleServiceSpy.handleKeyUp.and.stub();

        service.handleKeyUp(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should call handleKeyUp of ellipseService if isEllipse is true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.isEllipse = true;
        service.isLasso = false;
        resizeSelectionServiceSpy.handleKeyUp.and.stub();
        ellipseServiceSpy.handleKeyUp.and.stub();
        lassoServiceSpy.handleKeyUp.and.stub();
        rectangleServiceSpy.handleKeyUp.and.stub();

        service.handleKeyUp(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyUp).toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyUp).not.toHaveBeenCalled();
    });

    it('should call handleKeyUp of lassoService if isLasso is true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.isEllipse = false;
        service.isLasso = true;
        resizeSelectionServiceSpy.handleKeyUp.and.stub();
        ellipseServiceSpy.handleKeyUp.and.stub();
        lassoServiceSpy.handleKeyUp.and.stub();
        rectangleServiceSpy.handleKeyUp.and.stub();

        service.handleKeyUp(keyboardEvent);
        expect(resizeSelectionServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(lassoServiceSpy.handleKeyUp).toHaveBeenCalled();
        expect(rectangleServiceSpy.handleKeyUp).not.toHaveBeenCalled();
    });

    xit('should get image data from baseCtx and set attributes correctly when selecting all canvas', () => {
        const printMovedSelectionSpy = spyOn<any>(service, 'printMovedSelection').and.stub();
        const getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(new Image(10, 10));

        service.selectAll();
        expect(printMovedSelectionSpy).toHaveBeenCalled();
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(selectionUtilsServiceSpy.createBoundaryBox).toHaveBeenCalled();
        expect(service.activeSelection).toBeTrue();
        expect(service.newSelection).toBeTrue();
        expect(service.initialSelection).toBeTrue();
        expect(service.clearUnderneath).toBeTrue();
        expect(service.selectionTerminated).toBeFalse();
        expect(service.origin).toEqual({ x: 10, y: 10 });
        expect(service.destination.x).toEqual(10);
        expect(service.destination.y).toEqual(10);
        expect(service.width).toEqual(service.destination.x);
        expect(service.height).toEqual(service.destination.y);
    });

    it('should terminate selection correctly if activeSelection is true and selectionDeleted is false', () => {
        service.activeSelection = true;
        service.selectionDeleted = false;
        const printMovedSelectionSpy = spyOn<any>(service, 'printMovedSelection').and.stub();
        drawingServiceSpy.clearCanvas.and.stub();
        selectionUtilsServiceSpy.resetParametersTools.and.stub();
        lassoServiceSpy.resetAttributes.and.stub();

        service.terminateSelection();
        expect(printMovedSelectionSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(selectionUtilsServiceSpy.resetParametersTools).toHaveBeenCalled();
        expect(lassoServiceSpy.selectionOver).toBeFalse();
        expect(service.activeSelection).toBeFalse();
        expect(service.newSelection).toBeTrue();
        expect(service.imageMoved).toBeFalse();
        expect(service.selectionTerminated).toBeTrue();
        expect(service.mouseDown).toBeFalse();
    });

    it('should terminate selection correctly if activeSelection is true and selectionDeleted is false', () => {
        service.activeSelection = true;
        service.selectionDeleted = true;
        const printMovedSelectionSpy = spyOn<any>(service, 'printMovedSelection').and.stub();
        drawingServiceSpy.clearCanvas.and.stub();
        selectionUtilsServiceSpy.resetParametersTools.and.stub();
        lassoServiceSpy.resetAttributes.and.stub();

        service.terminateSelection();
        expect(printMovedSelectionSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(selectionUtilsServiceSpy.resetParametersTools).toHaveBeenCalled();
        expect(lassoServiceSpy.selectionOver).toBeFalse();
        expect(service.activeSelection).toBeFalse();
        expect(service.newSelection).toBeTrue();
        expect(service.imageMoved).toBeFalse();
        expect(service.selectionTerminated).toBeTrue();
        expect(service.mouseDown).toBeFalse();
    });

    it('should not terminate selection if activeSelection is false and selectionDeleted is false', () => {
        service.activeSelection = false;
        const printMovedSelectionSpy = spyOn<any>(service, 'printMovedSelection').and.stub();

        service.terminateSelection();
        expect(printMovedSelectionSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(selectionUtilsServiceSpy.resetParametersTools).not.toHaveBeenCalled();
    });

    it('should put image data on baseCtx of selection if Rectangle selection is selected', () => {
        service.imageMoved = true;
        service.origin = { x: 100, y: 100 };
        const origin = { x: 100, y: 100 };
        const destination = { x: 200, y: 200 };
        service.selectionObject = new SelectionTool(origin, destination, 100, 100);
        const putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.stub();
        const addToUndoStackSpy = spyOn<any>(service, 'addToUndoStack').and.stub();

        service.printMovedSelection();
        expect(service.imageMoved).toBeFalse();
        expect(service.selectionObject.origin).toEqual(service.origin);
        expect(putImageDataSpy).toHaveBeenCalled();
        expect(addToUndoStackSpy).toHaveBeenCalled();
    });

    it('should print ellipse if Ellipse selection is selected', () => {
        service.imageMoved = true;
        service.origin = { x: 100, y: 100 };
        const origin = { x: 100, y: 100 };
        const destination = { x: 200, y: 200 };
        service.selectionObject = new SelectionTool(origin, destination, 100, 100);
        service.isEllipse = true;
        service.isLasso = false;
        ellipseSelectionServiceSpy.printEllipse.and.stub();
        const addToUndoStackSpy = spyOn<any>(service, 'addToUndoStack').and.stub();

        service.printMovedSelection();
        expect(service.imageMoved).toBeFalse();
        expect(service.selectionObject.origin).toEqual(service.origin);
        expect(ellipseSelectionServiceSpy.printEllipse).toHaveBeenCalled();
        expect(addToUndoStackSpy).toHaveBeenCalled();
    });

    it('should print polygon if Lasso selection is selected', () => {
        service.imageMoved = true;
        service.origin = { x: 100, y: 100 };
        const origin = { x: 100, y: 100 };
        const destination = { x: 200, y: 200 };
        service.selectionObject = new SelectionTool(origin, destination, 100, 100);
        service.isEllipse = false;
        service.isLasso = true;
        lassoServiceSpy.printPolygon.and.stub();
        const addToUndoStackSpy = spyOn<any>(service, 'addToUndoStack').and.stub();

        service.printMovedSelection();
        expect(service.imageMoved).toBeFalse();
        expect(service.selectionObject.origin).toEqual(service.origin);
        expect(lassoServiceSpy.printPolygon).toHaveBeenCalled();
        expect(addToUndoStackSpy).toHaveBeenCalled();
    });

    it('should not print moved selection if image was not moved', () => {
        const addToUndoStackSpy = spyOn<any>(service, 'addToUndoStack').and.stub();
        ellipseSelectionServiceSpy.printEllipse.and.stub();
        lassoServiceSpy.printPolygon.and.stub();
        const putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.stub();

        service.printMovedSelection();
        expect(ellipseSelectionServiceSpy.printEllipse).not.toHaveBeenCalled();
        expect(lassoServiceSpy.printPolygon).not.toHaveBeenCalled();
        expect(putImageDataSpy).not.toHaveBeenCalled();
        expect(addToUndoStackSpy).not.toHaveBeenCalled();
    });

    it('should get selection data correctly if Rectangle selection is selected', () => {
        service.origin = { x: 10, y: 10 };
        service.destination = { x: 30, y: 30 };
        service.width = 20;
        service.height = 20;
        service.selectionObject = new SelectionTool(service.origin, service.destination, service.width, service.height);
        const getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(new ImageData(10, 10));
        const initialSelectionObjectSpy = spyOn<any>(service, 'initialseSelectionObject').and.stub();
        service.isEllipse = false;
        service.isLasso = false;

        service.getSelectionData(service['drawingService'].baseCtx);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(initialSelectionObjectSpy).toHaveBeenCalled();
        expect(service.selectionObject.image).toEqual(service.selection);
    });

    it('should get selection data correctly if Ellipse selection is selected', () => {
        service.origin = { x: 10, y: 10 };
        service.destination = { x: 30, y: 30 };
        service.width = 20;
        service.height = 20;
        service.selectionObject = new SelectionTool(service.origin, service.destination, service.width, service.height);
        const getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(new ImageData(10, 10));
        const initialSelectionObjectSpy = spyOn<any>(service, 'initialseSelectionObject').and.stub();
        service.isEllipse = true;
        ellipseSelectionServiceSpy.checkPixelInEllipse.and.stub();
        service.isLasso = false;

        service.getSelectionData(service['drawingService'].baseCtx);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(initialSelectionObjectSpy).toHaveBeenCalled();
        expect(ellipseSelectionServiceSpy.checkPixelInEllipse).toHaveBeenCalled();
        expect(service.selectionObject.image).toEqual(service.selection);
    });

    it('should get selection data correctly if Lasso selection is selected', () => {
        service.origin = { x: 10, y: 10 };
        service.destination = { x: 30, y: 30 };
        service.width = 20;
        service.height = 20;
        service.selectionObject = new SelectionTool(service.origin, service.destination, service.width, service.height);
        const getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(new ImageData(10, 10));
        const initialSelectionObjectSpy = spyOn<any>(service, 'initialseSelectionObject').and.stub();
        service.isEllipse = false;
        lassoServiceSpy.checkPixelInPolygon.and.stub();
        service.isLasso = true;

        service.getSelectionData(service['drawingService'].baseCtx);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(initialSelectionObjectSpy).toHaveBeenCalled();
        expect(lassoServiceSpy.checkPixelInPolygon).toHaveBeenCalled();
        expect(service.selectionObject.image).toEqual(service.selection);
    });

    it('should initialize service dimensions correctly', () => {
        const origin = { x: 0, y: 0 };
        const destination = { x: 100, y: 100 };
        service.selectionObject = new SelectionTool(origin, destination, destination.x - origin.x, destination.y - origin.y);

        service.initialiseServiceDimensions();
        expect(service.origin).toEqual(service.selectionObject.origin);
        expect(service.destination).toEqual(service.selectionObject.destination);
        expect(service.width).toEqual(service.selectionObject.width);
        expect(service.height).toEqual(service.selectionObject.height);
    });

    it('should add to undo stack', () => {
        const origin = { x: 0, y: 0 };
        const destination = { x: 100, y: 100 };
        service.selectionObject = new SelectionTool(origin, destination, destination.x - origin.x, destination.y - origin.y);
        const initialseSelectionObjectSpy = spyOn<any>(service, 'initialseSelectionObject').and.stub();
        undoRedoServiceSpy.addToStack.and.stub();
        undoRedoServiceSpy.setToolInUse.and.stub();

        service['addToUndoStack']();
        expect(initialseSelectionObjectSpy).toHaveBeenCalled();
        expect(undoRedoServiceSpy.addToStack).toHaveBeenCalledWith(service.selectionObject);
        expect(undoRedoServiceSpy.setToolInUse).toHaveBeenCalledWith(false);
    });

    // it('onMouseDown does nothing if not down', () => {
    //     service.mouseDown = false;
    //     service.onMouseDown(mouseEventRClick);
    //     expect(InitialiseToolSpy).not.toHaveBeenCalled();
    // });

    // it('onMouseDown should use rectangle if its the selection mode', () => {
    //     service.isEllipse = false;
    //     service.onMouseDown(mouseEventLClick);
    //     expect(InitialiseToolSpy).toHaveBeenCalled();
    //     expect(rectangleServiceSpy.onMouseDown).toHaveBeenCalled();
    //     expect(ellipseServiceSpy.onMouseDown).not.toHaveBeenCalled();
    // });

    // it('onMouseDown should use ellipse if its the selection mode', () => {
    //     service.isEllipse = true;
    //     service.onMouseDown(mouseEventLClick);
    //     expect(InitialiseToolSpy).toHaveBeenCalled();
    //     expect(rectangleServiceSpy.onMouseDown).not.toHaveBeenCalled();
    //     expect(ellipseServiceSpy.onMouseDown).toHaveBeenCalled();
    // });

    // it('onMouseMove should not do something if mouse not down', () => {
    //     service.onMouseMove(mouseEventRClick);
    //     expect(rectangleServiceSpy.onMouseMove).not.toHaveBeenCalled();
    //     expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
    // });

    // it('onMouseMove should call rectangle onMouseMove if its the selection mode', () => {
    //     service.isEllipse = false;
    //     service.mouseDown = true;
    //     service.onMouseMove(mouseEventLClick);
    //     expect(rectangleServiceSpy.onMouseMove).toHaveBeenCalled();
    //     expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
    // });

    // it('onMouseMove should call ellipse onMouseMove if its the selection mode', () => {
    //     service.isEllipse = true;
    //     service.mouseDown = true;
    //     service.onMouseMove(mouseEventLClick);
    //     expect(rectangleServiceSpy.onMouseMove).not.toHaveBeenCalled();
    //     expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
    // });

    // it('onMouseMove should put the new selcetion to false if its in the selection area', () => {
    //     service.activeSelection = true;
    //     service.selectionTerminated = false;
    //     spyOn(service, 'mouseInSelectionArea').and.returnValue(true);
    //     service.onMouseMove(mouseEventLClick);

    //     expect(service.newSelection).toEqual(false);
    // });

    // it('onMouseMove should put the new selcetion to true if its not in the selection area', () => {
    //     service.activeSelection = true;
    //     service.selectionTerminated = false;
    //     spyOn(service, 'mouseInSelectionArea').and.returnValue(false);
    //     service.onMouseMove(mouseEventLClick);

    //     expect(service.newSelection).toEqual(true);
    // });

    // it('onMouseUp should not change the parameters if mouse is not down ', () => {
    //     service.activeSelection = false;
    //     service.onMouseUp(mouseEventLClick);
    //     expect(service.activeSelection).toEqual(false);
    // });

    // it('onMouseLeave call onMouseUp if the mouse is down', () => {
    //     service.mouseDown = true;
    //     const onMouseUpSpy = spyOn(service, 'onMouseUp');
    //     service.onMouseLeave(mouseEventLClick);
    //     expect(onMouseUpSpy).toHaveBeenCalled();
    // });

    // it('handleKeyDown for a rectangle selection', () => {
    //     const event = new KeyboardEvent('1');
    //     service.isEllipse = false;
    //     service.handleKeyDown(event);
    //     expect(rectangleServiceSpy.handleKeyDown).toHaveBeenCalled();
    // });

    // it('handleKeyDown for a ellipse selection', () => {
    //     const event = new KeyboardEvent('2');
    //     service.isEllipse = true;
    //     service.handleKeyDown(event);
    //     expect(ellipseServiceSpy.handleKeyDown).toHaveBeenCalled();
    // });

    // it('handleKeyUp for a rectangle selection', () => {
    //     const event = new KeyboardEvent('1');
    //     service.isEllipse = false;
    //     service.handleKeyUp(event);
    //     expect(rectangleServiceSpy.handleKeyUp).toHaveBeenCalled();
    // });

    // it('handleKeyUP for a ellipse selection', () => {
    //     const event = new KeyboardEvent('2');
    //     service.isEllipse = true;
    //     service.handleKeyUp(event);
    //     expect(ellipseServiceSpy.handleKeyUp).toHaveBeenCalled();
    // });

    // it('mouseInselectionArea return true if is in the selection area', () => {
    //     const origin = { x: 0, y: 0 };
    //     const destination = { x: 5, y: 5 };
    //     const mouseCoordTest = { x: 2, y: 2 };

    //     const result = service.mouseInSelectionArea(origin, destination, mouseCoordTest);
    //     expect(result).toEqual(result);
    // });

    // it('clearUnderneath shape clear in ellipse if it the selection form', () => {
    //     const points = { x: 10, y: 10 };
    //     const width = 10;
    //     const height = 10;
    //     service.origin = points;
    //     service['width'] = width;
    //     service['height'] = height;
    //     service.isEllipse = true;
    //     const spyEllipse = spyOn(service['drawingService'].baseCtx, 'ellipse');
    //     const spyfill = spyOn(service['drawingService'].baseCtx, 'fill');
    //     service.clearUnderneathShape();
    //     expect(spyEllipse).toHaveBeenCalled();
    //     expect(spyfill).toHaveBeenCalled();
    // });

    // it('clearUnderneath shape clear in rectangle if it the selection form', () => {
    //     const points = { x: 10, y: 10 };
    //     const width = 10;
    //     const height = 10;
    //     service.origin = points;
    //     service['width'] = width;
    //     service['height'] = height;
    //     service.isEllipse = false;
    //     const spyEllipse = spyOn(service['drawingService'].baseCtx, 'ellipse');
    //     const spyfill = spyOn(service['drawingService'].baseCtx, 'fillRect');
    //     service.clearUnderneathShape();
    //     expect(spyEllipse).not.toHaveBeenCalled();
    //     expect(spyfill).toHaveBeenCalled();
    // });

    // it('terminateSelection doesnt terminate if its not an activeSelection', () => {
    //     service.activeSelection = false;
    //     service.newSelection = false;
    //     service.imageMoved = true;
    //     service.selectionTerminated = false;
    //     service.mouseDown = true;
    //     service.terminateSelection();
    //     expect(service.activeSelection).toEqual(false);
    //     expect(service.newSelection).toEqual(false);
    //     expect(service.imageMoved).toEqual(true);
    //     expect(service.selectionTerminated).toEqual(false);
    //     expect(service.mouseDown).toEqual(true);
    // });

    // it('getSelectionData use the good range to select data', () => {
    //     const origin = { x: 0, y: 0 };
    //     const width = 10;
    //     const height = 10;
    //     service.origin = origin;
    //     service['width'] = width;
    //     service['height'] = height;
    //     const calculateSpy = spyOn<any>(service, 'calculateDimension').and.stub();
    //     service['getSelectionData'](canvasSpy);
    //     expect(calculateSpy).toHaveBeenCalled();
    //     expect(canvasSpy.getImageData).toHaveBeenCalled();
    // });

    // it('getSelectionData check the pixels in ellipse', () => {
    //     const origin = { x: 0, y: 0 };
    //     const width = 10;
    //     const height = 10;
    //     service.isEllipse = true;
    //     service.origin = origin;
    //     service['width'] = width;
    //     service['height'] = height;
    //     const calculateSpy = spyOn<any>(service, 'calculateDimension').and.stub();
    //     const checkPixelSpy = spyOn<any>(service, 'checkPixelInEllipse').and.stub();
    //     service['getSelectionData'](canvasSpy);
    //     expect(calculateSpy).toHaveBeenCalled();
    //     expect(canvasSpy.getImageData).toHaveBeenCalled();
    //     expect(checkPixelSpy).toHaveBeenCalled();
    // });

    // it('resetParametersTools resets all the parameters ', () => {
    //     const defaultLine = 10;
    //     const newLine = 4;
    //     service['previousLineWidthRectangle'] = defaultLine;
    //     service['previousLineWidthEllipse'] = defaultLine;

    //     service['rectangleService'].mouseDown = true;
    //     service['rectangleService'].lineWidth = newLine;
    //     service['rectangleService'].isSelection = true;
    //     service['ellipseService'].mouseDown = true;
    //     service['ellipseService'].lineWidth = newLine;
    //     service['ellipseService'].isSelection = true;
    //     service['resetParametersTools']();
    //     expect(rectangleServiceSpy.mouseDown).toEqual(false);
    //     expect(rectangleServiceSpy.lineWidth).toEqual(defaultLine);
    //     expect(rectangleServiceSpy.isSelection).toEqual(false);
    //     expect(ellipseServiceSpy.mouseDown).toEqual(false);
    //     expect(ellipseServiceSpy.lineWidth).toEqual(defaultLine);
    //     expect(ellipseServiceSpy.isSelection).toEqual(false);
    // });
});
