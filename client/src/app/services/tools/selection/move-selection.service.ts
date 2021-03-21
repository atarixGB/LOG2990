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
    private newSelectionData: ImageData;

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

            if (this.selectionService.clearUnderneath) {
                this.selectionService.clearUnderneathShape();
                this.selectionService.clearUnderneath = false;
            }
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
            this.selectionData = this.newSelectionData;
            this.destination = { x: this.origin.x + this.selectionData.width, y: this.origin.y + this.selectionData.height };
            this.selectionService.selection = this.newSelectionData;
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
            console.log('dans move-selection handleKeyDown', event.key);
            event.preventDefault();
            this.moveSelectionKeyboard(this.drawingService.previewCtx, event);
        }
    }

    private moveSelectionMouse(ctx: CanvasRenderingContext2D): void {
        const distanceX: number = this.mouseDownCoord.x - this.initialMousePosition.x;
        const distanceY: number = this.mouseDownCoord.y - this.initialMousePosition.y;
        this.newOrigin = { x: this.origin.x + distanceX, y: this.origin.y + distanceY };
        ctx.putImageData(this.selectionData, this.newOrigin.x, this.newOrigin.y);
        this.newSelectionData = ctx.getImageData(this.newOrigin.x, this.newOrigin.y, this.selectionData.width, this.selectionData.height);
    }

    private moveSelectionKeyboard(ctx: CanvasRenderingContext2D, event: KeyboardEvent): void {
        console.log('dans move-selection.service moveSelectionKeyboard');

        switch (event.key) {
            case 'ArrowRight':
                console.log('right');
                console.log('avant', this.newOrigin);
                this.newOrigin = { x: this.origin.x + DX, y: this.origin.y };
                console.log('apres', this.newOrigin);
                break;
            case 'ArrowLeft':
                console.log('left');
                console.log('avant', this.newOrigin);
                this.newOrigin = { x: this.origin.x - DX, y: this.origin.y };
                console.log('apres', this.newOrigin);
                break;
            case 'ArrowDown': // fonctionne pas ?
                console.log('down');
                console.log('avant', this.newOrigin);
                this.newOrigin = { x: this.origin.x, y: this.origin.y + DY };
                console.log('apres', this.newOrigin);
                break;
            case 'ArrowUp': // fonctionne pas ?
                console.log('up');
                console.log('avant', this.newOrigin);
                this.newOrigin = { x: this.origin.x, y: this.origin.y - DY };
                console.log('apres', this.newOrigin);
                break;
        }
        this.drawingService.clearCanvas(ctx);
        ctx.putImageData(this.selectionData, this.newOrigin.x, this.origin.y);
        this.newSelectionData = ctx.getImageData(this.newOrigin.x, this.newOrigin.y, this.selectionData.width, this.selectionData.height);
    }
}
