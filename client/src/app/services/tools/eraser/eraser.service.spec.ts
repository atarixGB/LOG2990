import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { mouseEventLClick, mouseEventRClick } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

fdescribe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    //let toolServiceSpy: jasmine.SpyObj<Tool>;

    let baseCtxStub: CanvasRenderingContext2D;
    let cursorCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let drawPointSpy: jasmine.Spy<any>;
    let interpolationSpy: jasmine.Spy<any>;
    //let centerXSpy: jasmine.Spy<any>;
    //let centerYSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'getCanvasWidth', 'getCanvasHeight']);
        //toolServiceSpy = jasmine.createSpyObj('Tool', ['getPositionFromMouse']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        cursorCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawPointSpy = spyOn<any>(service, 'drawPoint').and.callThrough();
        interpolationSpy = spyOn<any>(service, 'interpolationNewPoint').and.callThrough();
        //centerXSpy = spyOn<any>(service, 'centerX').and.stub();
        //centerYSpy = spyOn<any>(service, 'centerY').and.stub();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].cursorCtx = cursorCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 25, y: 25 });
        service.onMouseDown(mouseEventLClick);

        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(service['pathData'].length).toEqual(1);
        expect(service['pathData'][0]).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventLClick.x, y: mouseEventLClick.y });
        service.onMouseDown(mouseEventLClick);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventLClick.x, y: mouseEventLClick.y });
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawPointSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('Mouse click should just draw point', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
        service.onMouseClick(mouseEventLClick);

        expect(drawPointSpy).toHaveBeenCalled();
    });

    it('Mouse click should not be called if mouse is moving', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
        service.mouseMove = true;

        service.onMouseClick(mouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
    });

    it('Draw Line should Interpolate if previousPointX < nextX', () => {
        const previous: Vec2 = { x: 0, y: 0 };
        const next: Vec2 = { x: 5, y: 5 };

        service['pathData'].push(previous);
        service['pathData'].push(next);

        service.drawLine(baseCtxStub, service['pathData']);

        expect(service['pathData'].length).toEqual(2);
        expect(service['pathData'][0]).toEqual(previous);
        expect(service['pathData'][1]).toEqual(next);
        expect(interpolationSpy).toHaveBeenCalledTimes(5);
    });

    it('Draw Line should Interpolate if previousPointX > nextX', () => {
        const previous: Vec2 = { x: 5, y: 5 };
        const next: Vec2 = { x: 0, y: 0 };

        service['pathData'].push(previous);
        service['pathData'].push(next);

        service.drawLine(baseCtxStub, service['pathData']);

        expect(service['pathData'].length).toEqual(2);
        expect(service['pathData'][0]).toEqual(previous);
        expect(service['pathData'][1]).toEqual(next);
        expect(interpolationSpy).toHaveBeenCalledTimes(5);
    });

    it('Draw Line should clear if previousPointX = nextX and previousY < nextY', () => {
        const previous: Vec2 = { x: 0, y: 0 };
        const next: Vec2 = { x: 0, y: 5 };

        service['pathData'].push(previous);
        service['pathData'].push(next);

        service.drawLine(baseCtxStub, service['pathData']);

        expect(service['pathData'].length).toEqual(2);
        expect(service['pathData'][0]).toEqual(previous);
        expect(service['pathData'][1]).toEqual(next);
        expect(interpolationSpy).toHaveBeenCalledTimes(0);
    });

    it('Draw Line should clear if previousPointX = nextX and previousY < nextY', () => {
        const previous: Vec2 = { x: 0, y: 5 };
        const next: Vec2 = { x: 0, y: 0 };

        service['pathData'].push(previous);
        service['pathData'].push(next);

        service.drawLine(baseCtxStub, service['pathData']);

        expect(service['pathData'].length).toEqual(2);
        expect(service['pathData'][0]).toEqual(previous);
        expect(service['pathData'][1]).toEqual(next);
        expect(interpolationSpy).toHaveBeenCalledTimes(0);
    });

    /** 
    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        service.onMouseDown(mouseEventLClick);
        service.onMouseUp(mouseEventRClick);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
    */
});
