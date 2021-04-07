import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    readonly localName: string = 'local';
    localDrawing: DrawingData;

    save(drawing: DrawingData): void {
        localStorage.setItem(this.localName, JSON.stringify(drawing));
    }

    load(): void {
        const lastAutoSavedDrawing = localStorage.getItem(this.localName);
        if (lastAutoSavedDrawing) {
            this.localDrawing = JSON.parse(lastAutoSavedDrawing) as DrawingData;
        }
    }
}
