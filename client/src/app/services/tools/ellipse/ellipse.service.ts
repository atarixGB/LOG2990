import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { RectangleService } from 'src/app/services/tools/rectangle/rectangle.service';
import { ShapeService } from 'src/app/services/tools/shape/shape.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeService {
    private radius: number;
    constructor(protected drawingService: DrawingService, colorManager: ColorManagerService, private rectangle: RectangleService) {
        super(drawingService, colorManager);
    }

    drawShape(ctx: CanvasRenderingContext2D, isAnotherShapeBorder?: boolean): void {
        this.rectangle.setPath(this.pathData);
        this.computeSize();
        this.findMouseDirection();
        if (!this.isShiftShape) {
            this.rectangle.drawRectangle(ctx, true);
            this.drawEllipse(ctx);
        } else {
            this.rectangle.drawSquare(ctx, true);
            this.drawCircle(ctx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (!this.isShiftShape) this.drawEllipse(this.drawingService.baseCtx);
        else {
            this.drawCircle(this.drawingService.baseCtx);
            this.isShiftShape = false;
        }
        this.clearPath();
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(this.origin.x, this.origin.y, this.size.x / 2, this.size.y / 2, 0, 2 * Math.PI, 0);
        this.updateBorderType(ctx);
    }

    private drawCircle(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        this.radius = Math.abs(this.size.x) < Math.abs(this.size.y) ? Math.abs(this.size.x) / 2 : Math.abs(this.size.y) / 2;
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
