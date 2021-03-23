import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Line extends Drawable {
    private pathData: Vec2[];
    private color: string;
    private width: number;
    private firstPoint: Vec2;
    private joinRadius: number;
    private pointJoin: boolean;

    constructor(pathData: Vec2[], point: Vec2, color: string, width: number, joinRadius: number, pointJoin: boolean) {
        super();
        this.pathData = pathData;
        this.color = color;
        this.width = width;
        this.firstPoint = point;
        this.joinRadius = joinRadius;
        this.pointJoin = pointJoin;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.pathData.length > 1) {
            console.log(this.pathData);
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.moveTo(this.firstPoint.x, this.firstPoint.y);
            for (const point of this.pathData) {
                if (
                    this.pointJoin &&
                    point.x !== this.pathData[this.pathData.length - 1].x &&
                    point.y !== this.pathData[this.pathData.length - 1].y
                ) {
                    ctx.lineTo(point.x, point.y);
                    ctx.fillStyle = this.color;
                    ctx.moveTo(point.x + this.joinRadius, point.y);
                    ctx.arc(point.x, point.y, this.joinRadius, 0, Math.PI * 2, true); // point pour la jonction
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineJoin = 'miter';
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
            if (this.pointJoin) {
                ctx.fill();
            }
        }
    }
}
