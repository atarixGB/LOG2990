import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CONTROLPOINTSIZE } from '@app/constants';

enum ControlPoints {
    TopLeft = 0,
    TopRight = 1,
    BottomRigth = 2,
    BottomLeft = 3,
    MiddleTop = 4,
    MiddleRight = 5,
    MiddleBottom = 6,
    MiddleLeft = 7,
}

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    controlPointsCoord: Vec2[];
    origin: Vec2;
    destination: Vec2;
    width: number;
    height: number;

    private currentControlPoint: ControlPoints;

    constructor() {}

    checkIfMouseIsOnControlPoint(mouseCoord: Vec2): boolean {
        for (let i = 0; i < this.controlPointsCoord.length; i++) {
            const boxOrigin = { x: this.controlPointsCoord[i].x, y: this.controlPointsCoord[i].y };
            const boxDestination = { x: this.controlPointsCoord[i].x + CONTROLPOINTSIZE, y: this.controlPointsCoord[i].y + CONTROLPOINTSIZE };
            if (mouseCoord.x >= boxOrigin.x && mouseCoord.y >= boxOrigin.y && mouseCoord.x <= boxDestination.x && mouseCoord.y <= boxDestination.y) {
                console.log('true', boxOrigin, boxDestination, i);
                this.currentControlPoint = i;
                return true;
            }
        }
        return false;
    }

    controlPointInResize(): void {
        switch (this.currentControlPoint) {
            case ControlPoints.TopLeft:
                // this.resizeTopLeft();
                break;
            case ControlPoints.TopRight:
                // this.resizeTopRight();
                break;
            case ControlPoints.BottomRigth:
                // this.resizeBottomRight();
                break;
            case ControlPoints.BottomLeft:
                // this.resizeBottomLeft();
                break;
            case ControlPoints.MiddleTop:
                // this.resizeMiddleTop();
                break;
            case ControlPoints.MiddleRight:
                // this.resizeTMiddleRight();
                break;
            case ControlPoints.MiddleBottom:
                // this.resizeMiddleBottom();
                break;
            case ControlPoints.MiddleLeft:
                // this.resizeMiddleLeft();
                break;
        }
    }

    resizeSelection(): void {}

    resizeTopLeft(mouseCoord: Vec2): void {
        this.origin = mouseCoord;
    }
}
