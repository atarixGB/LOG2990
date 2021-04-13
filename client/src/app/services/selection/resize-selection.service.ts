import { Injectable } from '@angular/core';
import { SelectionTool } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { CONTROLPOINTSIZE } from '@app/constants';
import { DrawingService } from '../drawing/drawing.service';

enum ControlPoints {
    TopLeft = 0,
    TopRight = 1,
    BottomRigth = 2,
    BottomLeft = 3,
    MiddleTop = 4,
    MiddleRight = 5,
    MiddleBottom = 6,
    MiddleLeft = 7,
}

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    controlPointsCoord: Vec2[];
    selectionObject: SelectionTool;

    private mouseCoord: Vec2;
    private currentControlPoint: ControlPoints;
    private controlPointsBinding: Map<ControlPoints, () => void>;

    constructor(private drawingService: DrawingService) {
        this.controlPointsBinding = new Map<ControlPoints, () => void>();
        this.controlPointsBinding
            .set(ControlPoints.TopLeft, () => this.resizeTopLeft(this.mouseCoord))
            .set(ControlPoints.TopRight, () => this.resizeTopRight(this.mouseCoord))
            .set(ControlPoints.BottomRigth, () => this.resizeBottomRight(this.mouseCoord))
            .set(ControlPoints.BottomLeft, () => this.resizeBottomLeft(this.mouseCoord))
            .set(ControlPoints.MiddleTop, () => this.resizeMiddleTop(this.mouseCoord))
            .set(ControlPoints.MiddleRight, () => this.resizeMiddleRight(this.mouseCoord))
            .set(ControlPoints.MiddleBottom, () => this.resizeMiddleBottom(this.mouseCoord))
            .set(ControlPoints.MiddleLeft, () => this.resizeMiddleLeft(this.mouseCoord));
    }

    checkIfMouseIsOnControlPoint(mouseCoord: Vec2): boolean {
        for (let i = 0; i < this.controlPointsCoord.length; i++) {
            const boxOrigin = { x: this.controlPointsCoord[i].x, y: this.controlPointsCoord[i].y };
            const boxDestination = { x: this.controlPointsCoord[i].x + CONTROLPOINTSIZE, y: this.controlPointsCoord[i].y + CONTROLPOINTSIZE };
            if (mouseCoord.x >= boxOrigin.x && mouseCoord.y >= boxOrigin.y && mouseCoord.x <= boxDestination.x && mouseCoord.y <= boxDestination.y) {
                // console.log('true', i);
                this.currentControlPoint = i;
                return true;
            }
        }
        return false;
    }

    onMouseMove(mouseCoord: Vec2, selection: SelectionTool): SelectionTool {
        this.selectionObject = selection;
        console.log('//////');
        this.controlPointInResize(mouseCoord);
        return this.selectionObject;
        // this.drawingService.previewCtx.putImageData(
        //     this.selectionObject.selection,
        //     this.selectionObject.finalOrigin.x,
        //     this.selectionObject.finalOrigin.y,
        // );
    }

    controlPointInResize(mouseCoord: Vec2): void {
        switch (this.currentControlPoint) {
            case ControlPoints.TopLeft:
                this.resizeTopLeft(mouseCoord);
                break;
            case ControlPoints.TopRight:
                this.resizeTopRight(mouseCoord);
                break;
            case ControlPoints.BottomRigth:
                this.resizeBottomRight(mouseCoord);
                break;
            case ControlPoints.BottomLeft:
                this.resizeBottomLeft(mouseCoord);
                break;
            case ControlPoints.MiddleTop:
                this.resizeMiddleTop(mouseCoord);
                break;
            case ControlPoints.MiddleRight:
                this.resizeMiddleRight(mouseCoord);
                break;
            case ControlPoints.MiddleBottom:
                this.resizeMiddleBottom(mouseCoord);
                break;
            case ControlPoints.MiddleLeft:
                this.resizeMiddleLeft(mouseCoord);
                break;
        }
    }

    resizeTopLeft(mouseCoord: Vec2): void {
        this.selectionObject.finalOrigin = mouseCoord;
        this.selectionObject.width = this.selectionObject.destination.x - this.selectionObject.finalOrigin.x;
        this.selectionObject.height = this.selectionObject.destination.y - this.selectionObject.finalOrigin.y;
    }

    resizeTopRight(mouseCoord: Vec2): void {
        // const anchorPoint = { x: this.selectionObject.finalOrigin.x, y: this.selectionObject.destination.y };
    }

    resizeBottomRight(mouseCoord: Vec2): void {}

    resizeBottomLeft(mouseCoord: Vec2): void {}

    resizeMiddleTop(mouseCoord: Vec2): void {}

    resizeMiddleRight(mouseCoord: Vec2): void {}

    resizeMiddleBottom(mouseCoord: Vec2): void {}

    resizeMiddleLeft(mouseCoord: Vec2): void {}

    printResize(): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.selectionObject.width;
        canvas.height = this.selectionObject.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(this.selectionObject.selection, 0, 0);
        console.log(this.selectionObject);

        this.drawingService.baseCtx.rect(
            this.selectionObject.finalOrigin.x,
            this.selectionObject.finalOrigin.y,
            this.selectionObject.width,
            this.selectionObject.height,
        );
        // this.drawingService.baseCtx.ellipse(
        //     this.selectionObject.finalOrigin.x + this.selectionObject.width / 2,
        //     this.selectionObject.finalOrigin.y + this.selectionObject.height / 2,
        //     this.selectionObject.width / 2,
        //     this.selectionObject.height / 2,
        //     0,
        //     2 * Math.PI,
        //     0,
        // );
        this.drawingService.baseCtx.save();
        this.drawingService.baseCtx.clip();
        this.drawingService.baseCtx.drawImage(
            tmp.canvas,
            this.selectionObject.finalOrigin.x,
            this.selectionObject.finalOrigin.y,
            this.selectionObject.width,
            this.selectionObject.height,
        );
        this.drawingService.baseCtx.restore();
    }
}
