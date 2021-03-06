import { Injectable, OnDestroy } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { Vec2 } from 'src/app/classes/vec2';
import {
    MAX_SPRAY_DOT_WIDTH,
    MAX_SPRAY_FREQUENCY,
    MIN_SPRAY_DOT_WIDTH,
    MIN_SPRAY_FREQUENCY,
    MIN_SPRAY_WIDTH,
    MouseButton,
    ONE_SECOND,
    SPRAY_DENSITY,
} from 'src/app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { Spray } from 'src/app/interfaces-enums/spray-properties';
import { DrawingService } from 'src/app/services/drawing/drawing.service';

//code inspired by spray methods in http://perfectionkills.com/exploring-canvas-drawing-techniques/

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool implements OnDestroy {
    density: number = SPRAY_DENSITY;
    minDotWidth: number = MIN_SPRAY_DOT_WIDTH;
    maxDotWidth: number = MAX_SPRAY_DOT_WIDTH;
    minFrequency: number = MIN_SPRAY_FREQUENCY;
    maxFrequency: number = MAX_SPRAY_FREQUENCY;
    minToolWidth: number = MIN_SPRAY_WIDTH;
    maxToolWidth: number = 50;
    sprayData: Spray;
    timeoutId: ReturnType<typeof setTimeout>;
    mouseCoord: Vec2;
    width: number = this.minToolWidth;
    dotWidth: number = this.minDotWidth;
    sprayFrequency: number = this.minFrequency;
    canvasData: ImageData;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
    }

    ngOnDestroy(): void {
        clearTimeout(this.timeoutId);
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.baseCtx.filter = 'none';
        this.drawingService.previewCtx.filter = 'none';
        if (event.button !== MouseButton.Left) {
            return;
        } else {
            this.mouseDown = true;
            this.mouseCoord = this.getPositionFromMouse(event);
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(this.drawSpray, ONE_SECOND / this.sprayFrequency, this, this.drawingService.previewCtx);
        }
    }

    onMouseUp(): void {
        if (this.mouseDown) {
            clearTimeout(this.timeoutId);
            this.drawingService.applyPreview();
            this.canvasData = this.drawingService.getCanvasData();
            this.updateSprayData();
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseLeave(): void {
        if (this.mouseDown) {
            clearTimeout(this.timeoutId);
            this.drawingService.applyPreview();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseCoord = this.getPositionFromMouse(event);
            this.timeoutId = setTimeout(this.drawSpray, ONE_SECOND / this.sprayFrequency, this, this.drawingService.previewCtx);
        }
    }

    drawSpray(ctx: CanvasRenderingContext2D): void {
        for (let i = this.density; i--; ) {
            const angle = this.getRandomNumber(0, Math.PI * 2);
            const radius = this.getRandomNumber(0, this.width);
            ctx.globalAlpha = Math.random();
            ctx.strokeStyle = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
            ctx.fillStyle = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
            ctx.beginPath();
            ctx.arc(
                this.mouseCoord.x + radius * Math.cos(angle),
                this.mouseCoord.y + radius * Math.sin(angle),
                this.getRandomNumber(1, this.dotWidth / 2),
                0,
                2 * Math.PI,
            );
            ctx.fill();
        }
        if (!this.timeoutId) return;
        this.timeoutId = setTimeout(this.drawSpray, ONE_SECOND / this.sprayFrequency, this, ctx);
    }

    getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }

    changeDotWidth(newDotWidth: number): void {
        this.dotWidth = newDotWidth;
    }

    changeSprayFrequency(newSprayFrequency: number): void {
        this.sprayFrequency = newSprayFrequency;
    }

    reset(): void {
        clearTimeout(this.timeoutId);
        this.drawingService.previewCtx.globalAlpha = 1;
    }

    updateSprayData(): void {
        this.sprayData = {
            type: 'fill',
            imageData: this.canvasData,
        };
    }

    restoreSpray(sprayData: Spray): void {
        this.drawingService.baseCtx.putImageData(sprayData.imageData, 0, 0);
    }
}
