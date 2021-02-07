import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_ERASER_COLOR, MIN_ERASER_THICKNESS } from '@app/constants';
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
    public eraserThickness: number;
    public eraserColor: string;

    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();

        this.eraserThickness = MIN_ERASER_THICKNESS;
        this.eraserColor = DEFAULT_ERASER_COLOR;
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

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.onMouseUp(event);
            this.mouseLeave = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseLeave) {
            this.onMouseDown(event);
            this.mouseLeave = false;
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
        for (const point of path) {
            ctx.clearRect(point.x, point.y, this.eraserThickness, this.eraserThickness);
        }
    }

    private drawPoint(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        for (const point of path) {
            ctx.clearRect(point.x, point.y, this.eraserThickness, this.eraserThickness);
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
