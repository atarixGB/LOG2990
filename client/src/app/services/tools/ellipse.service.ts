import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
export class EllipseService extends Tool {
    private pathData: Vec2[];
    private isEllipse = true;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
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
        if (this.isEllipse) this.drawEllipse(this.drawingService.baseCtx, this.pathData);
        else this.drawCircle(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.isEllipse) {
                this.drawEllipse(this.drawingService.previewCtx, this.pathData);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawCircle(this.drawingService.previewCtx, this.pathData);
                this.drawSquare(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let xRadius = (path[path.length - 1].x - path[0].x) / 2;
        let yRadius = (path[path.length - 1].y - path[0].y) / 2;
        let origin: [number, number];
        if (xRadius < 0 && yRadius < 0) {
            //Go right-up
            yRadius = Math.abs(yRadius);
            xRadius = Math.abs(xRadius);
            origin = [path[0].x - xRadius, path[0].y - yRadius];
        } else if (xRadius < 0) {
            //Go right-down
            xRadius = Math.abs(xRadius);
            origin = [path[0].x - xRadius, path[0].y + yRadius];
        } else if (yRadius < 0) {
            //Go left-up
            yRadius = Math.abs(yRadius);
            origin = [path[0].x + xRadius, path[0].y - yRadius];
        } else {
            //Go left-down
            origin = [path[0].x + xRadius, path[0].y + yRadius];
        }
        ctx.beginPath();
        ctx.ellipse(origin[0], origin[1], xRadius, yRadius, 0, 2 * Math.PI, 0);
        ctx.stroke();
        //test idea : radius is negative ? Look at the documentation
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];
        let width = path[path.length - 1].x - upperRight[0];
        let height = path[path.length - 1].y - upperRight[1];

        ctx.beginPath();
        ctx.strokeRect(upperRight[0], upperRight[1], width, height);
    }

    private drawSquare(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let width: number;
        let origin: [number, number];

        if (path[path.length - 1].x > path[path.length - 1].y) {
            width = path[path.length - 1].x - path[0].x;
        } else {
            width = path[path.length - 1].y - path[0].y;
        }
        if (width < 0) width = Math.abs(width);

        if (path[path.length - 1].x - path[0].x < 0 && path[path.length - 1].y - path[0].y >= 0) {
            //go down-left
            origin = [path[0].x - width, path[0].y];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x >= 0) {
            //go up-right
            origin = [path[0].x, path[0].y - width];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x < 0) {
            // up-left
            origin = [path[0].x - width, path[0].y - width];
        } else {
            //go down-right
            origin = [path[0].x, path[0].y];
        }
        ctx.beginPath();
        ctx.strokeRect(origin[0], origin[1], width, width);
    }

    drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        //similar to how Paint works
        let radius: number;
        let origin: [number, number];
        if (path[path.length - 1].x > path[path.length - 1].y) {
            radius = (path[path.length - 1].x - path[0].x) / 2;
        } else {
            radius = (path[path.length - 1].y - path[0].y) / 2;
        }

        if (radius < 0) radius = Math.abs(radius);

        if (path[path.length - 1].x - path[0].x < 0 && path[path.length - 1].y - path[0].y >= 0) {
            //go down-left
            origin = [path[0].x - radius, path[0].y + radius];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x >= 0) {
            //go up-right
            origin = [path[0].x + radius, path[0].y - radius];
        } else if (path[path.length - 1].y - path[0].y < 0 && path[path.length - 1].x - path[0].x < 0) {
            // up-left
            origin = [path[0].x - radius, path[0].y - radius];
        } else {
            //go down-right
            origin = [path[0].x + radius, path[0].y + radius];
        }
        ctx.beginPath();
        ctx.ellipse(origin[0], origin[1], radius, radius, 0, 2 * Math.PI, 0);
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key == 'Shift') {
            this.isEllipse = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawCircle(this.drawingService.previewCtx, this.pathData);
            this.drawSquare(this.drawingService.previewCtx, this.pathData);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key == 'Shift') {
            this.isEllipse = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }
}
