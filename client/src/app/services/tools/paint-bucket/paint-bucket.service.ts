// Code Inspired by:
// W. Malone. (2012) Create a paint bucket tool in HTML5 and javascript. [Online]
// Available : http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/constants';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Vec2 } from './../../../classes/vec2';
import { ColorOrder } from './../../../interfaces-enums/color-order';

const NUMBER_OF_RGB_COLORS = 3;
const MAX_BYTE_VALUE = 255;
const MAX_PERCENT = 100;
const MAX_TOLERANCE_VALUE = 100;
const MIN_TOLERANCE_VALUE = 0;
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    private startPixelColor: Uint8ClampedArray;
    private startPixelTolerance: number[];
    maxTolerance: number = MAX_TOLERANCE_VALUE;
    minTolerance: number = MIN_TOLERANCE_VALUE;
    tolerance: number = this.minTolerance;

    constructor(protected drawingService: DrawingService, private colorManager: ColorManagerService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
      this.drawingService.baseCtx.filter = 'none';
      this.drawingService.previewCtx.filter = 'none';
      this.mouseDownCoord = this.getPositionFromMouse(event);
      this.startPixelColor = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1).data;;
      if (event.button === MouseButton.Left) {
          this.drawingService.baseCtx.fillStyle = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
          this.contiguousFill();//method to enable bucket fill with contiguous pixels on left click
      } else if (event.button === MouseButton.Right) {
          this.fill(); //method to enable bucket to fill without contiguous pixels on right click
      }
  }
    setToleranceValue(newTolerance: number): void {
        this.tolerance = newTolerance;
    }

    private getPixelColor(coordinates: Vec2): Uint8ClampedArray {
        return this.drawingService.baseCtx.getImageData(coordinates.x, coordinates.y, 1, 1).data;
    }

    private changePixelColor(coordinates: Vec2): void {
        const pixelColor = this.drawingService.baseCtx.getImageData(coordinates.x, coordinates.y, 1, 1);
        pixelColor.data[0] = this.colorManager.selectedColor[ColorOrder.PrimaryColor].Dec.Red;
        pixelColor.data[1] = this.colorManager.selectedColor[ColorOrder.PrimaryColor].Dec.Green;
        pixelColor.data[2] = this.colorManager.selectedColor[ColorOrder.PrimaryColor].Dec.Blue;
        pixelColor.data[NUMBER_OF_RGB_COLORS] = this.colorManager.selectedColor[ColorOrder.PrimaryColor].Dec.Alpha;
        this.drawingService.baseCtx.putImageData(pixelColor, coordinates.x, coordinates.y);
    }

    private matchesStartColor(coordinates: Vec2): boolean {
        const pixelColor = this.getPixelColor(coordinates);
        const rgbEquals = new Array<boolean>();
        for (let i = 0; i < NUMBER_OF_RGB_COLORS; i++) {
            rgbEquals[i] = pixelColor[i] >= this.startPixelTolerance[i * 2] && pixelColor[i] <= this.startPixelTolerance[i * 2 + 1];
        }
        return rgbEquals[0] && rgbEquals[1] && rgbEquals[2];
    }

    private getStartColor(coordinates: Vec2): void {
        this.startPixelColor = this.getPixelColor(coordinates);
        const toleranceFactor = MAX_BYTE_VALUE * (this.tolerance / MAX_PERCENT);
        let colorFactor: number;
        for (let i = 0; i < NUMBER_OF_RGB_COLORS; i++) {
            colorFactor = this.startPixelColor[i] / MAX_BYTE_VALUE;
            this.startPixelTolerance[i * 2] = this.startPixelColor[i] - toleranceFactor * colorFactor;
            this.startPixelTolerance[i * 2 + 1] = this.startPixelColor[i] + toleranceFactor * (1 - colorFactor);
        }
    }
}
