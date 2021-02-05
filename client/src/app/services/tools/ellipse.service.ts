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
        //codeMort?
        /* if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //this.drawEllipse(this.drawingService.baseCtx, this.pathData);
            console.log('inside');
        } */
        console.log('outside');
        this.drawEllipse(this.drawingService.baseCtx, this.pathData);
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
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];
        let width = path[path.length - 1].x - upperRight[0];
        let height = path[path.length - 1].y - upperRight[1];

        ctx.beginPath();
        ctx.strokeRect(upperRight[0], upperRight[1], width, height);
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
            console.log('2e');
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

    private clearPath(): void {
        this.pathData = [];
    }

    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case '2':
                console.log('hola');
                break;
            case 'ArrowUp':
                // Faire quelque chose pour la touche "up arrow" pressée.
                break;
            default:
                return; // Quitter lorsque cela ne gère pas l'événement touche.
        }
    }
}
