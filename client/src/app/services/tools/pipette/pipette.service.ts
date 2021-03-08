import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/constants';
import { RGBA } from '@app/interfaces-enums/rgba';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    public colorPixel: RGBA;
    // public colorPreview : RGBA;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseClick(event: MouseEvent): void {
        if (event.button == MouseButton.Left) {
            // Assigner couleur principale
        } else if (event.button == MouseButton.Right) {
            // Assigner couleur secondaire
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.getColorPixel();
    }

    getColorPixel(): void {
        let pixelData = this.drawingService.baseCtx.getImageData(this.mouseCoord.x, this.mouseCoord.y, 1, 1).data;
        this.colorPixel.Dec.Red = pixelData[0];
        this.colorPixel.Dec.Green = pixelData[1];
        this.colorPixel.Dec.Blue = pixelData[2];
        this.colorPixel.Dec.Alpha = pixelData[3];
    }
}
