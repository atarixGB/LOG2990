import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';
import { SelectionService } from './selection.service';

fdescribe('MoveSelectionService', () => {
    let service: MoveSelectionService;
    let drawingServiceSpy: DrawingService;
    let selectionService: SelectionService;
    let mouseEventLeft: MouseEvent;
    let keyboardEvent: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: DrawingService, useValue: selectionService },
            ],
        });
        service = TestBed.inject(MoveSelectionService);
        selectionService = TestBed.inject(SelectionService);

        mouseEventLeft = {
            x: 25,
            y: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;
        selectionService.selectionTerminated = false;

        let getPositionSpy = spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 25, y: 25 });

        service.onMouseDown(mouseEventLeft);
        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(getPositionSpy).toHaveBeenCalled();
    });

    it('should call moveSelectionMouse when onMouseMove is called', () => {
        service.mouseDown = true;
        selectionService.selectionTerminated = false;
        let clearUnderneathShapeSpy = spyOn<any>(service, 'clearUnderneathShape').and.callThrough();
        let moveSelectionMouseSpy = spyOn<any>(service, 'moveSelectionMouse').and.callThrough();
        service.onMouseMove(mouseEventLeft);
        expect(clearUnderneathShapeSpy).toHaveBeenCalled();
        expect(moveSelectionMouseSpy).toHaveBeenCalled();
    });

    it('should call initialSelection when onMouseMove is called', () => {
        let initialSelectionSpy = spyOn<any>(service, 'initialSelection').and.callThrough();
        service.onMouseMove(mouseEventLeft);
        expect(initialSelectionSpy).toHaveBeenCalled();
    });

    it('should call terminateSelection if Escape key is down and set mouseDown to false', () => {
        service.mouseDown = true;
        keyboardEvent = { key: 'Escape', preventDefault(): void {} } as KeyboardEvent;
        let terminateSelectionSpy = spyOn<any>(selectionService, 'terminateSelection').and.callThrough();
        service.handleKeyDown(keyboardEvent);
        expect(terminateSelectionSpy).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
    });

    it('should set mouseDown to false when onMouseUp is called', () => {
        service.mouseDown = true;
        selectionService.selection = new ImageData(0, 0);
        selectionService.origin = { x: 0, y: 0 };
        selectionService.destination = { x: 25, y: 25 };
        let createBoundaryBoxSpy = spyOn(selectionService, 'createBoundaryBox').and.stub();

        service.onMouseUp(mouseEventLeft);

        expect(createBoundaryBoxSpy).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
    });

    it('should call handlekeyDownArrow when arrow key is down', () => {
        selectionService.activeSelection = true;

        let handleKeyDownArrowSpy = spyOn<any>(service, 'handleKeyDownArrow').and.callThrough();
        keyboardEvent = { key: 'ArrowLeft', preventDefault(): void {} } as KeyboardEvent;
        service.handleKeyDown(keyboardEvent);
        expect(handleKeyDownArrowSpy).toHaveBeenCalled();
    });

    fit('should call handlekeyUpArrow when arrow key is up', () => {
        let handleKeyUpArrowSpy = spyOn<any>(service, 'handleKeyUpArrow').and.callThrough();
        let createBoundaryBoxSpy = spyOn<any>(selectionService, 'createBoundaryBox').and.callThrough();
        keyboardEvent = new KeyboardEvent('keyup', {
            key: 'LeftArrow',
        });
        service.handleKeyUp(keyboardEvent);
        expect(handleKeyUpArrowSpy).toHaveBeenCalled();
        expect(createBoundaryBoxSpy).toHaveBeenCalled();
    });
});
