import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { MIN_SIZE, WORKING_AREA_LENGHT, WORKING_AREA_WIDTH } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnDestroy {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('workingArea', { static: false }) workingArea: ElementRef<HTMLDivElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;
    private currentDrawing: ImageData;
    dragPosition: Vec2 = { x: 0, y: 0 };
    private subscription: Subscription;

    constructor(
        private drawingService: DrawingService,
        private toolManagerService: ToolManagerService,
        private cdr: ChangeDetectorRef,
        private newDrawingService: NewDrawingService,
        public dialog: MatDialog,
    ) {
        this.canvasSize = { x: MIN_SIZE, y: MIN_SIZE };

        this.subscription = this.newDrawingService.getCleanStatus().subscribe((isCleanRequest) => {
            if (isCleanRequest) {
                this.drawingService.baseCtx.beginPath();
                this.drawingService.baseCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
                this.drawingService.previewCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.workingArea.nativeElement.style.width = WORKING_AREA_WIDTH;
        this.workingArea.nativeElement.style.height = WORKING_AREA_LENGHT;

        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.canvasSize = { x: this.workingArea.nativeElement.offsetWidth / 2, y: this.workingArea.nativeElement.offsetHeight / 2 };

        if (this.canvasSize.x < MIN_SIZE || this.canvasSize.y < MIN_SIZE) {
            this.canvasSize = { x: MIN_SIZE, y: MIN_SIZE };
        }
        this.cdr.detectChanges();
    }

    onMouseMove(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;
        if (this.toolManagerService.currentTool != undefined && !ELEMENT.className.includes('box')) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;
        if (this.toolManagerService.currentTool != undefined && !ELEMENT.className.includes('box')) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;
        if (this.toolManagerService.currentTool != undefined && !ELEMENT.className.includes('box')) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseUp(event);
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;

        if (this.toolManagerService.currentTool != undefined && !ELEMENT.className.includes('box')) {
            this.toolManagerService.currentTool.onMouseClick(event);
        }
    }

    @HostListener('dblclick', ['$event'])
    onMousonDoubleClick(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.onMouseDoubleClick(event);
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.handleKeyUp(event);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.handleHotKeysShortcut(event);
        }
        if (event.ctrlKey && event.code === 'KeyO') {
            this.dialog.open(NewDrawModalComponent, {});
        }
    }

    dragMoved(event: CdkDragMove, resizeX: boolean, resizeY: boolean): void {
        this.previewCanvas.nativeElement.style.borderStyle = 'dotted';

        this.currentDrawing = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);

        if (resizeX && event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left > MIN_SIZE) {
            this.previewCanvas.nativeElement.width = event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left;
        }

        if (resizeY && event.pointerPosition.y > MIN_SIZE) {
            this.previewCanvas.nativeElement.height = event.pointerPosition.y;
        }
    }

    dragEnded(event: CdkDragEnd): void {
        const NEW_WIDTH: number = this.canvasSize.x + event.distance.x;
        const NEW_HEIGHT: number = this.canvasSize.y + event.distance.y;

        this.previewCanvas.nativeElement.style.borderStyle = 'solid';

        if (NEW_WIDTH >= MIN_SIZE) {
            this.canvasSize.x = NEW_WIDTH;
        } else {
            this.canvasSize.x = MIN_SIZE;
        }

        if (NEW_HEIGHT >= MIN_SIZE) {
            this.canvasSize.y = NEW_HEIGHT;
        } else {
            this.canvasSize.y = MIN_SIZE;
        }
        setTimeout(() => {
            this.baseCtx.putImageData(this.currentDrawing, 0, 0);
        }, 0);
    }

    changePosition(): void {
        this.dragPosition = { x: this.dragPosition.x, y: this.dragPosition.y };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
