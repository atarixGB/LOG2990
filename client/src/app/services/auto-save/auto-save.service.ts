import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    readonly localName: string = 'local';
    localDrawing: DrawingData;
    isEmpty: boolean;

    constructor(private drawingService: DrawingService) {
        this.localDrawing = new DrawingData();
    }

    saveCanvasState(drawing: DrawingData): void {
        window.localStorage.setItem(this.localName, JSON.stringify(drawing));
    }

    loadImage(): void {
        const lastAutoSavedDrawing = window.localStorage.getItem(this.localName);
        const img: HTMLImageElement = new Image();

        if (lastAutoSavedDrawing) {
            this.localDrawing = JSON.parse(lastAutoSavedDrawing) as DrawingData;
            img.src = this.localDrawing.body;
            img.onload = () => {
                this.drawingService.baseCtx.drawImage(img, 0, 0, this.localDrawing.width, this.localDrawing.height);
            };
        }
    }

    clearLocalStorage(): void {
        window.localStorage.clear();
    }

    localStorageIsEmpty(): boolean {
        const size = window.localStorage.length;
        return size === 0;
    }
}
