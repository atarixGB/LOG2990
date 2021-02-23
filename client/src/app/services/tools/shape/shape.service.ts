import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from 'src/app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { TypeStyle } from 'src/app/interfaces-enums/type-style';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

export abstract class ShapeService extends Tool {
    protected pathData: Vec2[];
    protected fillValue: boolean;
    lineWidth: number;
    protected strokeValue: boolean;
    selectType: TypeStyle;
    protected isShiftShape: boolean;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.fillValue = false;
        this.strokeValue = false;
        this.selectType = TypeStyle.stroke;
        this.changeType();
        this.clearPath();
        this.isShiftShape = false;
    }

    changeType(): void {
        switch (this.selectType) {
            case TypeStyle.stroke:
                this.fillValue = false;
                this.strokeValue = true;
                console.log('dans stroke');
                break;
            case TypeStyle.fill:
                this.fillValue = true;
                this.strokeValue = false;
                console.log('dans fill');
                break;
            case TypeStyle.strokeFill:
                this.fillValue = true;
                this.strokeValue = true;
                console.log('dans stroke-fill');
                break;
        }
    }

    protected clearPath(): void {
        this.pathData = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    abstract onMouseUp(event: MouseEvent): void;

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.previewCtx, this.pathData);
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift' && this.mouseDown) {
            this.isShiftShape = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.previewCtx, this.pathData);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftShape = false;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawShape(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    abstract drawShape(ctx: CanvasRenderingContext2D, path: Vec2[]): void;

    protected drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[], isBorder: boolean): void {
        ctx.beginPath();
        const firstPoint = path[0];
        const finalPoint = path[this.pathData.length - 1];
        const width = finalPoint.y - firstPoint.y;
        const length = finalPoint.x - firstPoint.x;
        ctx.lineWidth = this.lineWidth;

        ctx.rect(firstPoint.x, firstPoint.y, length, width);
        if (isBorder) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            ctx.rect(firstPoint.x, firstPoint.y, length, width);
            ctx.stroke();
            console.log('ici');
        } else {
            this.updateBorderType(ctx);
        }
    }

    protected updateBorderType(ctx: CanvasRenderingContext2D, isBorder?: boolean): void {
        const filling = this.colorManager.selectedColor[ColorOrder.primaryColor].inString;
        const contouring = this.colorManager.selectedColor[ColorOrder.secondaryColor].inString;

        if (this.strokeValue) {
            ctx.strokeStyle = contouring;
            ctx.fillStyle = 'rgba(255, 0, 0, 0)';
            ctx.fill();
            ctx.stroke();
        }
        if (this.fillValue) {
            ctx.fillStyle = filling;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
            ctx.fill();
            ctx.stroke();
        }
        if (this.fillValue && this.strokeValue) {
            ctx.fillStyle = filling;
            ctx.strokeStyle = contouring;
            ctx.fill();
            ctx.stroke();
        }
    }

    protected drawSquare(ctx: CanvasRenderingContext2D, path: Vec2[], isBorder: boolean): void {
        const width = path[path.length - 1].x - path[0].x;
        const height = path[path.length - 1].y - path[0].y;
        const shortestSide = Math.abs(width) < Math.abs(height) ? Math.abs(width) : Math.abs(height);

        let upperRight: [number, number];
        upperRight = [path[0].x, path[0].y];

        if (width <= 0 && height >= 0) {
            upperRight = [path[0].x - shortestSide, path[0].y];
        } else if (height <= 0 && width >= 0) {
            upperRight = [path[0].x, path[0].y - shortestSide];
        } else if (height <= 0 && width <= 0) {
            upperRight = [path[0].x - shortestSide, path[0].y - shortestSide];
        } else {
            upperRight = [path[0].x, path[0].y];
        }

        ctx.beginPath();
        ctx.rect(upperRight[0], upperRight[1], shortestSide, shortestSide);
        if (isBorder) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            ctx.rect(upperRight[0], upperRight[1], shortestSide, shortestSide);
            ctx.stroke();
        } else {
            this.updateBorderType(ctx);
        }
    }
}
