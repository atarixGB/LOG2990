import { Injectable } from '@angular/core';
import { ToolShape } from '@app/classes/tool-shape';
import { Vec2 } from '@app/classes/vec2';
import { DASH_SEGMENT_FIRST, DASH_SEGMENT_SECONDARY, DEFAULT_LINE_THICKNESS, DOUBLE_MATH, MIN_SIDE, TypeStyle } from '@app/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ToolShape {
    private pointCircleCenter: Vec2;
    private radius: number;
    sides: number = MIN_SIDE;
    fillValue: boolean = false;
    strokeValue: boolean = true;
    lineWidth: number = DEFAULT_LINE_THICKNESS;

    constructor(protected drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);

        this.fillValue = false;
        this.strokeValue = false;
        this.selectType = TypeStyle.stroke;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.finalPoint = this.getPositionFromMouse(event);
            this.drawPolygon(this.drawingService.baseCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.finalPoint = this.getPositionFromMouse(event);
            this.ctxPreviewPerimeter();
            this.drawPolygon(this.drawingService.previewCtx);
        }
    }

    protected ctxPreviewPerimeter(): void {
        const shiftLastPoint = this.squarePoint(this.firstPoint, this.finalPoint);
        this.pointCircleCenter = this.getCircleCenter(this.firstPoint, shiftLastPoint);
        this.radius = Math.abs(this.finalPoint.x - this.firstPoint.x) / DOUBLE_MATH;
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.lineWidth = DEFAULT_LINE_THICKNESS;
        this.drawingService.previewCtx.setLineDash([DASH_SEGMENT_FIRST, DASH_SEGMENT_SECONDARY]);
        this.drawingService.previewCtx.ellipse(
            this.pointCircleCenter.x,
            this.pointCircleCenter.y,
            this.radius,
            this.radius,
            0,
            0,
            Math.PI * DOUBLE_MATH,
        );
        this.drawingService.previewCtx.stroke();
        this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.closePath();
    }

    protected drawPolygon(ctx: CanvasRenderingContext2D): void {
        const radiusFinal = this.initializePolygonVariables();
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
        ctx.fillStyle = this.colorManager.selectedColor[ColorOrder.secondaryColor].inString;

        ctx.moveTo(
            this.pointCircleCenter.x + radiusFinal * Math.cos(-Math.PI / DOUBLE_MATH),
            this.pointCircleCenter.y + radiusFinal * Math.sin(-Math.PI / DOUBLE_MATH),
        );
        for (let j = 1; j <= this.sides + 1; j++) {
            ctx.lineTo(
                this.pointCircleCenter.x + radiusFinal * Math.cos((j * DOUBLE_MATH * Math.PI) / this.sides - Math.PI / DOUBLE_MATH),
                this.pointCircleCenter.y + radiusFinal * Math.sin((j * DOUBLE_MATH * Math.PI) / this.sides - Math.PI / DOUBLE_MATH),
            );
        }
        this.changeSelectedType();
        if (this.fillValue && this.strokeValue) {
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        } else {
            if (this.fillValue) {
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    protected initializePolygonVariables(): number {
        const squarePoint = this.squarePoint(this.firstPoint, this.finalPoint);
        this.pointCircleCenter = this.getCircleCenter(this.firstPoint, squarePoint);
        this.radius = Math.abs(this.finalPoint.x - this.firstPoint.x) / DOUBLE_MATH;
        const radiusFinal = Math.abs(this.radius - this.lineWidth / DOUBLE_MATH - this.lineWidth / this.sides);

        return radiusFinal;
    }

    changeSelectedType(): void {
        switch (this.selectType) {
            case TypeStyle.stroke:
                this.fillValue = false;
                this.strokeValue = true;
                break;
            case TypeStyle.fill:
                this.fillValue = true;
                this.strokeValue = false;
                break;
            case TypeStyle.strokeFill:
                this.fillValue = true;
                this.strokeValue = true;
                break;
        }
    }
}
