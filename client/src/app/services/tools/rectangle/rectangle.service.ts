import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { TypeStyle } from 'src/app/interfaces-enums/type-style';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

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
    lineWidth: number;
    fillValue: boolean;
    strokeValue: boolean;
    selectType: TypeStyle;

    constructor(drawingService: DrawingService,private colorManager: ColorManagerService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.strokeValue = false;
        this.fillValue = false;
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
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
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
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }
    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const firstPoint = path[0];
        const finalPoint = path[this.pathData.length - 1];
        const width = finalPoint.y - firstPoint.y;
        const length = finalPoint.x - firstPoint.x;
        ctx.lineWidth = this.lineWidth;
        ctx.rect(firstPoint.x, firstPoint.y, length, width);

        if (this.fillValue) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
}
