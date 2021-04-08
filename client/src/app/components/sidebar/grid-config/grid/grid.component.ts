import { Component } from '@angular/core';
import {
    DEFAULT_GRID_OPACITY,
    DEFAULT_GRID_SIZE,
    MAX_GRID_OPACITY,
    MAX_GRID_SQUARE_SIZE,
    MIN_GRID_OPACITY,
    MIN_GRID_SQUARE_SIZE,
    TWO_DECIMAL_MULTIPLIER,
} from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    isEnabled: boolean = false;
    minSquareSize: number = MIN_GRID_SQUARE_SIZE;
    maxSquareSize: number = MAX_GRID_SQUARE_SIZE;
    minOpacity: number = MIN_GRID_OPACITY;
    maxOpacity: number = MAX_GRID_OPACITY;
    squareSize: number = DEFAULT_GRID_SIZE;
    currentOpacity: number = DEFAULT_GRID_OPACITY;

    constructor(public drawingService: DrawingService, public selectionService: SelectionService) {
        this.drawingService.gridSpaces = this.squareSize;
        this.selectionService.setGridSpaces(this.squareSize);
        this.drawingService.gridOpacity = this.currentOpacity;
    }

    switchGridView(isEnabled: boolean): void {
        this.isEnabled = isEnabled;
        this.drawingService.isGridEnabled = isEnabled;
        if (isEnabled) this.drawingService.setGrid();
        else this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }

    changeGridSize(newSize: number): void {
        this.drawingService.gridSpaces = newSize;
        this.squareSize = newSize;
        this.selectionService.setGridSpaces(this.squareSize);
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }

    changeOpacity(newOpacity: number): void {
        newOpacity = Number(newOpacity);
        newOpacity = Math.round((newOpacity + Number.EPSILON) * TWO_DECIMAL_MULTIPLIER) / TWO_DECIMAL_MULTIPLIER;
        this.drawingService.gridOpacity = newOpacity;
        this.currentOpacity = newOpacity;
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }
}
