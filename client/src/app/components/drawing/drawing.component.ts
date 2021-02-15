import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MIN_HEIGHT, MIN_WIDTH } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, AfterViewChecked {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('workingArea', { static: false }) workingArea: ElementRef<HTMLDivElement>;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;

    constructor(private drawingService: DrawingService, private toolManagerService: ToolManagerService, private cdr: ChangeDetectorRef) {
        this.canvasSize = { x: MIN_WIDTH, y: MIN_HEIGHT };
    }

    ngAfterViewInit(): void {
        this.workingArea.nativeElement.style.width = '85vw';
        this.workingArea.nativeElement.style.height = '100vh';

        console.log(this.workingArea.nativeElement.offsetWidth);
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    ngAfterViewChecked() {
        this.canvasSize = { x: this.workingArea.nativeElement.offsetWidth / 2, y: this.workingArea.nativeElement.offsetHeight / 2 };
        if (this.canvasSize.x < MIN_WIDTH || this.canvasSize.y < MIN_HEIGHT) {
            this.canvasSize = { x: MIN_WIDTH, y: MIN_HEIGHT };
        }
        this.cdr.detectChanges();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseUp(event);
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
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
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.handleHotKeysShortcut(event);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
