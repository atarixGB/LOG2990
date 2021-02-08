import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private pathData: Vec2[];
    private isRectangle: boolean;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.isRectangle = true;
        this.clearPath();
    }
    private clearPath(): void {
        this.pathData = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }
    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.isRectangle = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isRectangle = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isRectangle = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }
    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const firstPoint = path[0];
        const finalPoint = path[this.pathData.length - 1];
        const width = finalPoint.y - firstPoint.y;
        const length = finalPoint.x - firstPoint.x;
        ctx.lineWidth = DEFAULT_LINE_THICKNESS;
        if (this.isRectangle) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            ctx.strokeRect(firstPoint.x, firstPoint.y, length, width);
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            ctx.strokeRect(firstPoint.x, firstPoint.y, length, length);
        }
    }
}
