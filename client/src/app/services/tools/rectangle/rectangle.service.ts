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

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.isRectangle) this.drawRectangle(this.drawingService.baseCtx, this.pathData);
        else this.drawSquare(this.drawingService.baseCtx, this.pathData);
        this.isRectangle = true;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            if (this.isRectangle) {
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSquare(this.drawingService.previewCtx, this.pathData);
            }
        }
    }
    handleKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey) {
            this.isRectangle = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSquare(this.drawingService.previewCtx, this.pathData);
        } else this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (!this.isRectangle) {
            this.isRectangle = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSquare(this.drawingService.previewCtx, this.pathData);
            this.isRectangle = true;
        } else this.drawRectangle(this.drawingService.previewCtx, this.pathData);
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
            ctx.rect(firstPoint.x, firstPoint.y, length, width);
            ctx.stroke();
        }
    }
    private drawSquare(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let width: number;
        let origin: [number, number];
        width = 0;
        origin = [0, 0];

        if (path[path.length - 1].x > path[path.length - 1].y) {
            width = path[path.length - 1].x - path[0].x;
        } else {
            width = path[path.length - 1].y - path[0].y;
        }
        if (width < 0) width = Math.abs(width);

        if (path[path.length - 1].x - path[0].x < 0 && path[path.length - 1].y - path[0].y >= 0) {
            // go down-left
            origin = [path[0].x - width, path[0].y];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x >= 0) {
            // go up-right
            origin = [path[0].x, path[0].y - width];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x < 0) {
            // up-left
            origin = [path[0].x - width, path[0].y - width];
        } else {
            // go down-right
            origin = [path[0].x, path[0].y];
        }
        ctx.beginPath();
        ctx.strokeRect(origin[0], origin[1], width, width);
        ctx.stroke();
    }
}
