import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, MIN_HEIGHT, MIN_WIDTH, ToolList } from '@app/constants';
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

    private isCorner: boolean;

    private resizer: (x?: number, y?: number) => void;

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

        if (this.isCorner) {
            this.baseCanvas.nativeElement.style.borderStyle = 'dotted';
            this.previewCanvas.nativeElement.style.borderStyle = 'dotted';
            let currentDrawing: ImageData = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);
            if (this.resizer === this.bottomCenter) {
                this.resizer(event.clientY);
            } else {
                console.log('else');
                this.resizer(event.clientX - this.baseCanvas.nativeElement.getBoundingClientRect().left, event.clientY);
            }
            setTimeout(() => {
                this.baseCtx.putImageData(currentDrawing, 0, 0);
            }, 0);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.isCorner) {
            this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
            this.toolManagerService.getCurrentTool().onMouseDown(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().mouseCoord = this.mousePosition;
        this.toolManagerService.getCurrentTool().onMouseUp(event);

        if (this.isCorner) {
            this.isCorner = false;
            this.baseCanvas.nativeElement.style.borderStyle = 'solid';
            this.previewCanvas.nativeElement.style.borderStyle = 'solid';
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseClick(event);
    }

    @HostListener('dblclick', ['$event'])
    onMousonDoubleClick(event: MouseEvent): void {
        this.toolManagerService.getCurrentTool().onMouseDoubleClick(event);
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
        this.toolManagerService.mousePosition = this.mousePosition;
        this.toolManagerService.handleHotKeysShortcut(event);
    }

    onCornerClick(event: MouseEvent, resizer: (x?: number, y?: number) => void): void {
        console.log('onCornerCLick');
        this.isCorner = true;
        this.resizer = resizer;

        event.preventDefault();
        event.stopPropagation();
    }

    rightCenter(mousePositionX: number): void {
        console.log('right center');
        if (mousePositionX >= MIN_WIDTH) {
            this.canvasSize.x = mousePositionX;
        }
    }

    bottomCenter(mousePositionY: number): void {
        console.log('bottom center');
        if (mousePositionY >= MIN_HEIGHT) {
            this.canvasSize.y = mousePositionY;
        }
    }

    bottomRight(mousePositionX: number, mousePositionY: number): void {
        if (mousePositionY >= MIN_HEIGHT && mousePositionX >= MIN_WIDTH) {
            this.canvasSize.x = mousePositionX;
            this.canvasSize.y = mousePositionY;
        }
    }

    // dragStarted(event: CdkDragStart, resizeX: boolean, resizeY: boolean): void {
    //     console.log('DragStarted');
    //     this.resizeX = resizeX;
    //     this.resizeY = resizeY;
    // }

    dragMoved(event: CdkDragMove, resizeX: boolean, resizeY: boolean): void {
        console.log('DragMoved');
        //this.baseCanvas.nativeElement.style.borderStyle = 'dotted';
        this.previewCanvas.nativeElement.style.borderStyle = 'dotted';
        // let currentDrawing: ImageData = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);

        if (resizeX) {
            console.log('resize x', event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left);
            this.previewCanvas.nativeElement.width = event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left;
        }

        if (resizeY) {
            console.log('resize y');
            this.previewCanvas.nativeElement.height = event.pointerPosition.y;
        }
        // setTimeout(() => {
        //     this.baseCtx.putImageData(currentDrawing, 0, 0);
        // }, 0);
    }

    dragEnded(event: CdkDragEnd): void {
        console.log('DragReleased', event.distance.x);
        console.log('position x', this.canvasSize.x + event.distance.x);
        // if (this.resizeX) {
        this.canvasSize.x = this.canvasSize.x + event.distance.x;
        this.canvasSize.y = this.canvasSize.y + event.distance.y;
        // }

        // if (this.resizeY) {
        //     this.canvasSize.y = this.mousePosition.y;
        // }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
