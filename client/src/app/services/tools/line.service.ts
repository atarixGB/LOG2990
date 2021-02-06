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
    private coords: Vec2[];
    lineWidth: number;
    junctionType: TypeOfJunctions;
    junctionRadius: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.junctionRadius = DEFAULT_JUNCTION_RADIUS;
        this.junctionType = TypeOfJunctions.REGULAR;
        this.coords = [];
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);

        this.coords.push(this.mouseDownCoord);
        console.log('click :', this.coords[this.coords.length - 1]);

        if (this.junctionType === TypeOfJunctions.CIRCLE) {
            this.drawingService.baseCtx.lineWidth = this.lineWidth;
            this.drawingService.baseCtx.fillStyle = 'black';
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
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
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
                // TODO
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

        for (let i = 0; i < this.coords.length - 2; i++) {
            console.log('--- New segment---');
            ctx.beginPath();

            console.log('move to: ', this.coords[i].x, this.coords[i].y);
            ctx.moveTo(this.coords[i].x, this.coords[i].y);

            console.log('line to: ', this.coords[i + 1].x, this.coords[i + 1].y);
            ctx.lineTo(this.coords[i + 1].x, this.coords[i + 1].y);

            ctx.stroke();
        }

        this.clearPath();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
