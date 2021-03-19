import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '../../drawing/drawing.service';
import { EllipseService } from '../ellipse/ellipse.service';
import { RectangleService } from '../rectangle/rectangle.service';

const SELECTION_DEFAULT_LINE_THICKNESS = 3;

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    isEllipse: boolean;
    isSelectAll: boolean;
    selection: ImageData;
    origin: Vec2;
    destination: Vec2;
    newSelection: boolean;
    initialSelection: boolean;
    imageMoved: boolean;
    clearUnderneath: boolean;
    width: number;
    height: number;
    test: number;
    private previousLineWidthRectangle: number;
    private previousLineWidthEllipse: number;

    constructor(protected drawingService: DrawingService, private rectangleService: RectangleService, private ellipseService: EllipseService) {
        super(drawingService);
        this.isEllipse = false;
        this.newSelection = true;
        this.initialSelection = true;
        this.imageMoved = false;
        this.clearUnderneath = true;
        this.isSelectAll = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.previousLineWidthRectangle = this.rectangleService.lineWidth;
        this.previousLineWidthEllipse = this.ellipseService.lineWidth;
        this.rectangleService.isSelection = true;
        this.ellipseService.isSelection = true;

        this.isSelectAll = false;

        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            if (this.imageMoved) {
                this.printMovedSelection();
                this.imageMoved = false;
            }
            this.initialSelection = true;
            this.clearUnderneath = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([2]);

            if (!this.isEllipse) this.rectangleService.onMouseDown(event);
            else this.ellipseService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.rectangleService.lineWidth = SELECTION_DEFAULT_LINE_THICKNESS;
            this.ellipseService.lineWidth = SELECTION_DEFAULT_LINE_THICKNESS;
            if (!this.isEllipse) {
                this.rectangleService.onMouseMove(event);
            } else {
                this.ellipseService.onMouseMove(event);
            }

            return;
        }

        if (this.mouseInSelectionArea(this.origin, this.destination, this.getPositionFromMouse(event))) {
            this.newSelection = false;
        } else {
            this.newSelection = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.getSelectionData(this.drawingService.baseCtx);

        // faire une methode de reset des parametres;
        this.rectangleService.mouseDown = false;
        this.rectangleService.lineWidth = this.previousLineWidthRectangle;
        this.ellipseService.mouseDown = false;
        this.ellipseService.lineWidth = this.previousLineWidthEllipse;
        this.drawingService.previewCtx.setLineDash([0]);
        this.rectangleService.isSelection = false;
        this.ellipseService.isSelection = false;
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (!this.isEllipse) this.rectangleService.handleKeyDown(event);
        else this.ellipseService.handleKeyDown(event);

        if (event.key === 'Escape') {
            event.preventDefault();

            this.printMovedSelection();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (!this.isEllipse) this.rectangleService.handleKeyUp(event);
        else this.ellipseService.handleKeyUp(event);
    }

    mouseInSelectionArea(origin: Vec2, destination: Vec2, mouseCoord: Vec2): boolean {
        return mouseCoord.x >= origin.x && mouseCoord.x <= destination.x && mouseCoord.y >= origin.y && mouseCoord.y <= destination.y;
    }

    calculateDimension(): void {
        if (!this.isEllipse) {
            this.origin = this.rectangleService.pathData[0];
            this.destination = this.rectangleService.pathData[this.rectangleService.pathData.length - 1];
        } else {
            this.origin = this.ellipseService.pathData[0];
            this.destination = this.ellipseService.pathData[this.ellipseService.pathData.length - 1];
        }
        this.width = Math.abs(this.destination.x - this.origin.x);
        this.height = Math.abs(this.destination.y - this.origin.y);
    }

    selectAll(): void {
        this.clearUnderneath = true;
        this.isSelectAll = true;
        this.selection = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        this.origin = { x: 0, y: 0 };
        this.destination = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
    }

    clearUnderneathShape(): void {
        this.drawingService.baseCtx.fillStyle = '#FFFFFF';
        if (this.isEllipse) {
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.ellipse(this.origin.x, this.origin.y, this.width / 2, this.height / 2, 0, 2 * Math.PI, 0);
            this.drawingService.baseCtx.fill();
            this.drawingService.baseCtx.closePath();
        } else if (this.isSelectAll) {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            console.log('ici!!');
        } else this.drawingService.baseCtx.fillRect(this.origin.x, this.origin.y, this.width, this.height);
    }

    private getSelectionData(ctx: CanvasRenderingContext2D): void {
        this.calculateDimension();
        this.selection = ctx.getImageData(this.origin.x, this.origin.y, this.width, this.height);

        if (this.isEllipse) {
            this.checkPixelInEllipse();
        }

        // this.clearUnderneathShape();
    }

    private checkPixelInEllipse(): void {
        const imageData = this.selection.data;
        const pixelLenght = 4;
        let pixelCounter = 0;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const rectangleCenter = { x: this.width / 2, y: this.height / 2 };
                const x = j - rectangleCenter.x;
                const y = i - rectangleCenter.y;

                if (Math.pow(x, 2) / Math.pow(rectangleCenter.x, 2) + Math.pow(y, 2) / Math.pow(rectangleCenter.y, 2) > 1) {
                    imageData[pixelCounter + pixelLenght - 1] = 0;
                }
                pixelCounter += pixelLenght;
            }
        }
    }

    private printMovedSelection(): void {
        this.drawingService.baseCtx.putImageData(this.selection, this.origin.x, this.origin.y);
    }
}
