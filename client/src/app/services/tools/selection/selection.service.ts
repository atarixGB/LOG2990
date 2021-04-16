import { Injectable } from '@angular/core';
import { Utils } from '@app/classes/math-utils';
import { SelectionTool } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeSelectionService } from '@app/services/selection/resize-selection.service';
import { RectangleService } from '@app/services/tools//rectangle/rectangle.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';
import { LassoService } from '@app/services/tools/selection/lasso/lasso.service';
import { SelectionUtilsService } from '@app/services/utils/selection-utils.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    selection: ImageData;
    origin: Vec2;
    destination: Vec2;
    isEllipse: boolean;
    isLasso: boolean;
    activeSelection: boolean;
    newSelection: boolean;
    initialSelection: boolean;
    imageMoved: boolean;
    clearUnderneath: boolean;
    selectionTerminated: boolean;
    selectionDeleted: boolean;
    width: number;
    height: number;
    isResizing: boolean;
    selectionObject: SelectionTool;

    constructor(
        public drawingService: DrawingService,
        private rectangleService: RectangleService,
        private ellipseService: EllipseService,
        private lassoService: LassoService,
        private ellipseSelectionService: EllipseSelectionService,
        // private undoRedoService: UndoRedoService,
        private resizeSelectionService: ResizeSelectionService,
        private selectionUtilsService: SelectionUtilsService,
    ) {
        super(drawingService);
        this.isEllipse = false;
        this.isLasso = false;
        this.activeSelection = false;
        this.newSelection = true;
        this.initialSelection = true;
        this.imageMoved = false;
        this.clearUnderneath = true;
        this.selectionTerminated = false;
        this.selectionDeleted = false;
        this.isResizing = false;
    }

    onMouseClick(event: MouseEvent): void {
        if (this.isLasso && !this.lassoService.selectionOver && this.newSelection && !this.isResizing) {
            this.selectionTerminated = false;
            this.lassoService.onMouseClick(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        console.log('mousedown', event.offsetX, event.offsetY);
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            if (this.activeSelection) {
                this.resizeSelectionService.controlPointsCoord = this.selectionUtilsService.controlPointsCoord;
                this.isResizing = this.resizeSelectionService.checkIfMouseIsOnControlPoint(this.getPositionFromMouse(event));
                this.clearUnderneath = true;
            }
        }

        if (this.mouseDown && !this.isLasso) {
            this.initialSelection = true;
            this.clearUnderneath = true;
            this.selectionTerminated = false;

            this.selectionUtilsService.initializeToolParameters();
            this.printMovedSelection(this.drawingService.baseCtx);
            this.selectionDeleted = false;

            if (this.isEllipse) this.ellipseService.onMouseDown(event);
            else this.rectangleService.onMouseDown(event);
        }

        if (this.isLasso && this.newSelection && this.activeSelection) {
            this.lassoService.selectionOver = false;
            this.terminateSelection();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isLasso && !this.lassoService.selectionOver) this.lassoService.onMouseMove(event);

        if (this.mouseDown) {
            if (this.isResizing) {
                this.selectionUtilsService.resizeSelection(this.getPositionFromMouse(event), this.selectionObject);
                return;
            }

            if (this.isEllipse) this.ellipseService.onMouseMove(event);
            else this.rectangleService.onMouseMove(event);
        }

        if (this.activeSelection && !this.selectionTerminated) {
            if (this.selectionUtilsService.mouseInSelectionArea(this.origin, this.destination, this.getPositionFromMouse(event))) {
                this.newSelection = false;
            } else {
                this.newSelection = true;
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        console.log('mouseup', event.offsetX, event.offsetY);
        if (this.isLasso && !this.lassoService.selectionOver) this.lassoService.onMouseUp(event);

        if (this.lassoService.selectionOver) {
            this.activeSelection = true;
            this.initialSelection = true;
            this.clearUnderneath = true;
            this.calculateDimension();
            this.getSelectionData(this.drawingService.baseCtx);
            this.selectionUtilsService.createBoundaryBox(this.selectionObject);
        }

        if (this.mouseDown && !this.isLasso) {
            this.activeSelection = true;
            this.mouseDown = false;

            if (this.isResizing) {
                this.isResizing = false;
                this.selectionUtilsService.cleanedUnderneath = false;
                return;
            }

            this.calculateDimension();
            this.getSelectionData(this.drawingService.baseCtx);
            this.selectionUtilsService.createControlPoints(this.selectionObject);
            this.selectionUtilsService.resetParametersTools();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown && !this.isLasso) this.onMouseUp(event);
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.terminateSelection();
            return;
        }

        if (event.key === 'Shift') {
            this.resizeSelectionService.handleKeyDown(event);
        }

        if (this.isEllipse) this.ellipseService.handleKeyDown(event);
        else if (this.isLasso) this.lassoService.handleKeyDown(event);
        else this.rectangleService.handleKeyDown(event);
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.resizeSelectionService.handleKeyUp(event);
        }

        if (this.isEllipse) this.ellipseService.handleKeyUp(event);
        else if (this.isLasso) this.lassoService.handleKeyUp(event);
        else this.rectangleService.handleKeyUp(event);
    }

    selectAll(): void {
        this.activeSelection = true;
        this.newSelection = true;
        this.initialSelection = true;
        this.clearUnderneath = true;
        this.selectionTerminated = false;
        this.origin = { x: 0, y: 0 };
        this.destination = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
        this.width = this.destination.x;
        this.height = this.destination.y;

        this.printMovedSelection(this.drawingService.baseCtx);
        this.selection = this.drawingService.baseCtx.getImageData(this.origin.x, this.origin.y, this.destination.x, this.destination.y);
        this.selectionUtilsService.createBoundaryBox(this.selectionObject);
    }

    terminateSelection(): void {
        if (this.activeSelection) {
            if (!this.selectionDeleted) {
                this.imageMoved = true;

                this.printMovedSelection(this.drawingService.baseCtx);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectionUtilsService.resetParametersTools();
            this.lassoService.selectionOver = false;
            this.lassoService.resetAttributes();

            this.activeSelection = false;
            this.newSelection = true;
            this.imageMoved = false;
            this.selectionTerminated = true;
            this.mouseDown = false;
        }
    }

    printMovedSelection(ctx: CanvasRenderingContext2D): void {
        if (this.imageMoved) {
            this.imageMoved = false;
            // changer ceci
            this.selectionObject.origin = this.origin;
            if (this.isEllipse) this.ellipseSelectionService.printEllipse(this.selectionObject);
            else if (this.isLasso) this.lassoService.printPolygon(this.selection, this.selectionObject);
            else this.drawingService.baseCtx.putImageData(this.selection, this.origin.x, this.origin.y);
        }
    }

    private calculateDimension(): void {
        if (this.isEllipse) {
            this.origin = this.ellipseService.pathData[0];
            this.destination = this.ellipseService.pathData[this.ellipseService.pathData.length - 1];
        } else if (this.isLasso) {
            this.origin = Utils.findMinCoord(this.lassoService.polygonCoords);
            this.destination = Utils.findMaxCoord(this.lassoService.polygonCoords);
        } else {
            this.origin = this.rectangleService.pathData[0];
            this.destination = this.rectangleService.pathData[this.rectangleService.pathData.length - 1];
        }
        this.width = this.destination.x - this.origin.x;
        this.height = this.destination.y - this.origin.y;

        //fonction initialisation param
        this.selectionObject = new SelectionTool(this.origin, this.destination, this.width, this.height);
        this.selectionObject.isEllipse = this.isEllipse;
        this.selectionObject.isLasso = this.isLasso;

        this.selectionObject = this.selectionUtilsService.reajustOriginAndDestination(this.selectionObject);

        // faire une fonction qui s'en occupe ou changer partout pour utiliser selectionObjet
        this.origin = this.selectionObject.origin;
        this.destination = this.selectionObject.destination;
        this.width = this.selectionObject.width;
        this.height = this.selectionObject.height;
    }

    private getSelectionData(ctx: CanvasRenderingContext2D): void {
        this.selection = ctx.getImageData(this.origin.x, this.origin.y, this.width, this.height);
        // initialiser autrement
        this.selectionObject.image = this.selection;
        this.selectionObject.clearImageDataPolygon = ctx.getImageData(this.origin.x, this.origin.y, this.width, this.height);
        if (this.isEllipse) {
            this.selectionObject.image = this.ellipseSelectionService.checkPixelInEllipse(this.selectionObject);
        } else if (this.isLasso) {
            this.selectionObject.image = this.lassoService.checkPixelInPolygon(this.selectionObject);
        }
    }

    // undo-redo
    // this.selectionObject.origin = this.origin;
    // this.undoRedoService.addToStack(this.selectionObject);
    // this.undoRedoService.setToolInUse(false);
}
