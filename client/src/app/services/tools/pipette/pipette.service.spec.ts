import { TestBed } from '@angular/core/testing';
import { PipetteService } from './pipette.service';
//tslint:disable
describe('PipetteService', () => {
    let service: PipetteService;
    //let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    //let zoomCtxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    //let zoomSpy: jasmine.SpyObj<HTMLCanvasElement>;
    //let canvasTestHelper: CanvasTestHelper;
    //let zoomCtxStub: CanvasRenderingContext2D;
    //let pixelOnZoomSpy: jasmine.Spy<any>;

    beforeEach(() => {
        // drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'getCanvasWidth', 'getCanvasHeight']);
        // zoomCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['arc', 'clip', 'drawImage', 'strokeRect']);
        //zoomSpy = jasmine.createSpyObj('HTMLCanvasElement', ['height', 'width']);

        TestBed.configureTestingModule({
            providers: [
                //{ provide: DrawingService, useValue: drawServiceSpy },
                //{ provide: CanvasRenderingContext2D, useValue: zoomCtxSpy },
                //{ provide: HTMLCanvasElement, useValue: zoomSpy },
            ],
        });
        service = TestBed.inject(PipetteService);
        //canvasTestHelper = TestBed.inject(CanvasTestHelper);
        //zoomCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        //service.drawingService.canvas = canvasTestHelper.canvas;
        // service.zoomCtx = zoomCtxStub;
        //pixelOnZoomSpy = spyOn<any>(service, 'pixelOnZoom').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    /*
    it('onMouseDown should emit a PrimaryColor with left click', () => {
        const imageData = new ImageData(10, 10);
        const expectedColor = imageData.data;
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventLClick.x, y: mouseEventLClick.y });
        const updatePixelColorSpy = spyOn(service.colorManagerService, 'updatePixelColor');
        const emitSpy = spyOn(service.primaryColor, 'emit');
        pixelOnZoomSpy.and.returnValue(expectedColor);

        service.onMouseDown(mouseEventLClick);

        expect(updatePixelColorSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('onMouseDown should emit a secondaryColor with right click', () => {
        const imageData = new ImageData(10, 10);
        const expectedColor = imageData.data;
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventRClick.x, y: mouseEventRClick.y });
        const updatePixelColorSpy = spyOn(service.colorManagerService, 'updatePixelColor');
        const emitSpy = spyOn(service.secondaryColor, 'emit');
        pixelOnZoomSpy.and.returnValue(expectedColor);

        service.onMouseDown(mouseEventRClick);

        expect(updatePixelColorSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('DrawOnZoom should draw the imageData on the zoomCtx', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventRClick.x, y: mouseEventRClick.y });

        service.drawOnZoom(mouseEventLClick);
        expect(zoomCtxSpy.getImageData).toHaveBeenCalled();
        expect(zoomCtxSpy.clip).toHaveBeenCalled();
        expect(zoomCtxSpy.drawImage).toHaveBeenCalled();
        expect(zoomCtxSpy.strokeRect).toHaveBeenCalled();
    });

    it('mouse x > width should set isnearBorder to true', () => {
        service.drawingService.canvas.width = 50;
        service.drawingService.canvas.height = 50;
        const clearCanvasSpy = spyOn(service, 'clearCanvas');
        service.nearBorder({ x: 60, y: 25 });
        expect(service.isNearBorder).toEqual(true);
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('mouse y > height should set isnearBorder to true', () => {
        service.drawingService.canvas.width = 50;
        service.drawingService.canvas.height = 50;
        const clearCanvasSpy = spyOn(service, 'clearCanvas');
        service.nearBorder({ x: 25, y: 60 });
        expect(service.isNearBorder).toEqual(true);
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('mouse on the canvas should set isnearborder to false', () => {
        service.drawingService.canvas.width = 50;
        service.drawingService.canvas.height = 50;
        const clearCanvasSpy = spyOn(service, 'clearCanvas');
        service.nearBorder({ x: 25, y: 25 });
        expect(service.isNearBorder).toEqual(false);
        expect(clearCanvasSpy).not.toHaveBeenCalled();
    });

    it('clearCanvas should clear the zoomCtx', () => {
        service.clearCanvas();
        expect(zoomCtxSpy.clearRect).toHaveBeenCalled();
        expect(zoomCtxSpy).toHaveBeenCalledWith(0, 0, 10, 10);
    });

    it('showZoom should draw only if not nearBorder', () => {
        service.isNearBorder = false;
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: mouseEventRClick.x, y: mouseEventRClick.y });
        service.drawOnZoom(mouseEventLClick);
        const clearCanvasSpy = spyOn(service, 'clearCanvas').and.stub();
        const drawOnZoomSpy = spyOn(service, 'drawOnZoom').and.stub();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(drawOnZoomSpy).toHaveBeenCalled();
    });
    */
});
