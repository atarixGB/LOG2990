import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeService } from '@app/services/tools/shape/shape.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeService {
    constructor(protected drawingService: DrawingService, colorManager: ColorManagerService) {
        super(drawingService, colorManager);
    }

    drawShape(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (!this.isShiftShape) this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        else this.drawSquare(this.drawingService.previewCtx, this.pathData);
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (!this.isShiftShape) {
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
            
        } else {
            this.drawSquare(this.drawingService.baseCtx, this.pathData);
            this.isShiftShape = false;
        }

        this.clearPath();
    }
}
