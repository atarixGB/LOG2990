import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection.service';

const DX = 3;
const DY = 3;
@Injectable({
    providedIn: 'root',
})
export class MoveSelectionService extends Tool {
    private initialMousePosition: Vec2;
    private origin: Vec2;
    private newOrigin: Vec2;
    private destination: Vec2;
    private selectionData: ImageData;

    constructor(drawingService: DrawingService, private selectionService: SelectionService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.initialMousePosition = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.selectionService.imageMoved = true;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.moveSelectionMouse(this.drawingService.previewCtx);
            this.clearUnderneathShape();
            return;
        }

        if (this.selectionService.initialSelection) {
            this.origin = this.selectionService.origin;
            this.destination = this.selectionService.destination;
            this.selectionData = this.selectionService.selection;
            this.selectionService.initialSelection = false;
        }

        if (this.selectionService.mouseInSelectionArea(this.origin, this.destination, this.getPositionFromMouse(event))) {
            this.selectionService.newSelection = false;
        } else {
            this.selectionService.newSelection = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.moveSelectionMouse(this.drawingService.previewCtx);
            this.origin = this.newOrigin;
            this.destination = { x: this.origin.x + this.selectionData.width, y: this.origin.y + this.selectionData.height };
            this.selectionService.selection = this.selectionData;
            this.selectionService.origin = this.origin;
        }
        this.mouseDown = false;
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();

            this.selectionService.printMovedSelection();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            this.clearUnderneathShape();
            this.moveSelectionKeyboard(this.drawingService.previewCtx, event);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        this.destination = { x: this.origin.x + this.selectionData.width, y: this.origin.y + this.selectionData.height };
        this.selectionService.selection = this.selectionData;
        this.selectionService.origin = this.origin;
    }

    private moveSelectionMouse(ctx: CanvasRenderingContext2D): void {
        const distanceX: number = this.mouseDownCoord.x - this.initialMousePosition.x;
        const distanceY: number = this.mouseDownCoord.y - this.initialMousePosition.y;
        this.newOrigin = { x: this.origin.x + distanceX, y: this.origin.y + distanceY };
        ctx.putImageData(this.selectionData, this.newOrigin.x, this.newOrigin.y);
        this.selectionData = ctx.getImageData(this.newOrigin.x, this.newOrigin.y, this.selectionData.width, this.selectionData.height);
    }

    private moveSelectionKeyboard(ctx: CanvasRenderingContext2D, event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowRight':
                this.newOrigin = { x: this.origin.x + DX, y: this.origin.y };
                break;
            case 'ArrowLeft':
                this.newOrigin = { x: this.origin.x - DX, y: this.origin.y };
                break;
            case 'ArrowDown':
                this.newOrigin = { x: this.origin.x, y: this.origin.y + DY };
                break;
            case 'ArrowUp':
                this.newOrigin = { x: this.origin.x, y: this.origin.y - DY };
                break;
        }
        this.clearUnderneathShape();
        this.drawingService.clearCanvas(ctx);
        ctx.putImageData(this.selectionData, this.newOrigin.x, this.newOrigin.y);
        this.selectionData = ctx.getImageData(this.newOrigin.x, this.newOrigin.y, this.selectionData.width, this.selectionData.height);
        this.origin = this.newOrigin;
    }

    private clearUnderneathShape(): void {
        if (this.selectionService.clearUnderneath) {
            console.log('clear');

            this.selectionService.clearUnderneathShape();
            this.selectionService.clearUnderneath = false;
        }
    }
}
