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
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //  this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];
        let width: number;
        let height: number;
        width = path[path.length - 1].x - upperRight[0];
        height = path[path.length - 1].y - upperRight[1];

        ctx.beginPath();
        ctx.strokeRect(upperRight[0], upperRight[1], width, height);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        //ctx.ellipse(path[0].x, path[0].y, 100, 600, 0, 2 * Math.PI, 0);
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
