// Code Inspired by:
// W. Malone. (2012) Create a paint bucket tool in HTML5 and javascript. [Online]
// Available : http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MAX_BYTE_VALUE, MAX_PERCENT, MAX_TOLERANCE_VALUE, MIN_TOLERANCE_VALUE, MouseButton, RGBA_COMPONENTS } from '@app/constants';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PaintBucket } from './../../../classes/paint';
import { Vec2 } from './../../../classes/vec2';
import { ColorOrder } from './../../../interfaces-enums/color-order';
import { RGBA, RGBA_INDEX } from './../../../interfaces-enums/rgba';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    startPixelColor: Uint8ClampedArray;
    maxTolerance: number = MAX_TOLERANCE_VALUE;
    minTolerance: number = MIN_TOLERANCE_VALUE;
    tolerance: number = MIN_TOLERANCE_VALUE;
    mouseDownCoord: Vec2;
    canvasData: ImageData;
    paintBucket: PaintBucket;
    isContiguous: boolean;

    constructor(protected drawingService: DrawingService, private colorManager: ColorManagerService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        this.startPixelColor = this.drawingService.getPixelData(this.mouseDownCoord);
        if (event.button === MouseButton.Left) {
            console.log('allo');
            console.log(this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString);
            this.drawingService.baseCtx.fillStyle = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;

            this.contiguousFill();

            //method to enable bucket fill with contiguous pixels on left click
        } else if (event.button === MouseButton.Right) {
            this.fill(); //method to enable bucket to fill without contiguous pixels on right click
        }
    }
    setToleranceValue(newTolerance: number): void {
        this.tolerance = newTolerance;
    }

    fill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const canvasData = this.drawingService.getCanvasData();
        const rgbaPrimaryColor: RGBA = this.colorManager.selectedColor[ColorOrder.PrimaryColor];
        for (let i = 0; i < canvasData.data.length; i += RGBA_COMPONENTS) {
            if (this.ToleranceRangeVerification(pixelData, canvasData, i)) {
                canvasData.data[i + RGBA_INDEX.RED] = rgbaPrimaryColor.Dec.Red;
                canvasData.data[i + RGBA_INDEX.GREEN] = rgbaPrimaryColor.Dec.Green;
                canvasData.data[i + RGBA_INDEX.BLUE] = rgbaPrimaryColor.Dec.Blue;
                canvasData.data[i + RGBA_INDEX.ALPHA] = 255;
            }
        }
        this.canvasData = canvasData;
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
        this.isContiguous = false;
        const paintBucket = new PaintBucket(this.isContiguous, this.canvasData);
        this.undoRedoService.addToStack(paintBucket);
    }

    contiguousFill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const stackPos: Vec2[] = [this.mouseCoord];
        const coloredPixels: Map<string, boolean> = new Map();
        const canvasData: ImageData = this.drawingService.getCanvasData();

        const rgbaPrimaryColor: RGBA = this.colorManager.selectedColor[ColorOrder.PrimaryColor];

        while (stackPos.length) {
            const selectedPixel = stackPos.pop() as Vec2;
            const index = (selectedPixel.x + selectedPixel.y * this.drawingService.canvas.width) * RGBA_COMPONENTS;
            if (coloredPixels.has(this.vec2ToString(selectedPixel))) {
                continue;
            } else if (this.ToleranceRangeVerification(pixelData, canvasData, index)) {
                canvasData.data[index + RGBA_INDEX.RED] = rgbaPrimaryColor.Dec.Red;
                canvasData.data[index + RGBA_INDEX.GREEN] = rgbaPrimaryColor.Dec.Green;
                canvasData.data[index + RGBA_INDEX.BLUE] = rgbaPrimaryColor.Dec.Blue;
                canvasData.data[index + RGBA_INDEX.ALPHA] = 255;
                coloredPixels.set(this.vec2ToString(selectedPixel), true);
                if (selectedPixel.y - 1 >= 0) {
                    stackPos.push({ x: selectedPixel.x, y: selectedPixel.y - 1 });
                }
                if (selectedPixel.y + 1 < this.drawingService.canvas.height) {
                    stackPos.push({ x: selectedPixel.x, y: selectedPixel.y + 1 });
                }
                if (selectedPixel.x + 1 < this.drawingService.canvas.width) {
                    stackPos.push({ x: selectedPixel.x + 1, y: selectedPixel.y });
                }
                if (selectedPixel.x - 1 >= 0) {
                    stackPos.push({ x: selectedPixel.x - 1, y: selectedPixel.y });
                }
            }
        }
        this.canvasData = canvasData;
        this.isContiguous = true;
        const paintBucket = new PaintBucket(this.isContiguous, this.canvasData);
        this.undoRedoService.addToStack(paintBucket);
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
        console.log('fin');
    }

    vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }

    ToleranceRangeVerification(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
        const diffRed: number = Math.abs(pixelData[RGBA_INDEX.RED] - canvasData.data[index + RGBA_INDEX.RED]);
        const diffGreen: number = Math.abs(pixelData[RGBA_INDEX.GREEN] - canvasData.data[index + RGBA_INDEX.GREEN]);
        const diffBlue: number = Math.abs(pixelData[RGBA_INDEX.BLUE] - canvasData.data[index + RGBA_INDEX.BLUE]);
        const diffAlpha: number = Math.abs(pixelData[RGBA_INDEX.ALPHA] - canvasData.data[index + RGBA_INDEX.ALPHA]);

        const diffPercentage: number = ((diffRed + diffGreen + diffBlue + diffAlpha) / (RGBA_COMPONENTS * MAX_BYTE_VALUE)) * MAX_PERCENT;

        if (diffPercentage > this.tolerance) {
            return false;
        }
        return true;
    }
}
