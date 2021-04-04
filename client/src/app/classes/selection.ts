import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class SelectionTool extends Drawable {
    private selection: ImageData;
    private initialOrigin: Vec2;
    finalOrigin: Vec2;
    private destination: Vec2;
    private width: number;
    private height: number;
    private isEllipse: boolean;
    private isLasso: boolean;

    constructor(selection: ImageData, initialOrigin: Vec2, finalOrigin: Vec2, width: number, height: number, isEllipse: boolean, isLasso: boolean) {
        super();
        this.selection = selection;
        this.initialOrigin = initialOrigin;
        this.finalOrigin = finalOrigin;
        this.width = width;
        this.height = height;
        this.isEllipse = isEllipse;
        this.isLasso = isLasso;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        console.log('draw');
        this.clearUnderneathShape(ctx);

        if (this.isEllipse) this.printEllipse(ctx);
        else ctx.putImageData(this.selection, this.finalOrigin.x, this.finalOrigin.y);
    }

    private clearUnderneathShape(ctx: CanvasRenderingContext2D): void {
        console.log('undraw');

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        if (this.isEllipse) {
            ctx.ellipse(
                this.initialOrigin.x + this.width / 2,
                this.initialOrigin.y + this.height / 2,
                this.width / 2,
                this.height / 2,
                0,
                2 * Math.PI,
                0,
            );
            ctx.fill();
            ctx.closePath();
        } else if (this.isLasso && this.destination) {
            // TODO
        } else {
            console.log('opo');
            ctx.fillRect(this.initialOrigin.x, this.initialOrigin.y, this.width, this.height);
            ctx.closePath();
        }
    }

    private printEllipse(ctx: CanvasRenderingContext2D): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(this.selection, 0, 0);
        ctx.ellipse(this.finalOrigin.x + this.width / 2, this.finalOrigin.y + this.height / 2, this.width / 2, this.height / 2, 0, 2 * Math.PI, 0);
        ctx.save();
        ctx.clip();
        ctx.drawImage(tmp.canvas, this.finalOrigin.x, this.finalOrigin.y);
        ctx.restore();
    }
}
