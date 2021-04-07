import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    readonly localName: string = 'local';
    localDrawing: DrawingData;
    isEmpty: boolean;

    constructor() {
        this.localDrawing = new DrawingData();
        console.log('local storage empty?', this.localStorageIsEmpty());
    }

    saveCanvasState(drawing: DrawingData): void {
        window.localStorage.setItem(this.localName, JSON.stringify(drawing));
    }

    loadImage(): void {
        const lastAutoSavedDrawing = window.localStorage.getItem(this.localName);
        if (lastAutoSavedDrawing) {
            this.localDrawing = JSON.parse(lastAutoSavedDrawing) as DrawingData;
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
