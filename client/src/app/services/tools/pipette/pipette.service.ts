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
    color: string[] = ['#000000', '0']; //RGB et Alpha (en 0 RGB et en 1 alpha)
    primaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    secondaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    zoom: HTMLCanvasElement;
    zoomCtx: CanvasRenderingContext2D;
    isNearBorder: boolean = false;

    constructor(drawingService: DrawingService, public colorManagerService: ColorManagerService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        // if (event.button == MouseButton.Left) {
        //     // Assigner couleur principale
        // } else if (event.button == MouseButton.Right) {
        //     // Assigner couleur secondaire
        // }
        
        this.mouseDown = true;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        const pixelData = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1).data;

        let red = pixelData[0].toString(16);
        let green = pixelData[1].toString(16);
        let blue = pixelData[2].toString(16);
        this.color[0] = '#' + red + green + blue;
        this.color[1] = pixelData[3].toString();
        
        if (event.button === MouseButton.Left) {
            this.colorManagerService.selectedColor[ColorOrder.PrimaryColor].inString = this.color[0]; //on assigne la chaine correspondante à RGB à la couleur primaire
            this.primaryColor.emit(this.color);
        }
        if (event.button === MouseButton.Right) {
            this.colorManagerService.selectedColor[ColorOrder.SecondaryColor].inString = this.color[0]; //on assigne la chaine correspondante à RGB à la couleur primaire
            this.secondaryColor.emit(this.color);
        }
    }

    drawOnZoom(event: MouseEvent): void {
        const x = this.getPositionFromMouse(event).x;
        const y = this.getPositionFromMouse(event).y;

        const hSource = this.zoom.height; //dans html jai mis canvas de dimension 150 X 150
        const wSource = this.zoom.width;

        this.zoomCtx.beginPath();
        this.zoomCtx.arc(this.zoom.width / 2, this.zoom.height / 2, ZOOM_RADIUS, 0, 2 * Math.PI);
        this.zoomCtx.clip();
        this.zoomCtx.drawImage(
            this.drawingService.canvas,
            x - wSource / 2,
            y - hSource / 2,
            wSource,
            hSource,
            0,
            0,
            this.zoom.width,
            this.zoom.height,
        );
        this.zoomCtx.closePath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawOnZoom(event);
    }

    // onMouseMove(event: MouseEvent): void {
    //     this.getColorPixel();
    // }

    // getColorPixel(): void {
    //     let pixelData = this.drawingService.baseCtx.getImageData(this.mouseCoord.x, this.mouseCoord.y, 1, 1).data;
    //     this.colorPixel.Dec.Red = pixelData[0];
    //     this.colorPixel.Dec.Green = pixelData[1];
    //     this.colorPixel.Dec.Blue = pixelData[2];
    //     this.colorPixel.Dec.Alpha = pixelData[3];
    // }
}
