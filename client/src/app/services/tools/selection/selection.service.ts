import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '../../drawing/drawing.service';
import { EllipseService } from '../ellipse/ellipse.service';
import { RectangleService } from '../rectangle/rectangle.service';
// import { ShapeService } from '../shape/shape.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    isEllipse: boolean;
    selection: ImageData;
    private origin: Vec2;
    private destination: Vec2;
    private width: number;
    private height: number;
    // private selectionOver: boolean;

    constructor(protected drawingService: DrawingService, private rectangleService: RectangleService, private ellipseService: EllipseService) {
        super(drawingService);
        this.isEllipse = false;

        // this.selectionOver = true;
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.previewCtx.strokeStyle = '#black';

        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([2]);

            if (!this.isEllipse) this.rectangleService.onMouseDown(event);
            else this.ellipseService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            if (!this.isEllipse) {
                this.rectangleService.onMouseMove(event);
            } else {
                this.ellipseService.onMouseMove(event);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.getSelectionData(this.drawingService.baseCtx);
    }

    // onMouseLeave(event: MouseEvent): void{
    //     this.onMouseUp(event);
    // }

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

    private getSelectionData(ctx: CanvasRenderingContext2D): void {
        this.calculateDimension();
        this.selection = ctx.getImageData(this.origin.x, this.origin.y, this.width, this.height);
        if (this.isEllipse) {
            const imageData = this.selection.data;
            const pixelLenght = 4;
            let pixelCounter = 0;

            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    const rectangleCenter = { x: this.width / 2, y: this.height / 2 };

                    const x = j - rectangleCenter.x;
                    const y = i - rectangleCenter.y;

                    // verification of if pixel is out of bounds of the ellipse selection with the ellipse formula (x^2/a^2 + y^2/b^2)
                    if (Math.pow(x, 2) / Math.pow(rectangleCenter.x, 2) + Math.pow(y, 2) / Math.pow(rectangleCenter.y, 2) > 1) {
                        // if out of bounds, the corresponding values in imageData to the current pixel are set to 0
                        for (let z = 0; z < pixelLenght; z++) {
                            imageData[pixelCounter] = 0;
                            pixelCounter++;
                        }
                    } else {
                        pixelCounter += pixelLenght;
                    }
                }
            }
        }
    }
}
