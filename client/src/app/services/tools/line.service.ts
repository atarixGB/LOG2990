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
    private segmentsData: Vec2[];
    private isShiftKeyDown: boolean;
    lineWidth: number;
    junctionType: TypeOfJunctions;
    junctionRadius: number;
    lockedPoint: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.junctionRadius = DEFAULT_JUNCTION_RADIUS;
        this.junctionType = TypeOfJunctions.REGULAR;
        this.segmentsData = [];
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);

        this.segmentsData.push(this.mouseDownCoord);
        console.log('click :', this.segmentsData[this.segmentsData.length - 1]);

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
        if (this.mouseDown && !this.isShiftKeyDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }

        if (this.isShiftKeyDown) {
            let line: Vec2[] = [];
            line.push(this.segmentsData[this.segmentsData.length - 1]);
            line.push(this.lockedPoint);
            this.drawLine(this.drawingService.baseCtx, line);
        }
        this.mouseDown = false;
        this.isShiftKeyDown = false;

        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        let basePoint = this.segmentsData[this.segmentsData.length - 1];

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);

            this.lockedPoint = this.computeHorizontalAndVerticalLine(mousePosition, basePoint);

            console.log('current: ', mousePosition, '\nlast: ', basePoint);
            console.log('nearest: ', this.lockedPoint);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();

        switch (event.key) {
            case 'Escape':
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseDown = false;
                console.log(event.key);
                break;
            case 'Shift':
                this.isShiftKeyDown = true;
                let line: Vec2[] = [];
                line.push(this.segmentsData[this.segmentsData.length - 1]);
                line.push(this.lockedPoint);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, line);
                break;
            case 'Backspace':
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.removeLastSegment(this.drawingService.baseCtx);
                console.log(event.key);
                break;
            default:
                break;
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y); // Get first point of pathData
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y); // Get last point of pathData
        ctx.stroke(); // Stroke a line between these two points
    }

    private removeLastSegment(ctx: CanvasRenderingContext2D): void {
        // redraw all segments since beginning except the last one
        ctx.lineWidth = this.lineWidth;

        for (let i = 0; i < this.segmentsData.length - 2; i++) {
            console.log('--- New segment---');
            ctx.beginPath();

            console.log('move to: ', this.segmentsData[i].x, this.segmentsData[i].y);
            ctx.moveTo(this.segmentsData[i].x, this.segmentsData[i].y);

            console.log('line to: ', this.segmentsData[i + 1].x, this.segmentsData[i + 1].y);
            ctx.lineTo(this.segmentsData[i + 1].x, this.segmentsData[i + 1].y);

            ctx.stroke();
            ctx.closePath();
        }

        this.clearPath();
    }

    private computeHorizontalAndVerticalLine(currentPoint: Vec2, basePoint: Vec2): Vec2 {
        let projectionOnXAxis = Math.abs(currentPoint.x - basePoint.x);
        let projectionOnYAxis = Math.abs(currentPoint.y - basePoint.y);

        if (projectionOnXAxis > projectionOnYAxis) {
            console.log('horizontal');
            return {
                // lock to horizontal line
                x: currentPoint.x,
                y: basePoint.y,
            };
        } else {
            console.log('vertical');
            return {
                // lock to vertical line
                x: basePoint.x,
                y: currentPoint.y,
            };
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
