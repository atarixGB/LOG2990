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
    origin: Vec2;
    destination: Vec2;
    newSelection: boolean;
    areaSelected: boolean;
    private width: number;
    private height: number;

    constructor(protected drawingService: DrawingService, private rectangleService: RectangleService, private ellipseService: EllipseService) {
        super(drawingService);
        this.isEllipse = false;
        this.newSelection = true;
        this.areaSelected = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.previewCtx.strokeStyle = '#black';

        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.areaSelected = false;
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
        this.areaSelected = true;

        console.log('selection', this.areaSelected);
    }

    // onMouseLeave(event: MouseEvent): void{
    //     this.onMouseUp(event);
    // }

    handleKeyDown(event: KeyboardEvent): void {
        // if (!this.isEllipse) this.rectangleService.handleKeyDown(event);
        // else this.ellipseService.handleKeyDown(event);

        console.log('keydown');
        console.log(event);

        if (event.key === 'Escape') {
            event.preventDefault();
            console.log('escape');

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.areaSelected = false;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (!this.isEllipse) this.rectangleService.handleKeyUp(event);
        else this.ellipseService.handleKeyUp(event);
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

    private getSelectionData(ctx: CanvasRenderingContext2D): void {
        this.calculateDimension();
        this.selection = ctx.getImageData(this.origin.x, this.origin.y, this.width, this.height);

        // console.log('2');
        // console.log('origin', this.origin);
        // console.log('dest', this.destination);
        // console.log('Witdh', this.width);
        // console.log('height', this.height);

        if (this.isEllipse) {
            const imageData = this.selection.data;
            const pixelLenght = 4;
            let pixelCounter = 0;

            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    const rectangleCenter = { x: this.width / 2, y: this.height / 2 };

                    const x = j - rectangleCenter.x;
                    const y = i - rectangleCenter.y;

                    // optimisation et juste mettre la transparence a 0 ?
                    if (Math.pow(x, 2) / Math.pow(rectangleCenter.x, 2) + Math.pow(y, 2) / Math.pow(rectangleCenter.y, 2) > 1) {
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
