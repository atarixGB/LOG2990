import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { PencilService } from '@app/services/tools/pencil-service';
// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

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
        this.currentTool.mouseCoord = position;
    }
    private mousePosition: Vec2;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    constructor(private drawingService: DrawingService, pencilService: PencilService, ellipseService: EllipseService) {
        this.tools = [pencilService, ellipseService];
        this.currentTool = this.tools[0];
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.mouseCoord = this.mousePosition;
        this.currentTool.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.mouseCoord = this.mousePosition;
        this.currentTool.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.mouseCoord = this.mousePosition;
        this.currentTool.onMouseUp(event);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        if (this.currentTool === this.tools[1]) {
            this.currentTool.mouseCoord = this.mousePosition;
            this.currentTool.handleKeyUp(event);
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === '2') {
            this.currentTool = this.tools[1];
        }
        if (this.currentTool === this.tools[1]) {
            this.currentTool.mouseCoord = this.mousePosition;
            this.currentTool.handleKeyDown(event);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
