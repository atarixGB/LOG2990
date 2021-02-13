import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @Input()
    set mousePositionChanged(position: Vec2) {
        this.mousePosition = position;
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = position;
        }
    }
    private mousePosition: Vec2;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    private isResizing: boolean;

    // TODO : Refactoring is need to manage multiple tools and get the current tool selected by the user
    constructor(private drawingService: DrawingService, private toolManagerService: ToolManagerService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = this.mousePosition;
            this.toolManagerService.currentTool.onMouseMove(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined && !this.isResizing) {
            this.toolManagerService.currentTool.mouseCoord = this.mousePosition;
            this.toolManagerService.currentTool.onMouseDown(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = this.mousePosition;
            this.toolManagerService.currentTool.onMouseUp(event);
        }
        this.isResizing = false;
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined && !this.isResizing) {
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
            this.toolManagerService.currentTool.mouseCoord = this.mousePosition;
            this.toolManagerService.currentTool.handleKeyUp(event);
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.mousePosition = this.mousePosition;
            this.toolManagerService.handleHotKeysShortcut(event);
        }
    }

    private currentDrawing: ImageData;

    dragMoved(event: CdkDragMove, resizeX: boolean, resizeY: boolean): void {
        this.isResizing = true;

        this.previewCanvas.nativeElement.style.borderStyle = 'dotted';

        this.currentDrawing = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);

        if (resizeX) {
            console.log('resize x', event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left);
            this.previewCanvas.nativeElement.width = event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left;
        }

        if (resizeY) {
            console.log('resize y');
            this.previewCanvas.nativeElement.height = event.pointerPosition.y;
        }
    }

    dragEnded(event: CdkDragEnd): void {
        console.log('DragReleased', event.distance.x);

        console.log('canvasSize before', this.canvasSize.x);

        this.canvasSize.x = this.canvasSize.x + event.distance.x;
        this.canvasSize.y = this.canvasSize.y + event.distance.y;

        console.log('position x', this.canvasSize.x + event.distance.x);
        console.log('canvasSize after', this.canvasSize.x);

        setTimeout(() => {
            this.baseCtx.putImageData(this.currentDrawing, 0, 0);
        }, 0);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
