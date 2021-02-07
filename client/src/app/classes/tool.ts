import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    mouseCoord: Vec2;
    mouseMove: boolean = false;
    mouseLeave: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    handleKeyDown(event: KeyboardEvent): void {}

    handleKeyUp(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return this.mouseCoord;
    }
    onMouseClick(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    /* getPositionFromMouse(event: MouseEvent): Vec2 {
        return {
            x: event.offsetX <= DEFAULT_WIDTH ? event.offsetX : DEFAULT_WIDTH,
            y: event.offsetY <= DEFAULT_HEIGHT ? event.offsetY : DEFAULT_HEIGHT,
        };
    } */
}