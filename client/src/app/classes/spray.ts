import { Drawable } from './drawable';

export class Spray extends Drawable {
    private src: string;
    constructor(src: string) {
        super();
        this.src = src;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const image = new Image();
        image.src = this.src;
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
    }
}
