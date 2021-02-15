import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_JUNCTION_RADIUS, DEFAULT_LINE_THICKNESS, MouseButton, TypeOfJunctions } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const SECOND_LAST_INDEX = -2;
const NEGATIVE_LINE_SLOPE = -1;
const NUMBER_SIGN_CHANGE = -1;

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private coordinates: Vec2[];

    private hasPressedShiftKey: boolean;
    private basePoint: Vec2;

    private lastCanvasImages: ImageData[];

    lineWidth: number;
    junctionType: TypeOfJunctions;
    junctionRadius: number;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.junctionRadius = DEFAULT_JUNCTION_RADIUS;
        this.junctionType = TypeOfJunctions.Regular;
        this.coordinates = [];
        this.lastCanvasImages = [];
        this.pathData = [];
        this.hasPressedShiftKey = false;
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.coordinates.push(this.mouseDownCoord);
        const point: Vec2 | undefined = this.calculatePosition(this.mouseDownCoord, this.basePoint);

        if (this.hasPressedShiftKey) {
            // Handle automatic junction when drawing constrained-angle lines
            if (point) {
                this.coordinates.push(point);
                if (this.junctionType === TypeOfJunctions.Circle) this.drawPoint(this.drawingService.baseCtx, point);
            }
        } else {
            this.pathData.push(this.mouseDownCoord);
            if (this.junctionType === TypeOfJunctions.Circle) this.drawPoint(this.drawingService.baseCtx, this.mouseDownCoord);
        }
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
            this.drawConstrainedLine(this.drawingService.baseCtx, this.coordinates, event);
        }

        if (this.pathData) {
            this.lastCanvasImages.push(
                this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height),
            );
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
                this.drawConstrainedLine(this.drawingService.previewCtx, this.coordinates, event);
            } else {
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        const keyPressed = event.key;

        switch (keyPressed) {
            case 'Escape':
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseDown = false;
                break;
            case 'Shift':
                this.hasPressedShiftKey = true;
                break;
            case 'Backspace':
                // We use the second last index to get the canvas state just before last stroked line
                this.drawingService.baseCtx.putImageData(this.lastCanvasImages[this.lastCanvasImages.length + SECOND_LAST_INDEX], 0, 0);
                break;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.hasPressedShiftKey = false;
        }
    }

    // Equation of a line: 0 = ax + by + c
    // Distance from a point A to a line L :  distance(A,L) =  abs(ax + by + c) / sqrt(a^2 + b^2)
    private getDistanceBetweenPointAndLine(point: Vec2, lines: number[]): number {
        const numerator: number = Math.abs(lines[0] * point.x + lines[1] * point.y + lines[2]);
        const denominator: number = Math.sqrt(lines[0] * lines[0] + lines[1] * lines[1]);
        return numerator / denominator;
    }

    private getClosestLine(currentPoint: Vec2, basePoint: Vec2): number[] {
        const lineList = [
            [1, 1, NUMBER_SIGN_CHANGE * (basePoint.x + basePoint.y)], // ascending diagonal
            [1, NEGATIVE_LINE_SLOPE, NUMBER_SIGN_CHANGE * (basePoint.x - basePoint.y)], // descending diagonal
            [1, 0, -basePoint.x], // x axis
            [0, 1, -basePoint.y], // y axis
        ];
        const distance: number[] = lineList.map((line) => this.getDistanceBetweenPointAndLine(currentPoint, line));
        const maxDistance: number = Math.min(...distance);
        const maxIndex: number = distance.indexOf(maxDistance);
        return lineList[maxIndex];
    }

    // Cramer's Rule is used for solving the linear system equation
    //    ax + by = e
    //    cx + dy = f
    private solveLinearEquationsSystem(a: number, b: number, c: number, d: number, e: number, f: number): Vec2 {
        const determinant: number = a * d - b * c;
        const point: Vec2 = {
            x: (d * e - b * f) / determinant,
            y: (a * f - c * e) / determinant,
        };
        return point;
    }

    private getProjectionOnClosestLine(point: Vec2, line: number[]): Vec2 {
        const projection: Vec2 = this.solveLinearEquationsSystem(
            line[0],
            line[1],
            -line[1],
            line[0],
            -line[2],
            line[0] * point.y - line[1] * point.x,
        );
        return projection;
    }

    private getNearestPoint(currentPoint: Vec2, basePoint: Vec2): Vec2 {
        const nearestLine: number[] = this.getClosestLine(currentPoint, basePoint);
        return this.getProjectionOnClosestLine(currentPoint, nearestLine);
    }

    private calculatePosition(currentPoint: Vec2, basePoint: Vec2): Vec2 | undefined {
        if (!currentPoint || !basePoint) {
            return undefined;
        }
        return this.getNearestPoint(currentPoint, basePoint);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const color = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y);
        ctx.stroke();
    }

    private drawConstrainedLine(ctx: CanvasRenderingContext2D, path: Vec2[], event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.basePoint = path[path.length - 1];

        const point: Vec2 | undefined = this.calculatePosition(mousePosition, this.basePoint);
        ctx.lineWidth = this.lineWidth;
        const color = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
        ctx.strokeStyle = color;
        ctx.beginPath();
        if (point) {
            ctx.moveTo(this.basePoint.x, this.basePoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    }

    private drawPoint(ctx: CanvasRenderingContext2D, position: Vec2): void {
        const color = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
        ctx.fillStyle = color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(position.x, position.y, this.junctionRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
