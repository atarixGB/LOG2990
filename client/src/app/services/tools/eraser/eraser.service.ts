import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MIN_ERASER_THICKNESS } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    eraserThickness: number;

    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();

        this.eraserThickness = MIN_ERASER_THICKNESS;
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
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.mouseMove) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawPoint(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseMove = false;
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let previousPointX = path[0].x;
        let previousPointY = path[0].y;
        let interpolation = 0;
        let interpolationY = 0;

        for (const point of path) {
            ctx.clearRect(point.x, point.y, this.eraserThickness, this.eraserThickness);

            interpolation = (point.y - previousPointY) / (point.x - previousPointX);

            if (previousPointX < point.x) {
                for (let x = previousPointX; x < point.x; x++) {
                    interpolationY = interpolation * x + (point.x * previousPointY - previousPointX * point.y) / (point.x - previousPointX);
                    ctx.clearRect(x, interpolationY, this.eraserThickness, this.eraserThickness);
                }
            } else if (previousPointX > point.x) {
                for (let x = point.x; x < previousPointX; x++) {
                    interpolationY = interpolation * x + (point.x * previousPointY - previousPointX * point.y) / (point.x - previousPointX);
                    ctx.clearRect(x, interpolationY, this.eraserThickness, this.eraserThickness);
                }
            } else if (previousPointY < point.y) {
                for (let y = previousPointY; y < point.y; y++) {
                    ctx.clearRect(point.x, y, this.eraserThickness, this.eraserThickness);
                }
            } else if (previousPointY > point.y) {
                for (let y = previousPointY; y > point.y; y--) {
                    ctx.clearRect(point.x, y, this.eraserThickness, this.eraserThickness);
                }
            }
            previousPointX = point.x;
            previousPointY = point.y;
        }
    }

    private drawPoint(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.clearRect(path[0].x, path[0].y, this.eraserThickness, this.eraserThickness);
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
