import { Vec2 } from './vec2';
enum TypeStyle {
    stroke = 'stroke',
    fill = 'fill',
    strokeFill = 'strokeFill',
}
export class Polygon {
    private centerCircle: Vec2;
    private radius: number;
    private polySides: number;
    private type: string;
    private lineWidth: number;
    private primaryColor: string;
    private secondaryColor: string;

    constructor(center: Vec2, radius: number, polySides: number, type: string, primaryColor: string, secondaryColor: string) {
        this.centerCircle = center;
        this.radius = radius;
        this.polySides = polySides;
        this.type = type;
        this.lineWidth = 1;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }

    drawPolygon(ctx: CanvasRenderingContext2D): void {
        const finalRadius = Math.abs(this.radius - this.lineWidth / 2 - this.lineWidth / this.polySides);

        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.secondaryColor;
        ctx.fillStyle = this.primaryColor;
        ctx.moveTo(this.centerCircle.x + finalRadius * Math.cos(-Math.PI / 2), this.centerCircle.y + finalRadius * Math.sin(-Math.PI / 2));
        for (let i = 1; i <= this.polySides + 1; i++) {
            ctx.lineTo(
                this.centerCircle.x + finalRadius * Math.cos((i * 2 * Math.PI) / this.polySides - Math.PI / 2),
                this.centerCircle.y + finalRadius * Math.sin((i * 2 * Math.PI) / this.polySides - Math.PI / 2),
            );
        }

        switch (this.type) {
            case TypeStyle.stroke:
                ctx.stroke();
                break;

            case TypeStyle.fill:
                ctx.fill();
                break;

            case TypeStyle.strokeFill:
                ctx.fill();
                ctx.stroke();
                break;
        }
        ctx.closePath();
    }
}
