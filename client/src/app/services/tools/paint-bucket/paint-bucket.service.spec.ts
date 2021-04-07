import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/constants';
// import { RGBA } from '@app/interfaces-enums/rgba';
// import { DecimalRGBA } from '@app/interfaces-enums/rgba';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from './paint-bucket.service';

import SpyObj = jasmine.SpyObj;

// tslint:disable
describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let colorManagerServiceSpy: SpyObj<ColorManagerService>;
    let baseCtxSpy: SpyObj<CanvasRenderingContext2D>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['getPixelData', 'getCanvasData']);
        baseCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);

        drawingServiceSpy.baseCtx = baseCtxSpy;
        colorManagerServiceSpy = jasmine.createSpyObj('ColorManagerService', ['getColorStringAlpha', 'updatePixelColor']);
        // const COlorTest: RGBA = {
        //     Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 255 },
        //     Hex: { Red: '0', Green: '0', Blue: '0' },
        //     inString: 'black',
        // };

        // colorManagerServiceSpy.updatePixelColor(ColorOrder.PrimaryColor, [0,0,0,255]);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ColorManagerService, useValue: colorManagerServiceSpy },
            ],
        });
        service = TestBed.inject(PaintBucketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change tolerance', () => {
        const newTolerance = 5;
        service.tolerance = 0;
        service.setToleranceValue(newTolerance);
        expect(service.tolerance).toBe(newTolerance);
    });

    it('onMouseDown should call drawing service.getPixelData with mouseEvent position', () => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.height = 10;
        canvas.width = 10;
        const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

        baseCtx.fillStyle = 'white';
        baseCtx.fillRect(0, 0, canvas.width, canvas.height);
        baseCtx.strokeStyle = 'black';
        baseCtx.strokeRect(0, 0, 5, 5);

        previewCtx.fillStyle = 'white';
        previewCtx.fillRect(0, 0, canvas.width, canvas.height);
        previewCtx.strokeStyle = 'black';
        previewCtx.strokeRect(0, 0, 5, 5);

        drawingServiceSpy.baseCtx = baseCtx;
        drawingServiceSpy.previewCtx = previewCtx;
        drawingServiceSpy.canvas = canvas;

        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Middle,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawingServiceSpy.getPixelData).toHaveBeenCalled();
    });

    // it('onMouseDown should set drawingservice.baseCtx.fillStyle and call contiguousFill on left click', () => {
    //     const canvas: HTMLCanvasElement = document.createElement('canvas');
    //     canvas.height = 10;
    //     canvas.width = 10;
    //     const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     const previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    //     baseCtx.fillStyle = 'white';
    //     baseCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     baseCtx.strokeStyle = 'black';
    //     baseCtx.strokeRect(0, 0, 5, 5);

    //     previewCtx.fillStyle = 'white';
    //     previewCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     previewCtx.strokeStyle = 'black';
    //     previewCtx.strokeRect(0, 0, 5, 5);

    //     drawingServiceSpy.baseCtx = baseCtx;
    //     drawingServiceSpy.previewCtx = previewCtx;
    //     drawingServiceSpy.canvas = canvas;

    //     const mouseEvent = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: MouseButton.Left,
    //     } as MouseEvent;
    //     const contiguousFillSpy = spyOn(service, 'contiguousFill');

    //     service.onMouseDown(mouseEvent);
    //     // red in hexa
    //     console.log(drawingServiceSpy.baseCtx.fillStyle);
    //     expect(drawingServiceSpy.baseCtx.fillStyle).toBe('Red');
    //     console.log(drawingServiceSpy.baseCtx.fillStyle); // red in hexa
    //     expect(contiguousFillSpy).toHaveBeenCalled();
    // });

    // it('onMouseDown should call fill on right click', () => {
    //     const canvas: HTMLCanvasElement = document.createElement('canvas');
    //     canvas.height = 10;
    //     canvas.width = 10;
    //     const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     const previewCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    //     baseCtx.fillStyle = 'white';
    //     baseCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     baseCtx.strokeStyle = 'black';
    //     baseCtx.strokeRect(0, 0, 5, 5);

    //     previewCtx.fillStyle = 'white';
    //     previewCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     previewCtx.strokeStyle = 'black';
    //     previewCtx.strokeRect(0, 0, 5, 5);

    //     drawingServiceSpy.baseCtx = baseCtx;
    //     drawingServiceSpy.previewCtx = previewCtx;
    //     drawingServiceSpy.canvas = canvas;

    //     const mouseEvent = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: MouseButton.Right,
    //     } as MouseEvent;
    //     const fillSpy = spyOn(service, 'fill');

    //     service.onMouseDown(mouseEvent);
    //     expect(fillSpy).toHaveBeenCalled();
    // });

    // it('contiguousFill should only fill rectangle on canvas', () => {
    //     const canvasCompare: HTMLCanvasElement = document.createElement('canvas');
    //     canvasCompare.height = 10;
    //     canvasCompare.width = 10;
    //     const baseCtxCompare = canvasCompare.getContext('2d') as CanvasRenderingContext2D;
    //     baseCtxCompare.fillStyle = 'white';
    //     baseCtxCompare.fillRect(0, 0, canvasCompare.width, canvasCompare.height);
    //     baseCtxCompare.strokeStyle = 'black';
    //     baseCtxCompare.strokeRect(0, 0, 5, 5);
    //     baseCtxCompare.fillStyle = 'blue';
    //     baseCtxCompare.fillRect(1, 1, 3, 3);

    //     const canvas: HTMLCanvasElement = document.createElement('canvas');
    //     canvas.height = 10;
    //     canvas.width = 10;
    //     const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     baseCtx.fillStyle = 'white';
    //     baseCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     baseCtx.strokeStyle = 'black';
    //     baseCtx.strokeRect(0, 0, 5, 5);

    //     // set the position of mouseDown event
    //     service.mouseDownCoord = { x: 2, y: 2 };

    //     // set up drawingServiceSpy with mock retrun values for test
    //     drawingServiceSpy.baseCtx = baseCtx;
    //     drawingServiceSpy.canvas = canvas;
    //     drawingServiceSpy.getPixelData.and.returnValue(baseCtx.getImageData(service.mouseDownCoord.x, service.mouseDownCoord.y, 1, 1).data);
    //     drawingServiceSpy.getCanvasData.and.returnValue(baseCtx.getImageData(0, 0, canvas.width, canvas.height));

    //     //         // set rgba primary color to blue

    //     // const COlorTest: RGBA = {
    //     //     Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 255 },
    //     //     Hex: { Red: '0', Green: '0', Blue: '0' },
    //     //     inString: 'rgba(0, 0, 0, 255)',
    //     // };

    //     // colorManagerServiceSpy.updateWithHex(ColorOrder.PrimaryColor, COlorTest);
    //     colorManagerServiceSpy.and.callThrough();

    //     // start the test
    //     service.contiguousFill();

    //     const currentImageData: ImageData = baseCtx.getImageData(0, 0, canvas.width, canvas.height);
    //     const expectedImageData: ImageData = baseCtxCompare.getImageData(0, 0, canvasCompare.width, canvasCompare.height);

    //     expect(currentImageData).toEqual(expectedImageData);
    // });

    // it('contiguousFill should only fill inside canvas', () => {
    //     // create a dummy canvas with a filled rectangle
    //     const canvasCompare: HTMLCanvasElement = document.createElement('canvas');
    //     canvasCompare.height = 10;
    //     canvasCompare.width = 10;
    //     const baseCtxCompare = canvasCompare.getContext('2d') as CanvasRenderingContext2D;
    //     //baseCtxCompare.fillStyle = 'blue';
    //     baseCtxCompare.fillRect(0, 0, canvasCompare.width, canvasCompare.height);

    //     // create a canvas with a rectangle that is not yet filled
    //     const canvas: HTMLCanvasElement = document.createElement('canvas');
    //     canvas.height = 10;
    //     canvas.width = 10;
    //     const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     //baseCtx.fillStyle = 'white';
    //     baseCtx.fillRect(-10, -10, 20, 20);

    //     // set the position of mouseDown event
    //     service.mouseDownCoord = { x: 0, y: 0 };

    //     // set up drawingServiceSpy with mock retrun values for test
    //     drawingServiceSpy.baseCtx = baseCtx;
    //     drawingServiceSpy.canvas = canvas;
    //     drawingServiceSpy.getPixelData.and.returnValue(baseCtx.getImageData(service.mouseDownCoord.x, service.mouseDownCoord.y, 1, 1).data);
    //     drawingServiceSpy.getCanvasData.and.returnValue(baseCtx.getImageData(0, 0, canvas.width, canvas.height));

    //     const COlorTest: RGBA = {
    //         Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 255 },
    //         Hex: { Red: '0', Green: '0', Blue: '0' },
    //         inString: 'rgba(0, 0, 0, 255)',
    //     };

    //     colorManagerServiceSpy.getColor.and.returnValue(COlorTest);

    //     service.contiguousFill();

    //     const currentImageData: ImageData = baseCtx.getImageData(0, 0, canvas.width, canvas.height);
    //     const expectedImageData: ImageData = baseCtxCompare.getImageData(0, 0, canvasCompare.width, canvasCompare.height);

    //     expect(currentImageData).toEqual(expectedImageData);
    // });

    // it('fill should fill both rectangles on canvas', () => {
    //     // create a dummy canvas with two filled black rectangles that do not touch
    //     const canvasCompare: HTMLCanvasElement = document.createElement('canvas');
    //     canvasCompare.height = 10;
    //     canvasCompare.width = 10;
    //     const baseCtxCompare = canvasCompare.getContext('2d') as CanvasRenderingContext2D;
    //     baseCtxCompare.fillStyle = 'white';
    //     baseCtxCompare.fillRect(0, 0, canvasCompare.width, canvasCompare.height);
    //     baseCtxCompare.fillStyle = 'black';
    //     baseCtxCompare.fillRect(0, 0, 3, 3);
    //     baseCtxCompare.fillRect(5, 5, 3, 3);

    //     // create a canvas with two filled blue rectangles that do not touch
    //     const canvas: HTMLCanvasElement = document.createElement('canvas');
    //     canvas.height = 10;
    //     canvas.width = 10;
    //     const baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     baseCtx.fillStyle = 'white';
    //     baseCtx.fillRect(0, 0, canvas.width, canvas.height);
    //     baseCtx.fillStyle = 'blue';
    //     baseCtx.fillRect(0, 0, 3, 3);
    //     baseCtx.fillRect(5, 5, 3, 3);

    //     // set the position of mouseDown event
    //     service.mouseDownCoord = { x: 1, y: 1 };

    //     // set up drawingServiceSpy with mock retrun values for test
    //     drawingServiceSpy.baseCtx = baseCtx;
    //     drawingServiceSpy.canvas = canvas;
    //     drawingServiceSpy.getPixelData.and.returnValue(baseCtx.getImageData(service.mouseDownCoord.x, service.mouseDownCoord.y, 1, 1).data);
    //     drawingServiceSpy.getCanvasData.and.returnValue(baseCtx.getImageData(0, 0, canvas.width, canvas.height));

    //     const COlorTest: RGBA = {
    //         Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 255 },
    //         Hex: { Red: '0', Green: '0', Blue: '0' },
    //         inString: 'rgba(0, 0, 0, 255)',
    //     };

    //     // colorManagerServiceSpy.updateWithHex(ColorOrder.PrimaryColor, COlorTest);
    //     colorManagerServiceSpy.getColor.and.returnValue(COlorTest);

    //     // start the test
    //     service.fill();

    //     const currentImageData: ImageData = baseCtx.getImageData(0, 0, canvas.width, canvas.height);
    //     const expectedImageData: ImageData = baseCtxCompare.getImageData(0, 0, canvasCompare.width, canvasCompare.height);

    //     expect(currentImageData).toEqual(expectedImageData);
    // });

    it('isInToleranceRange should return true if pixelData is the same as ImageData with tolerance 0', () => {
        const pixelData: Uint8ClampedArray = new Uint8ClampedArray([255, 255, 255, 255]);
        const canvasData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), height: 1, width: 2 };
        const index = 0;

        service.tolerance = 0;
        service.setToleranceValue(0);

        expect(service.ToleranceRangeVerification(pixelData, canvasData, index)).toBe(true);
    });

    it('isInToleranceRange should return false if pixelData is not the same as ImageData with tolerance 0', () => {
        const pixelData: Uint8ClampedArray = new Uint8ClampedArray([255, 255, 255, 255]);
        const canvasData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), height: 1, width: 2 };
        const index = 4;

        service.tolerance = 0;
        service.setToleranceValue(0);
        expect(service.ToleranceRangeVerification(pixelData, canvasData, index)).toBe(false);
    });

    it('isInToleranceRange should return false if pixelData is not the same as ImageData with tolerance 10 ', () => {
        const pixelData: Uint8ClampedArray = new Uint8ClampedArray([255, 255, 255, 255]);
        const canvasData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), height: 1, width: 2 };
        const index = 4;

        service.tolerance = 10;
        service.setToleranceValue(10);
        expect(service.ToleranceRangeVerification(pixelData, canvasData, index)).toBe(false);
    });

    it('isInToleranceRange should return true if pixelData is not the same as ImageData with tolerance 10 but data is similar', () => {
        const pixelData: Uint8ClampedArray = new Uint8ClampedArray([255, 255, 255, 255]);
        const canvasData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 250, 250, 250, 255]), height: 1, width: 2 };
        const index = 4;

        service.tolerance = 10;
        service.setToleranceValue(10);
        expect(service.ToleranceRangeVerification(pixelData, canvasData, index)).toBe(true);
    });

    it('isInToleranceRange should return true if pixelData is not the same as ImageData with tolerance 100', () => {
        const pixelData: Uint8ClampedArray = new Uint8ClampedArray([255, 255, 255, 255]);
        const canvasData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 0]), height: 1, width: 2 };
        const index = 4;

        service.tolerance = 100;
        service.setToleranceValue(100);
        expect(service.ToleranceRangeVerification(pixelData, canvasData, index)).toBe(true);
    });
});
