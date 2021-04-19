import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionTool } from '@app/classes/selection';
import { ResizeSelectionService } from './resize-selection.service';

// tslint:disable
fdescribe('ResizeSelectionService', () => {
    let service: ResizeSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    const OPPOSITE_SIGN = -1;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(ResizeSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        service['selectionObject'] = new SelectionTool({x:0, y:0}, {x:10, y:10}, 10, 10);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /*
    it('checkIfMouseIsOnControlPoint should return true if  mouse on a control point', () => {
        const mouseCoord = {x: 0, y: 0};
        service.controlPointsCoord[0].x = 0;
        service.controlPointsCoord[0].y =
        const spyCheckControlPoint = spyOn(service, 'checkIfMouseIsOnControlPoint');
        service.checkIfMouseIsOnControlPoint(mouseCoord);
        expect(service['currentControlPoint']).toEqual(0);
        expect(spyCheckControlPoint).toEqual(true);
    });
    */

    it('onMouseMove should change the selection and mouse coord', () => {
        const mouseCoord = {x: 0, y: 0};
        const oldMouseCoords ={x: 10, y: 10};
        const origin = {x: 0, y:0};
        const dest = {x: 0, y: 0};
        const newOrigin = {x: 10, y: 10};
        const newDest = {x: 10, y: 10};
        const width = 10;
        const lenght = 10;
        const oldSelection = new SelectionTool(origin, dest, width, lenght);
        
        service['selectionObject'] = oldSelection;
        service['mouseCoord'] = oldMouseCoords;

        const newSelection = new SelectionTool(newOrigin, newDest, width, lenght);
        const spyResize = spyOn<any>(service, 'controlPointInResize').and.stub();

        service.onMouseMove(mouseCoord, newSelection);
        expect(spyResize).toHaveBeenCalled();
        expect(service['selectionObject']).toEqual(newSelection);
        expect(service['mouseCoord']).toEqual(mouseCoord);
    });

    it('handleKeyDown should prevents defaults if shift is pressed', () => {
        const Shift = new KeyboardEvent('keydown', { key: 'Shift' });
        const spyDefault = spyOn(Shift, 'preventDefault');

        service.handleKeyDown(Shift);
        expect(spyDefault).toHaveBeenCalled();
    });

    it('handleKeyDown should not prevents defaults if shift is not pressed', () => {
        const alt = new KeyboardEvent('keydown', { key: 'Alt' });
        const spyDefault = spyOn(alt, 'preventDefault');

        service.handleKeyDown(alt);
        expect(spyDefault).not.toHaveBeenCalled();
    });

    it('handleKeyDown should set shiftKey to true if shift is pressed', () => {
        const shift = new KeyboardEvent('keydown', { key: 'Shift' });
 
        service.handleKeyDown(shift);
        expect(service.shiftKey).toEqual(true);
    });

    it('handleKeyDown should set shiftKey to false if shift is not pressed', () => {
        const alt = new KeyboardEvent('keydown', { key: 'Alt' });
 
        service.handleKeyDown(alt);
        expect(service.shiftKey).toEqual(false);
    });

    it('handleKeyUp should prevent Default if shift is not pressed', () => {
        const Shift = new KeyboardEvent('keyup', { key: 'Shift' });
        const spyDefault = spyOn(Shift, 'preventDefault');

        service.handleKeyUp(Shift);
        expect(spyDefault).toHaveBeenCalled();
    });

    it('handleKeyUp should not prevents defaults if shift is not pressed', () => {
        const alt = new KeyboardEvent('keyup', { key: 'Alt' });
        const spyDefault = spyOn(alt, 'preventDefault');

        service.handleKeyUp(alt);
        expect(spyDefault).not.toHaveBeenCalled();
    });

    it('handleKeyUp should set shiftKey to false if shift is pressed', () => {
        const shift = new KeyboardEvent('keyup', { key: 'Shift' });
 
        service.handleKeyUp(shift);
        expect(service.shiftKey).toEqual(false);
    });

    it('handleKeyUp should set shiftKey to false if shift is not pressed', () => {
        const alt = new KeyboardEvent('keyup', { key: 'Alt' });
 
        service.handleKeyUp(alt);
        expect(service.shiftKey).toEqual(false);
    });
    
    /*
    fit('print resize should print on the canvas', () => {
        const expectedNewOrigin = {x:0, y:0};

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const saveSpy = spyOn(baseCtxStub, 'save').and.stub();
        const restoreSpy = spyOn(baseCtxStub, 'restore').and.stub();

        service.printResize(baseCtxStub);

        expect(service.newOrigin).toEqual(expectedNewOrigin);
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
        
    });
    */
    

    /*
    it('controlPointInResize call the resize function if valid ', () => {
        service['currentControlPoint'] =  ControlPoints.TopLeft
        
    });
    */

    it('checkForMirroirEffect should scale with oposite sign if inverted', () => {
        const expectedResize = -10;
        service.resizeHeight = expectedResize;
        service.resizeWidth = expectedResize;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection =  document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(OPPOSITE_SIGN, OPPOSITE_SIGN);
        expect(drawSpy).toHaveBeenCalled();
    });
   
    it('checkForMirroirEffect should scale with oposite sign in x but 1 in y if inverted in x axe', () => {
        const expectedResizeX = -10;
        const expectedResizeY = 10;
        const expectedY = 1;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection =  document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(OPPOSITE_SIGN, expectedY);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with oposite sign in y but 1 in x if inverted in y axe', () => {
        const expectedResizeX = 10;
        const expectedResizeY = -10;
        const expectedX = 1;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection =  document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(expectedX, OPPOSITE_SIGN);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with normal sizes if resize in x and y positive', () => {
        const expectedResizeX = 10;
        const expectedResizeY = 10;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection =  document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).not.toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    /*
    it('resizeTopLeft should do ajustments for shift', () => {
        expect(service).toBeTruthy();
    });
    */

    
    it('resizeTopLeft should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 5, y: 5};
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeTopLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);

    });
    

    /*
    it('resizeTopRight should do ajustments for shift', () => {
        expect(service).toBeTruthy();
    });
    */

    
    it('resizeTopRight should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 0, y: 5};
        const expectedNewWidth = 0;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeTopRight']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);

    });


    
    it('resizeBottomRight should do ajustments for shift', () => {
        const mouseCOord = {x: 8, y: 8};
        const expectedNewWidth = 8;
        const expectedNewHeight = 8;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = mouseCOord;
        service.shiftKey = true;

        service['resizeBottomRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeBottomRight should do change the origin and the rezise', () => {
        const mouseCOord = {x: 5, y: 5};
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = mouseCOord;
        service.shiftKey = false;

        service['resizeBottomRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);

    });

    /*
    it('resizeBottomLeft should do ajustments for shift', () => {
        const mouseCOord = {x: 0, y: 0};
        const expectedNewWidth = 0;
        const expectedNewHeight = 0;

        service['selectionObject'] = selection;
        service['mouseCoord'] = mouseCOord;
        service.shiftKey = true;

        service['resizeBottomLeft']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    */

    it('resizeBottomLeft should do change the origin and the rezise', () => {
        const expectedMouseCoords = {x: 5, y: 0};
        const expectedNewWidth = 5;
        const expectedNewHeight = 0;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedMouseCoords;
        service.shiftKey = false;

        service['resizeBottomLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedMouseCoords);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);

    });

    it('resizeMiddleTop should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 0, y: 5};
        const expectedNewWidth = 10;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleTop']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);

    });

    it('resizeMiddleRight should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 10, y: 10};
        const expectedNewWidth = 10;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });
    
    it('resizeMiddleBottom should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 10, y: 10};
        const expectedNewWidth = 10;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleBottom']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeMiddleLeft should do change the origin and the rezise', () => {
        const expectedNewOrigin = {x: 10, y: 0};
        const expectedNewWidth = 0;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = {x:0, y:0};
        service['selectionObject'].destination = {x: 10, y:10};
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;
       
        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('getSelectionRatio should return the ratio between the width and the height', () => {
        const expectedValue = 1;

        const value = service['getSelectionRatio']();
        expect(value).toEqual(expectedValue);
    });
    
});
