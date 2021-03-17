import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class MoveSelectionService extends Tool {
    private initialPosition: Vec2;

    constructor(drawingService: DrawingService, private selectionService: SelectionService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            console.log('youpi');

            this.initialPosition = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            console.log('coucou');

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.moveSelectionMouse(this.drawingService.previewCtx);
            return;
        }

        // console.log('move');

        // this.mouseDownCoord = this.getPositionFromMouse(event);
        // if (this.mouseInSelectionArea()) {
        //     this.selectionService.newSelection = false;
        // } else {
        //     this.selectionService.newSelection = true;
        // }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.moveSelectionMouse(this.drawingService.baseCtx);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
    }

    mouseInSelectionArea(): boolean {
        const mouseCoord: Vec2 = this.mouseDownCoord;
        const origin: Vec2 = this.selectionService.origin;
        const destination: Vec2 = this.selectionService.destination;
        return mouseCoord.x >= origin.x && mouseCoord.x <= destination.x && mouseCoord.y >= origin.y && mouseCoord.y <= destination.y;
    }

    private moveSelectionMouse(ctx: CanvasRenderingContext2D): void {
        const image = this.selectionService.selection;

        // Effacer l'ancienne image
        let firstPositionX: number = this.selectionService.origin.x;
        let firstPositionY: number = this.selectionService.origin.y;
        if (this.selectionService.origin.x > this.selectionService.destination.x) {
            firstPositionX = this.selectionService.destination.x;
        }
        if (this.selectionService.origin.y > this.selectionService.destination.y) {
            firstPositionY = this.selectionService.destination.y;
        }

        this.drawingService.baseCtx.fillStyle = '#FFFFFF';
        if (!this.selectionService.isEllipse) this.drawingService.baseCtx.fillRect(firstPositionX, firstPositionY, image.width, image.height);
        else {
            this.drawingService.baseCtx.ellipse(firstPositionX, firstPositionY, this.size.x / 2, this.size.y / 2, 0, 2 * Math.PI, 0);
            this.drawingService.baseCtx.fill();
        }

        const distanceX: number = this.mouseDownCoord.x - this.initialPosition.x;
        const distanceY: number = this.mouseDownCoord.y - this.initialPosition.y;
        ctx.putImageData(image, firstPositionX + distanceX, firstPositionY + distanceY);
    }
}
