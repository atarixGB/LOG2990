import { Injectable } from '@angular/core';
import { SelectionTool } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { CONTROLPOINTSIZE } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    private resizeWidth: number;
    private resizeHeight: number;

    constructor(private drawingService: DrawingService) {
        this.controlPointsBinding = new Map<ControlPoints, () => void>();
        this.controlPointsBinding
            .set(ControlPoints.TopLeft, () => this.resizeTopLeft())
            .set(ControlPoints.TopRight, () => this.resizeTopRight())
            .set(ControlPoints.BottomRigth, () => this.resizeBottomRight())
            .set(ControlPoints.BottomLeft, () => this.resizeBottomLeft())
            .set(ControlPoints.MiddleTop, () => this.resizeMiddleTop())
            .set(ControlPoints.MiddleRight, () => this.resizeMiddleRight())
            .set(ControlPoints.MiddleBottom, () => this.resizeMiddleBottom())
            .set(ControlPoints.MiddleLeft, () => this.resizeMiddleLeft());
    }

    checkIfMouseIsOnControlPoint(mouseCoord: Vec2): boolean {
        for (let i = 0; i < this.controlPointsCoord.length; i++) {
            const boxOrigin = { x: this.controlPointsCoord[i].x, y: this.controlPointsCoord[i].y };
            const boxDestination = { x: this.controlPointsCoord[i].x + CONTROLPOINTSIZE, y: this.controlPointsCoord[i].y + CONTROLPOINTSIZE };
            if (mouseCoord.x >= boxOrigin.x && mouseCoord.y >= boxOrigin.y && mouseCoord.x <= boxDestination.x && mouseCoord.y <= boxDestination.y) {
                this.currentControlPoint = i;
                return true;
            }
        }
        return false;
    }

    onMouseMove(mouseCoord: Vec2, selection: SelectionTool): void {
        this.selectionObject = selection;
        this.mouseCoord = mouseCoord;
        this.controlPointInResize();
    }

    printResize(): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.selectionObject.width;
        canvas.height = this.selectionObject.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(this.selectionObject.image, 0, 0);

        this.drawingService.previewCtx.save();
        this.checkForMirroirEffect(tmp.canvas);
        this.drawingService.previewCtx.restore();
    }

    setResizedDimensions(): Vec2 {
        return { x: this.resizeWidth, y: this.resizeHeight };
    }

    private controlPointInResize(): void {
        if (this.controlPointsBinding.has(this.currentControlPoint)) {
            const resizeFunction = this.controlPointsBinding.get(this.currentControlPoint);
            if (resizeFunction) resizeFunction();
        }
    }

    private checkForMirroirEffect(selectionImage: HTMLCanvasElement): void {
        if (this.resizeHeight < 0 && this.resizeWidth < 0) {
            this.drawingService.previewCtx.scale(-1, -1);
            this.drawingService.previewCtx.drawImage(
                selectionImage,
                -this.selectionObject.origin.x,
                -this.selectionObject.origin.y,
                -this.resizeWidth,
                -this.resizeHeight,
            );
        } else if (this.resizeWidth < 0 && this.resizeHeight > 0) {
            this.drawingService.previewCtx.scale(-1, 1);
            this.drawingService.previewCtx.drawImage(
                selectionImage,
                -this.selectionObject.origin.x,
                this.selectionObject.origin.y,
                -this.resizeWidth,
                this.resizeHeight,
            );
        } else if (this.resizeHeight < 0 && this.resizeWidth > 0) {
            this.drawingService.previewCtx.scale(1, -1);
            this.drawingService.previewCtx.drawImage(
                selectionImage,
                this.selectionObject.origin.x,
                -this.selectionObject.origin.y,
                this.resizeWidth,
                -this.resizeHeight,
            );
        } else {
            this.drawingService.previewCtx.drawImage(
                selectionImage,
                this.selectionObject.origin.x,
                this.selectionObject.origin.y,
                this.resizeWidth,
                this.resizeHeight,
            );
        }
    }

    private resizeTopLeft(): void {
        this.selectionObject.origin = this.mouseCoord;
        this.resizeWidth = this.selectionObject.destination.x - this.selectionObject.origin.x;
        this.resizeHeight = this.selectionObject.destination.y - this.selectionObject.origin.y;
    }

    private resizeTopRight(): void {
        this.selectionObject.origin.y = this.mouseCoord.y;
        this.resizeWidth = this.mouseCoord.x - this.selectionObject.origin.x;
        this.resizeHeight = this.selectionObject.destination.y - this.mouseCoord.y;
    }

    private resizeBottomRight(): void {
        this.resizeWidth = this.mouseCoord.x - this.selectionObject.origin.x;
        this.resizeHeight = this.mouseCoord.y - this.selectionObject.origin.y;
    }

    private resizeBottomLeft(): void {
        this.selectionObject.origin.x = this.mouseCoord.x;
        this.resizeWidth = this.selectionObject.destination.x - this.mouseCoord.x;
        this.resizeHeight = this.mouseCoord.y - this.selectionObject.origin.y;
    }

    private resizeMiddleTop(): void {
        this.selectionObject.origin.y = this.mouseCoord.y;
        this.resizeWidth = this.selectionObject.width;
        this.resizeHeight = this.selectionObject.destination.y - this.mouseCoord.y;
    }

    private resizeMiddleRight(): void {
        this.resizeWidth = this.mouseCoord.x - this.selectionObject.origin.x;
        this.resizeHeight = this.selectionObject.height;
    }

    private resizeMiddleBottom(): void {
        this.resizeWidth = this.selectionObject.width;
        this.resizeHeight = this.mouseCoord.y - this.selectionObject.origin.y;
    }

    private resizeMiddleLeft(): void {
        this.selectionObject.origin.x = this.mouseCoord.x;
        this.resizeWidth = this.selectionObject.destination.x - this.mouseCoord.x;
        this.resizeHeight = this.selectionObject.height;
    }
}
