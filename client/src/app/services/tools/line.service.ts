import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.pathData.push(this.mouseDownCoord);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y); // Get first point of pathData
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y); // Get last point of pathData
        ctx.stroke(); // Stroke a line between these two points
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
