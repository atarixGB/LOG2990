import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, ToolList } from '@app/constants';
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
        this.toolManagerService.getCurrentTool().mouseCoord = position;
    }
    private mousePosition: Vec2;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

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
        this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
        this.toolManagerService.getCurrentTool().onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
        this.toolManagerService.getCurrentTool().onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
        this.toolManagerService.getCurrentTool().onMouseUp(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseClick(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseEnter(event);
    }

    @HostListener('dblclick', ['$event'])
    onMousonDoubleClick(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseDoubleClick(event);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolManagerService.getCurrentTool().onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        if (this.toolManagerService.getCurrentToolEnum() === ToolList.Ellipse) {
            this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
            this.toolManagerService.getCurrentTool().handleKeyUp(event);
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === '2') {
            //this.currentTool = this.tools[1];
            this.toolManagerService.setCurrentTool(ToolList.Ellipse);
        }
        if (this.toolManagerService.getCurrentToolEnum() === ToolList.Ellipse) {
            // This is for the SHIFT
            this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
            this.toolManagerService.getCurrentTool().handleKeyDown(event);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
