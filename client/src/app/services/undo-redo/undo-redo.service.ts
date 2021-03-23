import { Injectable } from '@angular/core';
import { Drawable } from '@app/classes/drawable';
import { LoadedImage } from '@app/classes/loaded-image';
import { Resize } from '@app/classes/resize';
import { Stack } from '@app/classes/stack';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService extends Tool {
    private redoStack: Stack<Drawable>;
    private toolsInUse: BehaviorSubject<boolean>;

    loadImage: BehaviorSubject<Drawable>;
    undoStack: Stack<Drawable>;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.undoStack = new Stack<Drawable>();
        this.redoStack = new Stack<Drawable>();
        this.toolsInUse = new BehaviorSubject<boolean>(false);
        this.loadImage = new BehaviorSubject<Drawable>(new LoadedImage());
    }

    setToolInUse(inUse: boolean): void {
        this.toolsInUse.next(inUse);
    }

    undo(): void {
        if (this.undoStack.isEmpty() || this.toolsInUse.getValue()) {
            return;
        }

        const lastElement = this.undoStack.pop();
        const array = this.undoStack.getAll();
        console.log(array);
        this.redoStack.add(lastElement);
        lastElement.undraw();
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.restore();
        const startImg = this.loadImage.getValue() as LoadedImage;
        if (startImg.src) {
            this.loadImage.getValue().draw(this.drawingService.baseCtx);
        }
        for (const element of array) {
            if (element instanceof Resize) {
                element.undraw();
                element.draw(this.drawingService.baseCtx);
            } else {
                element.draw(this.drawingService.baseCtx);
            }
        }
    }

    addToStack(drawable: Drawable): void {
        this.redoStack.clear();
        this.undoStack.add(drawable);
    }

    redo(): void {
        if (this.redoStack.isEmpty() || this.toolsInUse.getValue()) {
            return;
        }

        const lastElement = this.redoStack.pop();
        this.undoStack.add(lastElement);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        lastElement.draw(this.drawingService.baseCtx);
    }

    canUndo(): boolean {
        return !this.undoStack.isEmpty();
    }

    canRedo(): boolean {
        return !this.redoStack.isEmpty();
    }
    clearStacks(): void {
        this.undoStack.clear();
        this.redoStack.clear();
    }
}
