import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class SelectionTool extends Drawable {
    image: ImageData;
    clearImageDataPolygon: ImageData;
    origin: Vec2;
    destination: Vec2;
    width: number;
    height: number;
    initialOrigin: Vec2;
    polygonCoords: Vec2[];
    isEllipse: boolean;
    isLasso: boolean;

    constructor(origin: Vec2, destination: Vec2, width: number, height: number) {
        super();
        this.origin = origin;
        this.destination = destination;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        console.log('draw');
        this.clearUnderneathShape(ctx);
        if (this.isEllipse) this.printEllipse(ctx);
        else if (this.isLasso) this.printPolygon(this.image, ctx);
        else ctx.putImageData(this.image, this.origin.x, this.origin.y);
    }

    private clearUnderneathShape(ctx: CanvasRenderingContext2D): void {
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
        } else if (this.isLasso) {
            this.printPolygon(this.clearImageDataPolygon, ctx);
        } else {
            ctx.fillRect(this.initialOrigin.x, this.initialOrigin.y, this.width, this.height);
            ctx.closePath();
        }
    }

    private printEllipse(ctx: CanvasRenderingContext2D): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(this.image, 0, 0);
        ctx.ellipse(this.origin.x + this.width / 2, this.origin.y + this.height / 2, this.width / 2, this.height / 2, 0, 2 * Math.PI, 0);
        ctx.save();
        ctx.clip();
        ctx.drawImage(tmp.canvas, this.origin.x, this.origin.y);
        ctx.restore();
    }

    private printPolygon(imageData: ImageData, ctx: CanvasRenderingContext2D): void {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const tmp = canvas.getContext('2d') as CanvasRenderingContext2D;
        tmp.putImageData(imageData, 0, 0);
        ctx.save();
        ctx.clip(this.calculatePath2d());

        ctx.drawImage(tmp.canvas, this.origin.x, this.origin.y);
        ctx.restore();
    }

    private calculatePath2d(): Path2D {
        const polygon = new Path2D();
        polygon.moveTo(this.polygonCoords[0].x, this.polygonCoords[0].y);
        for (let i = 1; i < this.polygonCoords.length; i++) {
            polygon.lineTo(this.polygonCoords[i].x, this.polygonCoords[i].y);
        }
        polygon.lineTo(this.polygonCoords[0].x, this.polygonCoords[0].y);
        return polygon;
    }
}
