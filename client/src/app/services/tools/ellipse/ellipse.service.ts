import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { Shape } from '../shape/shape';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Shape {
    constructor(protected drawingService: DrawingService, colorManager: ColorManagerService) {
        super(drawingService, colorManager);
    }

    drawShape(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        console.log('dans ellipse');
        if (!this.isShiftShape) {
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
        } else {
            this.drawCircle(this.drawingService.previewCtx, this.pathData);
            this.drawSquare(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (!this.isShiftShape) this.drawEllipse(this.drawingService.baseCtx, this.pathData);
        else {
            this.drawCircle(this.drawingService.baseCtx, this.pathData);
            this.isShiftShape = false;
        }
        this.clearPath();
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let xRadius = (path[path.length - 1].x - path[0].x) / 2;
        let yRadius = (path[path.length - 1].y - path[0].y) / 2;
        let origin: [number, number];
        if (xRadius < 0 && yRadius < 0) {
            // Go right-up
            yRadius = Math.abs(yRadius);
            xRadius = Math.abs(xRadius);
            origin = [path[0].x - xRadius, path[0].y - yRadius];
        } else if (xRadius < 0) {
            // Go right-down
            xRadius = Math.abs(xRadius);
            origin = [path[0].x - xRadius, path[0].y + yRadius];
        } else if (yRadius < 0) {
            // Go left-up
            yRadius = Math.abs(yRadius);
            origin = [path[0].x + xRadius, path[0].y - yRadius];
        } else {
            // Go left-down
            origin = [path[0].x + xRadius, path[0].y + yRadius];
        }
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(origin[0], origin[1], xRadius, yRadius, 0, 2 * Math.PI, 0);
        this.updateBorder(ctx);
    }

    drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let origin: [number, number];
        origin = [0, 0];

        const width = path[path.length - 1].x - path[0].x;
        const height = path[path.length - 1].y - path[0].y;
        const radius = Math.abs(width) < Math.abs(height) ? Math.abs(width) / 2 : Math.abs(height) / 2;

        if (width <= 0 && height >= 0) {
            // go down-left
            origin = [path[0].x - radius, path[0].y + radius];
        } else if (height <= 0 && width >= 0) {
            // go up-right
            origin = [path[0].x + radius, path[0].y - radius];
        } else if (height <= 0 && width <= 0) {
            // up-left
            origin = [path[0].x - radius, path[0].y - radius];
        } else {
            // go down-right
            origin = [path[0].x + radius, path[0].y + radius];
        }
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(origin[0], origin[1], radius, radius, 0, 2 * Math.PI, 0);
        this.updateBorder(ctx);
    }
}
