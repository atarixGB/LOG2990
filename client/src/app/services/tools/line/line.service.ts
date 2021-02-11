import { Injectable } from '@angular/core';
// import { Segment } from '@app/classes/segment';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS, MouseButton, TypeOfJunctions } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private coordinates: Vec2[];
    private hasPressedShiftKey: boolean;
    private basePoint: Vec2;

    private lastCanvasImage: ImageData[];

    lineWidth: number;
    junctionType: TypeOfJunctions;
    junctionRadius: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.junctionRadius = DEFAULT_JUNCTION_RADIUS;
        this.junctionType = TypeOfJunctions.REGULAR;
        this.coordinates = [];
        this.lastCanvasImage = [];
        this.hasPressedShiftKey = false;
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);

        this.coordinates.push(this.mouseDownCoord);
        console.log('click :', this.coordinates[this.coordinates.length - 1]);

        if (this.junctionType === TypeOfJunctions.CIRCLE) {
            this.drawingService.baseCtx.lineWidth = this.lineWidth;
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.arc(this.mouseDownCoord.x, this.mouseDownCoord.y, this.junctionRadius, 0, 2 * Math.PI);
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.fill();
        }

        this.pathData.push(this.mouseDownCoord);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = false;
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown && !this.hasPressedShiftKey) {
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }

        if (this.hasPressedShiftKey) {
            this.drawConstraintLine(this.drawingService.baseCtx, this.coordinates, event);
        }

        if (this.pathData != undefined) {
            this.lastCanvasImage.push(
                this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height),
            );
            console.log(this.lastCanvasImage);
            console.log(this.lastCanvasImage.length);
        }

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.hasPressedShiftKey) {
                this.drawConstraintLine(this.drawingService.previewCtx, this.coordinates, event);
            } else {
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();

        switch (event.key) {
            case 'Escape':
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseDown = false;
                break;
            case 'Shift':
                this.hasPressedShiftKey = true;
                break;
            case 'Backspace':
                console.log(event.key);
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.baseCtx.putImageData(this.lastCanvasImage[this.lastCanvasImage.length - 2], 0, 0);
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.hasPressedShiftKey = false;
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y);
        ctx.stroke();
    }

    private isCloseToXAxis(currentPoint: Vec2, basePoint: Vec2): boolean {
        let projectionOnXAxis = Math.abs(currentPoint.x - basePoint.x);
        let projectionOnYAxis = Math.abs(currentPoint.y - basePoint.y);
        return projectionOnXAxis > projectionOnYAxis;
    }

    private drawConstraintLine(ctx: CanvasRenderingContext2D, path: Vec2[], event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.basePoint = path[path.length - 1];

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();

        if (this.isCloseToXAxis(mousePosition, this.basePoint)) {
            console.log('horizontal');
            ctx.moveTo(this.basePoint.x, this.basePoint.y);
            ctx.lineTo(mousePosition.x, this.basePoint.y);
            ctx.stroke();
        } else {
            console.log('vertical');
            ctx.moveTo(this.basePoint.x, this.basePoint.y);
            ctx.lineTo(this.basePoint.x, mousePosition.y);
            ctx.stroke();
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
