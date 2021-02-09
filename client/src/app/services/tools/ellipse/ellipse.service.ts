import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS } from '@app/constants';
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
    private isEllipse: boolean;
    lineWidth: number;
    isFilled: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.isEllipse = true;
        this.isFilled = false;
        this.lineWidth = DEFAULT_LINE_THICKNESS;
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
        else {
            this.drawCircle(this.drawingService.baseCtx, this.pathData);
            this.isEllipse = true;
        }
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            console.log(mousePosition);
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

        if (this.isFilled) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
        // test idea : radius is negative ? Look at the documentation
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];
        const width = path[path.length - 1].x - upperRight[0];
        const height = path[path.length - 1].y - upperRight[1];

        ctx.beginPath();
        ctx.strokeRect(upperRight[0], upperRight[1], width, height);
    }

    private drawSquare(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const width = path[path.length - 1].x - path[0].x;
        const height = path[path.length - 1].y - path[0].y;
        const shortestSide = Math.abs(width) < Math.abs(height) ? Math.abs(width) : Math.abs(height);

        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];

        if (width <= 0 && height >= 0) {
            // go down-left
            console.log('lower-left');
            upperRight = [path[0].x - shortestSide, path[0].y];
        } else if (height <= 0 && width >= 0) {
            // go up-right
            console.log('upper-right');
            upperRight = [path[0].x, path[0].y - shortestSide];
        } else if (height <= 0 && width <= 0) {
            // up-left
            console.log('upper-left');
            upperRight = [path[0].x - shortestSide, path[0].y - shortestSide];
        } else {
            // go down-right
            console.log('lower-right');
            upperRight = [path[0].x, path[0].y];
        }
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.strokeRect(upperRight[0], upperRight[1], shortestSide, shortestSide);
        console.log('shortestSide : ' + shortestSide);
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

        if (this.isFilled) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift' && this.mouseDown) {
            this.isEllipse = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawCircle(this.drawingService.previewCtx, this.pathData);
            this.drawSquare(this.drawingService.previewCtx, this.pathData);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift' && this.mouseDown) {
            this.isEllipse = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }
}
