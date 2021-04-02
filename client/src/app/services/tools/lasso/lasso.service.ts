import { Injectable } from '@angular/core';
import { DrawingContextStyle } from '@app/classes/drawing-context-styles';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '../line/line.service';

const CLOSURE_AREA_RADIUS = 20;
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

    constructor(drawingService: DrawingService, private lineService: LineService) {
        super(drawingService);
        this.currentSegment = [];
        this.polygonCoords = [];
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.currentSegment.push(this.mouseDownCoord);

        // *** FOR DEBUG
        let dx = Math.abs(this.polygonCoords[0].x - this.mouseDownCoord.x);
        let dy = Math.abs(this.polygonCoords[0].y - this.mouseDownCoord.y);
        console.log(`
            init point: (${this.polygonCoords[0].x},${this.polygonCoords[0].y})
            mouse: (${this.mouseDownCoord.x},${this.mouseDownCoord.y})
            distance du point init:${Math.sqrt(dx * dx + dy * dy)}`);
        // ***

        if (this.mousePositionIsInClosureArea(this.mouseDownCoord, this.polygonCoords[0], CLOSURE_AREA_RADIUS) && this.polygonCoords.length > 1) {
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
        const mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.currentSegment.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineService.drawLine(this.drawingService.previewCtx, this.currentSegment, STYLES);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.currentSegment.push(mousePosition);
            this.lineService.drawLine(this.drawingService.lassoPreviewCtx, this.currentSegment, STYLES);
        }

        this.polygonCoords.push(mousePosition);
        console.log('points polygone:', this.polygonCoords);
        console.log('nbr de segments:', this.polygonCoords.length - 1);
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

    private clearCurrentSegment(): void {
        this.currentSegment = [];
    }

    private clearPolygonCoords(): void {
        this.polygonCoords = [];
    }
}
