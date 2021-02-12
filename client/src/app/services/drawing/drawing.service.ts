import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    cursorCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    getCanvasWidth(): number {
        return this.canvas.width;
    }

    getCanvasHeight(): number {
        return this.canvas.height;
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
