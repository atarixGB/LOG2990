import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Selection extends Drawable {
    private selection: ImageData;
    private origin: Vec2;
    private destination: Vec2;
    private width: number;
    private height: number;
    private isEllipse: boolean;
    private isLasso: boolean;

    constructor(selection: ImageData, origin: Vec2, destination: Vec2, width: number, height: number, isEllipse: boolean, isLasso: boolean) {
        super();
        this.selection = selection;
        this.origin = origin;
        this.destination = destination;
        this.width = width;
        this.height = height;
        this.isEllipse = isEllipse;
        this.isLasso = isLasso;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.isEllipse) this.printEllipse(ctx);
        else ctx.putImageData(this.selection, this.origin.x, this.origin.y);
    }

    private printEllipse(ctx: CanvasRenderingContext2D): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(this.selection, 0, 0);
        ctx.ellipse(this.origin.x + this.width / 2, this.origin.y + this.height / 2, this.width / 2, this.height / 2, 0, 2 * Math.PI, 0);
        ctx.save();
        ctx.clip();
        ctx.drawImage(tmp.canvas, this.origin.x, this.origin.y);
        ctx.restore();
    }
}
