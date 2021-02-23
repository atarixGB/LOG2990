import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ShapeService } from 'src/app/services/tools/shape/shape.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeService {
    private origin: Vec2;
    private radius: number;
    constructor(protected drawingService: DrawingService, colorManager: ColorManagerService) {
        super(drawingService, colorManager);
    }

    drawShape(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.computeSize();
        this.findMouseDirection();
        this.radius = Math.abs(this.size.x) < Math.abs(this.size.y) ? Math.abs(this.size.x) / 2 : Math.abs(this.size.y) / 2;

        if (!this.isShiftShape) {
            this.drawRectangle(ctx, this.pathData, true);
            this.drawEllipse(ctx, this.pathData);
        } else {
            this.drawSquare(ctx, this.pathData, true);
            this.drawCircle(ctx, this.pathData);
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
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(this.origin.x, this.origin.y, this.size.x / 2, this.size.y / 2, 0, 2 * Math.PI, 0);
        this.updateBorderType(ctx);
    }

    private drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(this.origin.x, this.origin.y, this.radius, this.radius, 0, 2 * Math.PI, 0);
        this.updateBorderType(ctx);
    }

    lowerLeft(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x - this.radius, y: this.pathData[0].y + this.radius };
        } else {
            this.origin = { x: this.pathData[0].x - this.size.x / 2, y: this.pathData[0].y + this.size.y / 2 };
        }
    }

    upperRight(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x + this.radius, y: this.pathData[0].y - this.radius };
        } else {
            this.origin = { x: this.pathData[0].x + this.size.x / 2, y: this.pathData[0].y - this.size.y / 2 };
        }
    }

    upperLeft(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x - this.radius, y: this.pathData[0].y - this.radius };
        } else {
            this.origin = { x: this.pathData[0].x - this.size.x / 2, y: this.pathData[0].y - this.size.y / 2 };
        }
    }

    lowerRight(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x + this.radius, y: this.pathData[0].y + this.radius };
        } else {
            this.origin = { x: this.pathData[0].x + this.size.x / 2, y: this.pathData[0].y + this.size.y / 2 };
        }
    }
}
