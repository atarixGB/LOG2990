import { Injectable } from '@angular/core';
import { Segment } from '@app/classes/segment';
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
    lineWidth: number;
    junctionType: TypeOfJunctions;
    junctionRadius: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.junctionRadius = DEFAULT_JUNCTION_RADIUS;
        this.junctionType = TypeOfJunctions.REGULAR;
        this.coordinates = [];
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

        // TODO: Refactoring --> Put the following code in a method
        if (this.hasPressedShiftKey) {
            console.log('last cood before:', this.coordinates[this.coordinates.length - 1]);
            this.basePoint = this.coordinates[this.coordinates.length - 1];
            this.drawingService.baseCtx.beginPath();
            if (this.isCloseToXAxis(mousePosition, this.basePoint)) {
                console.log('horizontal');
                this.drawingService.baseCtx.moveTo(this.basePoint.x, this.basePoint.y);
                this.drawingService.baseCtx.lineTo(mousePosition.x, this.basePoint.y);
                this.drawingService.baseCtx.stroke();
            } else {
                console.log('vertical');
                this.drawingService.baseCtx.moveTo(this.basePoint.x, this.basePoint.y);
                this.drawingService.baseCtx.lineTo(this.basePoint.x, mousePosition.y);
                this.drawingService.baseCtx.stroke();
            }
            console.log('last cood before:', this.coordinates[this.coordinates.length - 1]);
        }

        this.mouseDown = false;

        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // this.drawLine(this.drawingService.previewCtx, this.pathData);

            // TODO: Refactoring --> Put the following code in a method
            if (this.hasPressedShiftKey) {
                this.basePoint = this.coordinates[this.coordinates.length - 1];

                this.drawingService.previewCtx.lineWidth = this.lineWidth;
                this.drawingService.previewCtx.beginPath();

                if (this.isCloseToXAxis(mousePosition, this.coordinates[this.coordinates.length - 1])) {
                    console.log('horizontal');
                    this.drawingService.previewCtx.moveTo(this.basePoint.x, this.basePoint.y);
                    this.drawingService.previewCtx.lineTo(mousePosition.x, this.basePoint.y);
                    this.drawingService.previewCtx.stroke();
                } else {
                    console.log('vertical');
                    this.drawingService.previewCtx.moveTo(this.basePoint.x, this.basePoint.y);
                    this.drawingService.previewCtx.lineTo(this.basePoint.x, mousePosition.y);
                    this.drawingService.previewCtx.stroke();
                }
            } else {
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
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
                this.hasPressedShiftKey = true;
                break;
            case 'Backspace':
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.redrawCanvas(this.drawingService.baseCtx, this.getAllDrawnSegments(this.coordinates));
                console.log(event.key);
                break;
            default:
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
        ctx.moveTo(path[0].x, path[0].y); // Get first point of pathData
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y); // Get last point of pathData
        ctx.stroke();
    }

    private getAllDrawnSegments(coordinates: Vec2[]): Segment[] {
        let segments: Segment[] = [];
        if (this.mouseDown) {
            for (let i = 0; i < coordinates.length - 1; i++) {
                segments.push({
                    startPoint: {
                        x: coordinates[i].x,
                        y: coordinates[i].y,
                    },
                    endPoint: {
                        x: coordinates[i + 1].x,
                        y: coordinates[i + 1].y,
                    },
                });
                console.log(segments, '\nnb of segments:', segments.length);
            }
        }
        return segments;
    }

    private redrawCanvas(ctx: CanvasRenderingContext2D, segments: Segment[]): void {
        ctx.lineWidth = this.lineWidth;
        for (let i = 0; i < segments.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(segments[i].endPoint.x, segments[i].endPoint.y);
            ctx.lineTo(segments[i].startPoint.x, segments[i].startPoint.y);
            ctx.stroke();
        }
    }

    private isCloseToXAxis(currentPoint: Vec2, basePoint: Vec2): boolean {
        let projectionOnXAxis = Math.abs(currentPoint.x - basePoint.x);
        let projectionOnYAxis = Math.abs(currentPoint.y - basePoint.y);
        return projectionOnXAxis > projectionOnYAxis;
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
