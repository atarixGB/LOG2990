import { Injectable } from '@angular/core';
import { DrawingContextStyle } from '@app/classes/drawing-context-styles';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '../line/line.service';

const CLOSURE_AREA_RADIUS = 20;
const NB_MIN_SEGMENTS = 3;
const ERROR = 0.25;
const INFINITY = 10000;
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

                const adjacentSegment: Segment = {
                    initial: { x: this.polygonCoords[this.polygonCoords.length - 1].x, y: this.polygonCoords[this.polygonCoords.length - 1].y },
                    final: { x: this.polygonCoords[this.polygonCoords.length - 2].x, y: this.polygonCoords[this.polygonCoords.length - 2].y },
                };

                if (this.segmentsDoIntersect(segment1, segment2) || this.segmentsAreConfused(adjacentSegment, segment2)) {
                    this.areIntesected = true;
                    break;
                } else {
                    this.areIntesected = false;
                }
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
                this.resetAttributes();
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
        const rayCastingLine: Vec2 = { x: INFINITY, y: point.y };
        let count = 0;
        let i = 0;
        let isInside: boolean;

        do {
            let next = (i + 1) % this.polygonCoords.length;

            let segment1 = {
                initial: { x: this.polygonCoords[i].x, y: this.polygonCoords[i].y },
                final: { x: this.polygonCoords[next].x, y: this.polygonCoords[next].y },
            };
            let segment2 = {
                initial: { x: point.x, y: point.y },
                final: { x: rayCastingLine.x, y: point.y },
            };

            if (this.segmentsDoIntersect(segment1, segment2)) {
                if (this.findOrientation(segment1.initial, point, segment1.final) === 0) {
                    return this.pointOnSegment(segment1.initial, point, segment1.final);
                }
                count = count + 1;
            }
            i = next;
        } while (i != 0);

        isInside = count % 2 === 1;

        return isInside;
    }

    drawPolygon(ctx: CanvasRenderingContext2D): void {}

    private findOrientation(p: Vec2, q: Vec2, r: Vec2): number {
        let value: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (value == 0) return 0;
        return value > 0 ? 1 : 2;
    }

    private pointOnSegment(p: Vec2, q: Vec2, r: Vec2): boolean {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;
        return false;
    }

    private segmentsDoIntersect(segment1: Segment, segment2: Segment): boolean {
        const p1: Vec2 = segment1.initial;
        const q1: Vec2 = segment1.final;
        const p2: Vec2 = segment2.initial;
        const q2: Vec2 = segment2.final;

        const o1 = this.findOrientation(p1, q1, p2);
        const o2 = this.findOrientation(p1, q1, q2);
        const o3 = this.findOrientation(p2, q2, p1);
        const o4 = this.findOrientation(p2, q2, q1);

        if (o1 != o2 && o3 != o4) return true;
        if (o1 == 0 && this.pointOnSegment(p1, p2, q1)) return true;
        if (o2 == 0 && this.pointOnSegment(p1, q2, q1)) return true;
        if (o3 == 0 && this.pointOnSegment(p2, p1, q2)) return true;
        if (o4 == 0 && this.pointOnSegment(p2, q1, q2)) return true;
        return false;
    }

    private segmentsAreConfused(segment1: Segment, segment2: Segment): boolean {
        const areConfused = this.findAngleBetweenTwoSegments(segment1, segment2) <= ERROR;

        if (areConfused) {
            console.log('segments are confused');
            this.areIntesected = true;
            return areConfused;
        }
        return false;
    }

    private getVector(segment: Segment): Vec2 {
        const dx = segment.final.x - segment.initial.x;
        const dy = segment.final.y - segment.initial.y;
        const vector: Vec2 = { x: dx, y: dy };
        return vector;
    }

    private getHypothenuse(vector: Vec2): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    private dotProduct(u: Vec2, v: Vec2): number {
        return u.x * v.x + u.y * v.y;
    }

    private radToDegree(angleInRad: number): number {
        return (angleInRad * 180) / Math.PI;
    }

    private findAngleBetweenTwoSegments(segment1: Segment, segment2: Segment): number {
        const u: Vec2 = this.getVector(segment1);
        const v: Vec2 = this.getVector(segment2);
        const numerator: number = this.dotProduct(u, v);
        const denominator: number = this.getHypothenuse(u) * this.getHypothenuse(v);
        const angleInRadians: number = Math.acos(numerator / denominator);
        console.log('angle=', this.radToDegree(angleInRadians));
        return this.radToDegree(angleInRadians);
    }

    private mousePositionIsInClosureArea(mousePosition: Vec2, basePoint: Vec2, radius: number): boolean {
        const dx = Math.abs(basePoint.x - mousePosition.x);
        const dy = Math.abs(basePoint.y - mousePosition.y);
        return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

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

    private resetAttributes(): void {
        this.mouseDown = false;
        this.selectionOver = false;
        this.nbSegments = 0;
        this.areIntesected = false;
        this.shiftKeyDown = false;
        this.clearCurrentSegment();
        this.clearPolygonCoords();
        this.drawingService.clearCanvas(this.drawingService.lassoPreviewCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private clearCurrentSegment(): void {
        this.currentSegment = [];
    }

    private clearPolygonCoords(): void {
        this.polygonCoords = [];
    }
}
