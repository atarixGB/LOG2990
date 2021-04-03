import { Injectable } from '@angular/core';
import { DrawingContextStyle } from '@app/classes/drawing-context-styles';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '../line/line.service';

const CLOSURE_AREA_RADIUS = 20;
const NB_MIN_SEGMENTS = 3;
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
    private currentSegment: Vec2[];
    private polygonCoords: Vec2[];
    private nbSegments: number;
    private areIntesected: boolean;
    // private firstSegment: boolean;

    constructor(drawingService: DrawingService, private lineService: LineService) {
        super(drawingService);
        this.currentSegment = [];
        this.polygonCoords = [];
        this.nbSegments = 0;
        this.areIntesected = false;

        // Just for testing
        const s1: Segment = { initial: { x: 0, y: 0 }, final: { x: 1, y: 1 } };
        const s2: Segment = { initial: { x: 3, y: 0 }, final: { x: 2, y: 2 } };
        console.log('segments se croisent ?', this.segmentsAreIntersecting(s1, s2));
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.currentSegment.push(this.mouseDownCoord);

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
            this.clearPolygonCoords();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, finalSegment, STYLES);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        // const segment2: Vec2[] = [this.polygonCoords[this.polygonCoords.length - 1], this.mouseDownCoord];
        if (this.mouseDown) {
            // if (this.polygonCoords.length > 1) {
            // for (let i = 0; i < this.polygonCoords.length - 3; i++) {
            //     let segment1: Vec2[] = [this.polygonCoords[i], this.polygonCoords[i + 1]];
            //     this.segmentIntersection(segment1, segment2);
            this.currentSegment.push(this.mouseDownCoord);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineService.drawLine(this.drawingService.previewCtx, this.currentSegment, STYLES);
            // }
            // }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (this.mouseDown && !this.areIntesected) {
            this.currentSegment.push(this.mouseDownCoord);
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, this.currentSegment, STYLES);
        }

        this.polygonCoords.push(this.mouseDownCoord);
        this.nbSegments = this.polygonCoords.length - 1;
        this.mouseDown = false;
        this.clearCurrentSegment();
    }

    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                this.clearCurrentSegment();
                this.mouseDown = false;
                this.drawingService.clearCanvas(this.drawingService.lassoPreviewCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case 'Backspace':
                break;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {}

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

        if (this.segmentsAreConfused(firstSegment, secondSegment)) {
            return true;
        }

        if (xa) {
            if (xa < Math.max(Math.min(x1, x2), Math.min(x3, x4)) || xa > Math.min(Math.max(x1, x2), Math.max(x3, x4))) {
                this.areIntesected = false;
                return false;
            }
            this.areIntesected = true;
            return true;
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
        console.log(`b1:${b1}\nm1:${m1}\nb2:${b2}\nm2:${m2}`);
        let xa;

        try {
            if (b1 != undefined && b2 != undefined && m1 != undefined && m2 != undefined) {
                xa = (b2 - b1) / (m1 - m2);
                console.log(`xa:${xa}`);
            }
        } catch (error) {
            console.log(error);
        }
        return xa;
    }

    private segmentsAreConfused(firstSegment: Segment, secondSegment: Segment): boolean {
        const m1 = this.findSlope(firstSegment);
        const m2 = this.findSlope(secondSegment);
        return m1 === m2;
    }

    private clearCurrentSegment(): void {
        this.currentSegment = [];
    }

    private clearPolygonCoords(): void {
        this.polygonCoords = [];
    }
}
