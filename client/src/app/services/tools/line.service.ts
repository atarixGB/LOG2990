import { Injectable } from '@angular/core';
// import { Segment } from '@app/classes/segment';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS, MouseButton, TypeOfJunctions } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

const WHITE: string = '#ffffff';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private firstClickedCoord: Vec2;
    private lastCoordinate: Vec2;
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

        if (this.firstClickedCoord === undefined) {
            this.firstClickedCoord = this.mouseDownCoord;
            console.log('first click:' + this.firstClickedCoord.x, this.firstClickedCoord.y);
        }

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
            this.lastCoordinate = mousePosition;
            this.coords.push(this.lastCoordinate);
            console.log('coords: ' + this.coords[this.coords.length - 1].x + this.coords[this.coords.length - 1].y);
            console.log('last coordinates: ' + this.lastCoordinate.x, this.lastCoordinate.y);
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
                break;
            case 'Shift':
                // TODO
                break;
            case 'Backspace':
                this.removeLastSegment(this.drawingService.baseCtx, this.coords);
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

    private removeLastSegment(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.lineWidth + 10;
        ctx.strokeStyle = WHITE;
        ctx.beginPath();
        ctx.moveTo(path[path.length - 2].x, path[path.length - 2].y); // Get first point of pathData
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y); // Get last point of pathData
        ctx.stroke(); // Stroke a line between these two points
    }

    // private isCloseToXAxis(coords: Vec2): boolean {
    //   let angle = Math.tan(coords.y/coords.x);
    //   return angle >= 0 && angle < 45;
    // }

    private clearPath(): void {
        this.pathData = [];
    }
}
