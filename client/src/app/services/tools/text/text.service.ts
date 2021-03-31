import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private textInput: string;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.textInput = '|';

        /*
        this.filtersBindings = new Map<FiltersList, string>();
        this.filtersBindings
            .set(FiltersList.None, 'none')
            .set(FiltersList.Blur, 'blur')
            .set(FiltersList.Brightness, 'brightness')
            .set(FiltersList.Contrast, 'contrast')
            .set(FiltersList.Invert, 'invert')
            .set(FiltersList.Grayscale, 'grayscale');
        */
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseMove) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // this.write(this.mouseDownCoord);
        }
        this.mouseMove = false;
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Backspace') {
            this.textInput = [this.textInput.substring(0, this.textInput.length - 1), this.textInput.substring(this.textInput.length - 1)].join('');
        } else {
            this.textInput = [this.textInput.substring(0, this.textInput.length - 1), event.key, this.textInput.substring(this.textInput.length - 1)].join('');
        }
        this.drawingService.previewCtx.fillStyle = 'black';
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.fillText(this.textInput, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }

    write(mousePosition: Vec2): void {
        //this.drawingService.previewCtx.clearRect(this.mouseDownCoord.x,this.mouseDownCoord.y,this.drawingService.previewCanvas.width, this.drawingService.previewCanvas.height);
        this.drawingService.baseCtx.fillStyle = 'black';
        this.drawingService.baseCtx.fillText(this.textInput, mousePosition.x, mousePosition.y);
        this.textInput = '';
    }
}
