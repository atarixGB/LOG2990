import { Injectable } from '@angular/core';
import { DrawingContextStyle } from '@app/classes/drawing-context-styles';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '../line/line.service';

const CLOSURE_AREA_RADIUS = 20;
const NB_MIN_SEGMENTS = 3;
// const EPSILON = 0.5;
const EXTREME = 10000;
const STYLES: DrawingContextStyle = {
    strokeStyle: 'black',
    fillStyle: 'black',
    lineWidth: 1,
};

interface Segment {
    initial: Vec2;
    final: Vec2;
}

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    selectionOver: boolean;
    polygonCoords: Vec2[];
    private currentSegment: Vec2[];
    private nbSegments: number;
    private areIntesected: boolean;
    private shiftKeyDown: boolean;

    constructor(drawingService: DrawingService, private lineService: LineService) {
        super(drawingService);
        this.selectionOver = false;
        this.polygonCoords = [];
        this.currentSegment = [];
        this.nbSegments = 0;
        this.areIntesected = false;
        this.shiftKeyDown = false;
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.currentSegment.push(this.mouseDownCoord);

        if (this.selectionOver) this.selectionOver = false;
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        let segment1: Segment, segment2: Segment;
        if (this.mouseDown) {
            for (let i = 1; i < this.polygonCoords.length - 1; i++) {
                segment1 = {
                    initial: { x: this.polygonCoords[i - 1].x, y: this.polygonCoords[i - 1].y },
                    final: { x: this.polygonCoords[i].x, y: this.polygonCoords[i].y },
                };
                segment2 = {
                    initial: { x: this.polygonCoords[this.polygonCoords.length - 1].x, y: this.polygonCoords[this.polygonCoords.length - 1].y },
                    final: { x: this.mouseDownCoord.x, y: this.mouseDownCoord.y },
                };

                if (this.segmentsAreIntersecting(segment1, segment2)) {
                    break;
                }

                // const adjacentSegment: Segment = {
                //     initial: { x: this.polygonCoords[this.polygonCoords.length - 1].x, y: this.polygonCoords[this.polygonCoords.length - 1].y },
                //     final: { x: this.polygonCoords[this.polygonCoords.length - 2].x, y: this.polygonCoords[this.polygonCoords.length - 2].y },
                // };

                // if (this.segmentsAreConfused(adjacentSegment, segment2)) {
                //     this.areIntesected = true;
                // }
            }

            let color = this.areIntesected ? 'red' : 'black';
            const lineStyle: DrawingContextStyle = {
                strokeStyle: color,
                fillStyle: color,
                lineWidth: 1,
            };

            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.shiftKeyDown) {
                this.drawConstrainedLine(this.drawingService.previewCtx, this.polygonCoords, lineStyle, event);
            } else {
                this.currentSegment.push(this.mouseDownCoord);
                this.lineService.drawLine(this.drawingService.previewCtx, this.currentSegment, lineStyle);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (this.areIntesected) return;

        if (this.mouseDown) {
            if (this.shiftKeyDown) {
                this.drawConstrainedLine(this.drawingService.lassoPreviewCtx, this.polygonCoords, STYLES, event);
            } else {
                this.currentSegment.push(this.mouseDownCoord);
                this.lineService.drawLine(this.drawingService.lassoPreviewCtx, this.currentSegment, STYLES);
            }
        }

        this.polygonCoords.push(this.mouseDownCoord);
        this.nbSegments = this.polygonCoords.length - 1;
        this.mouseDown = false;
        this.clearCurrentSegment();

        if (
            this.mousePositionIsInClosureArea(this.mouseDownCoord, this.polygonCoords[0], CLOSURE_AREA_RADIUS) &&
            this.nbSegments >= NB_MIN_SEGMENTS &&
            !this.areIntesected
        ) {
            const finalSegment: Vec2[] = [
                { x: this.polygonCoords[this.polygonCoords.length - 1].x, y: this.polygonCoords[this.polygonCoords.length - 1].y },
                { x: this.polygonCoords[0].x, y: this.polygonCoords[0].y },
            ];
            this.clearCurrentSegment();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, finalSegment, STYLES);
            this.mouseDown = false;
            this.selectionOver = true;
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                this.clearCurrentSegment();
                this.clearPolygonCoords();
                this.mouseDown = false;
                this.drawingService.clearCanvas(this.drawingService.lassoPreviewCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case 'Backspace':
                this.redrawPreviousState(event);
                break;
            case 'Shift':
                this.shiftKeyDown = true;
                break;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            console.log(event);
            this.shiftKeyDown = false;
        }
    }

    findMinCoord(coordinates: Vec2[]): Vec2 {
        let minX;
        let minY;

        minX = coordinates[0].x;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].x < minX) {
                minX = coordinates[i].x;
            }
        }

        minY = coordinates[0].y;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].y < minY) {
                minY = coordinates[i].y;
            }
        }
        return { x: minX, y: minY };
    }

    findMaxCoord(coordinates: Vec2[]): Vec2 {
        let maxX;
        let maxY;

        maxX = coordinates[0].x;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].x > maxX) {
                maxX = coordinates[i].x;
            }
        }

        maxY = coordinates[0].y;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].y > maxY) {
                maxY = coordinates[i].y;
            }
        }

        return { x: maxX, y: maxY };
    }

    pointInPolygon(point: Vec2): boolean {
        //console.log('entrer');

        // if (NB_MIN_SEGMENTS) return false;

        const extremePoint: Vec2 = { x: EXTREME, y: point.y };

        let count = 0;
        let i = 0;

        do {
            console.log('dododo');

            let next = (i + 1) % this.polygonCoords.length;

            let segment1 = {
                initial: { x: this.polygonCoords[i].x, y: this.polygonCoords[i].y },
                final: { x: this.polygonCoords[next].x, y: this.polygonCoords[next].y },
            };
            let segment2 = {
                initial: { x: point.x, y: point.y },
                final: { x: extremePoint.x, y: point.y },
            };
            if (this.segmentsAreIntersecting(segment1, segment2)) {
                if (this.findOrientation(segment1.initial, point, segment1.final) === 0) {
                    return this.pointOnSegment(segment1.initial, point, segment1.final);
                }
                count = count + 1;
            }
            i = next;
            console.log(i);
        } while (i != 0);

        console.log('count: ', count);

        return count % 2 === 1;
    }

    private findOrientation(p: Vec2, q: Vec2, r: Vec2): number {
        let value: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (value == 0) return 0;
        return value > 0 ? 1 : 2;
    }

    private pointOnSegment(p: Vec2, q: Vec2, r: Vec2): boolean {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;
        return false;
    }

    drawPolygon(ctx: CanvasRenderingContext2D): void {}

    private mousePositionIsInClosureArea(mousePosition: Vec2, basePoint: Vec2, radius: number): boolean {
        const dx = Math.abs(basePoint.x - mousePosition.x);
        const dy = Math.abs(basePoint.y - mousePosition.y);
        return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

    private segmentsAreIntersecting(firstSegment: Segment, secondSegment: Segment): boolean {
        const x1 = firstSegment.initial.x;
        const x2 = firstSegment.final.x;
        const x3 = secondSegment.initial.x;
        const x4 = secondSegment.final.x;
        const xa = this.findXCoordOfIntersection(firstSegment, secondSegment);

        if (xa) {
            if (xa < Math.max(Math.min(x1, x2), Math.min(x3, x4)) || xa > Math.min(Math.max(x1, x2), Math.max(x3, x4))) {
                this.areIntesected = false;
                return false;
            } else {
                this.areIntesected = true;
                return true;
            }
        }
        return false;
    }

    private findSlope(segment: Segment): number | undefined {
        let slope;
        const dx = segment.final.x - segment.initial.x;
        const dy = segment.final.y - segment.initial.y;

        try {
            slope = dy / dx;
        } catch (error) {
            console.log(error);
        }
        return slope;
    }

    // Equation of a line: y = mx + b ==> b = y - mx
    private findVerticalIntercept(segment: Segment): number | undefined {
        const slope = this.findSlope(segment);
        if (slope) {
            const b = segment.initial.y - slope * segment.initial.x;
            return b;
        }
        return undefined;
    }

    private findXCoordOfIntersection(firstSegment: Segment, secondSegment: Segment): number | undefined {
        const b1 = this.findVerticalIntercept(firstSegment);
        const b2 = this.findVerticalIntercept(secondSegment);
        const m1 = this.findSlope(firstSegment);
        const m2 = this.findSlope(secondSegment);
        let xa;

        try {
            if (b1 != undefined && b2 != undefined && m1 != undefined && m2 != undefined) {
                xa = (b2 - b1) / (m1 - m2);
            }
        } catch (error) {
            console.log(error);
        }
        return xa;
    }

    // private segmentsAreConfused(firstSegment: Segment, secondSegment: Segment): boolean {
    //     const m1 = this.findSlope(firstSegment);
    //     const m2 = this.findSlope(secondSegment);
    //     if (m1 != undefined && m2 != undefined) {
    //         const delta = Math.abs(Math.abs(m1) - Math.abs(m2));
    //         console.log(`m1=${m1}, m2=${m2}, delta=${delta}`);
    //         return delta < EPSILON;
    //     }
    //     return false;
    // }

    private redrawPreviousState(event: KeyboardEvent): void {
        this.clearCurrentSegment();
        this.drawingService.clearCanvas(this.drawingService.lassoPreviewCtx);
        this.polygonCoords.pop();
        for (let i = 1; i < this.polygonCoords.length; i++) {
            let segment: Vec2[] = [
                { x: this.polygonCoords[i - 1].x, y: this.polygonCoords[i - 1].y },
                { x: this.polygonCoords[i].x, y: this.polygonCoords[i].y },
            ];
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, segment, STYLES);
        }
    }

    private drawConstrainedLine(ctx: CanvasRenderingContext2D, path: Vec2[], styles: DrawingContextStyle, event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.lineService.basePoint = path[path.length - 1];
        this.lineService.closestPoint = this.lineService.calculatePosition(mousePosition, this.lineService.basePoint);
        this.lineService.drawConstrainedLine(this.drawingService.lassoPreviewCtx, this.currentSegment, styles, event);
    }

    private clearCurrentSegment(): void {
        this.currentSegment = [];
    }

    private clearPolygonCoords(): void {
        this.polygonCoords = [];
    }
}
