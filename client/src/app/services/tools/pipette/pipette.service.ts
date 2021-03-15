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

    pixelColor : string[] = ['#000000', '0'];
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
        let pixelData = this.pixelOnZoom(event);

        if (event.button === MouseButton.Left) {
            this.colorManagerService.updatePixelColor(ColorOrder.PrimaryColor,pixelData);
            this.primaryColor.emit(this.pixelColor);
        }
        if (event.button === MouseButton.Right) {
            this.colorManagerService.updatePixelColor(ColorOrder.SecondaryColor,pixelData);
            this.secondaryColor.emit(this.pixelColor);
        }
    }


    pixelOnZoom(event: MouseEvent): Uint8ClampedArray{
        const x = this.getPositionFromMouse(event).x;
        const y = this.getPositionFromMouse(event).y;

        /*
        const hSource = this.zoom.height; 
        const wSource = this.zoom.width;
        */
        let pixelData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;

        this.pixelColor[0] = pixelData[0].toString() + pixelData[1].toString() + pixelData[2].toString();
        this.pixelColor[1] = pixelData[3].toString();
        const color = 'rgba(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ',' + pixelData[3] + ')';

        
        this.zoomCtx.beginPath();
        this.zoomCtx.fillStyle = color;
        //this.pixelColor[0] + this.pixelColor[1];
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
