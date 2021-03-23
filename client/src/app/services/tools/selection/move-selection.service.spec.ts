import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';
import { SelectionService } from './selection.service';

fdescribe('MoveSelectionService', () => {
    let service: MoveSelectionService;
    let drawingServiceSpy: DrawingService;
    let selectionServiceSpy: SelectionService;
    let mouseEventLeft: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
        });
        service = TestBed.inject(MoveSelectionService);

        console.log(service['selectionService']);

        service['selectionService'] = selectionServiceSpy;

        mouseEventLeft = {
            x: 25,
            y: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;
        spyOn(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseDown(mouseEventLeft);

        expect(service.mouseDownCoord).toEqual(expectedResult);
    });
});
