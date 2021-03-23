export abstract class Drawable {
    // tslint:disable: no-empty // car méthode virtuelle
    draw(ctx: CanvasRenderingContext2D): void {}
    undraw(): void {}
}
