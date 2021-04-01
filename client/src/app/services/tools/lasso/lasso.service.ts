import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.pathData = [];
        console.log('LASSO SERVICE');
    }

    onMouseClick(event: MouseEvent): void {
        console.log('onMouseClick de Lasso', this.getPositionFromMouse(event));

        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.pathData.push(this.mouseDownCoord);
        console.log('pathData', this.pathData.length, this.pathData);
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    handleKeyDown(event: KeyboardEvent): void {}

    handleKeyUp(event: KeyboardEvent): void {}
}
