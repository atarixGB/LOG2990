import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton, ZOOM_RADIUS } from '@app/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    pixelColor: string[] = ['#000000', '0'];
    primaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    secondaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    zoom: HTMLCanvasElement;
    zoomCtx: CanvasRenderingContext2D;
    isNearBorder: boolean = false;

    constructor(drawingService: DrawingService, public colorManagerService: ColorManagerService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        const pixelData = this.pixelOnZoom(event);

        if (event.button === MouseButton.Left) {
            this.colorManagerService.updatePixelColor(ColorOrder.PrimaryColor, pixelData);
            this.primaryColor.emit(this.pixelColor);
        }
        if (event.button === MouseButton.Right) {
            this.colorManagerService.updatePixelColor(ColorOrder.SecondaryColor, pixelData);
            this.secondaryColor.emit(this.pixelColor);
        }
    }

    pixelOnZoom(event: MouseEvent): Uint8ClampedArray {
        const x = this.getPositionFromMouse(event).x;
        const y = this.getPositionFromMouse(event).y;
        const red = 0;
        const green = 1;
        const blue = 2;
        const alpha = 3;

        const pixelData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;

        this.pixelColor[0] = pixelData[red].toString() + pixelData[green].toString() + pixelData[blue].toString();
        this.pixelColor[1] = pixelData[alpha].toString();
        const color = 'rgba(' + pixelData[red] + ',' + pixelData[green] + ',' + pixelData[blue] + ',' + pixelData[alpha] + ')';
        this.zoomCtx.beginPath();
        this.zoomCtx.fillStyle = color;
        this.zoomCtx.arc(this.zoom.width / 2, this.zoom.height / 2, ZOOM_RADIUS, 0, 2 * Math.PI);
        this.zoomCtx.fill();
        this.zoomCtx.stroke();
        this.zoomCtx.closePath();

        return pixelData;
    }

    onMouseMove(event: MouseEvent): void {
        this.pixelOnZoom(event);
    }
}