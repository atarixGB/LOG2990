import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
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
    // private origin: Vec2;
    // private destination: Vec2;
    // private selectionOver: boolean;

    constructor(protected drawingService: DrawingService, private rectangleService: RectangleService, private ellipseService: EllipseService) {
        super(drawingService);
        this.isEllipse = false;
        // this.selectionOver = true;
    }

    onMouseDown(event: MouseEvent): void {
        console.log('mouseDown');

        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            console.log('select', this.mouseDownCoord);

            if (!this.isEllipse) this.rectangleService.onMouseDown(event);
            else this.ellipseService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            console.log('mouseMove');
            if (!this.isEllipse) {
                this.rectangleService.onMouseMove(event);
                this.rectangleService.lineWidth = 1;
            } else {
                this.ellipseService.onMouseMove(event);
                this.ellipseService.lineWidth = 1;
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        console.log('mouseUp');

        if (this.mouseDown) {
            // this.mouseDownCoord = this.getPositionFromMouse(event);
            // this.shapeService.pathData.push(this.mouseDownCoord);
            // if (this.isEllipse) this.ellipseService.drawShape(this.drawingService.previewCtx);
            // else this.rectangleService.drawShape(this.drawingService.previewCtx);
            this.mouseDown = false;
        }
    }
}
