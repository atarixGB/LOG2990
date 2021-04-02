import { MAX_TOLERANCE_VALUE, MIN_TOLERANCE_VALUE } from '../constants';
import { Drawable } from './drawable';

export class PaintBucket extends Drawable {
    startPixelColor: Uint8ClampedArray;
    maxTolerance: number = MAX_TOLERANCE_VALUE;
    minTolerance: number = MIN_TOLERANCE_VALUE;
    tolerance: number = this.minTolerance;
    canvasData: ImageData;

    constructor(startPixelColor: Uint8ClampedArray, maxTolerance: number, minTolerance: number, tolerance: number, canvasData: ImageData) {
        super();
        this.startPixelColor = startPixelColor;
        this.maxTolerance = maxTolerance;
        this.minTolerance = minTolerance;
        this.tolerance = tolerance;
        this.canvasData = canvasData;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        //to implement
    }
}
