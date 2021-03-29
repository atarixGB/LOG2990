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
        this.textInput = '';
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseMove) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // this.write(this.mouseDownCoord);
        }
        this.mouseMove = false;
    }

    handleKeyUp(event: KeyboardEvent): void {
        console.log('J écris');
        console.log(this.textInput);
        if (event.key === 'Backspace') {
            console.log('Problème backspace');
            this.textInput = this.textInput.substring(0, this.textInput.length - 1);
            console.log(this.textInput);
        } else {
            this.textInput += event.key;
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
