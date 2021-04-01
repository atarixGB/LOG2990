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

// interface Segment {
//     points: Vec2[];
// }

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    private currentSegment: Vec2[];
    private polygonCoords: Vec2[];
    private nbSegments: number;
    // private firstSegment: boolean;

    constructor(drawingService: DrawingService, private lineService: LineService) {
        super(drawingService);
        this.currentSegment = [];
        this.polygonCoords = [];
        this.nbSegments = 0;
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.currentSegment.push(this.mouseDownCoord);

        // *** FOR DEBUG
        // let dx = Math.abs(this.polygonCoords[0].x - this.mouseDownCoord.x);
        // let dy = Math.abs(this.polygonCoords[0].y - this.mouseDownCoord.y);
        // console.log(`
        //     init point: (${this.polygonCoords[0].x},${this.polygonCoords[0].y})
        //     mouse: (${this.mouseDownCoord.x},${this.mouseDownCoord.y})
        //     distance du point init:${Math.sqrt(dx * dx + dy * dy)}`);
        // ***

        if (
            this.mousePositionIsInClosureArea(this.mouseDownCoord, this.polygonCoords[0], CLOSURE_AREA_RADIUS) &&
            this.nbSegments >= NB_MIN_SEGMENTS
        ) {
            console.log('MOUSE IS IN CLOSURE AREA');
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

        const segment2: Vec2[] = [this.polygonCoords[this.polygonCoords.length - 1], this.mouseDownCoord];
        if (this.mouseDown) {
            if (this.polygonCoords.length > 1) {
                for (let i = 0; i < this.polygonCoords.length - 1; i++) {
                    let segment1: Vec2[] = [this.polygonCoords[i], this.polygonCoords[i + 1]];
                    this.segmentIntersection(segment1, segment2);
                    this.currentSegment.push(this.mouseDownCoord);
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.lineService.drawLine(this.drawingService.previewCtx, this.currentSegment, STYLES);
                }
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.currentSegment.push(this.mouseDownCoord);
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, this.currentSegment, STYLES);
        }

        this.polygonCoords.push(this.mouseDownCoord);
        this.nbSegments = this.polygonCoords.length - 1;
        console.log('points polygone:', this.polygonCoords);
        console.log('nbr de segments:', this.nbSegments);
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

    // private pointIsInPolygon(point: Vec2, lines: Segment[]): boolean {
    //     // TODO
    //     return false;
    // }

    // private pointIsInLine(point: Vec2, line: Vec2[]): boolean {
    //     for (const p in line) {
    //         if (point.x === line[p].x && point.y === line[p].y) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    private mousePositionIsInClosureArea(mousePosition: Vec2, basePoint: Vec2, radius: number): boolean {
        const dx = Math.abs(basePoint.x - mousePosition.x);
        const dy = Math.abs(basePoint.y - mousePosition.y);
        return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

    private segmentIntersection(firstSegment: Vec2[], secondSegment: Vec2[]): boolean {
        let m1, m2;
        let b1, b2;
        let xa;
        const X1 = firstSegment[0].x;
        const Y1 = firstSegment[0].y;
        const X2 = firstSegment[1].x;
        const Y2 = firstSegment[1].y;
        const X3 = secondSegment[0].x;
        const Y3 = secondSegment[0].y;
        const X4 = secondSegment[1].x;
        const Y4 = secondSegment[1].y;
        console.log(X1, X2, X3, X4);
        console.log(Y1, Y2, Y3, Y4);

        try {
            m1 = (Y1 - Y2) / (X1 - X2);
            m2 = (Y3 - Y4) / (X3 - X4);
            console.log('m1:' + m1, 'm2:' + m2);
        } catch (error) {
            console.log('division par zero pour m1 ou m2');
        }

        if (m1 && m2) {
            b1 = Y1 - m1 * X1;
            b2 = Y3 - m2 * X3;
            console.log('b1:' + b1, 'b2:' + b2);

            if (m1 == m2) {
                console.log('m1 et m2 parallele');
                return true;
            }

            try {
                xa = (b2 - b1) / (m1 - m2);
                console.log('xa:' + xa);
            } catch {
                console.log('division par zero');
                return false;
            }

            if (xa < Math.max(Math.min(X1, X2), Math.min(X3, X4)) || xa > Math.min(Math.max(X1, X2), Math.max(X3, X4))) {
                console.log('false');
                return false;
            } else {
                console.log('true');
                // this.drawingService.lassoPreviewCtx.beginPath();
                // this.drawingService.lassoPreviewCtx.fillRect(0, 0, 20, 20);
                // this.drawingService.lassoPreviewCtx.closePath();
                return true;
            }
        }

        return false;
    }

    private clearCurrentSegment(): void {
        this.currentSegment = [];
    }

    private clearPolygonCoords(): void {
        this.polygonCoords = [];
    }
}
