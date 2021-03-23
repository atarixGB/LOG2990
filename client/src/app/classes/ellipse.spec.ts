import { canvasTestHelper } from './canvas-test-helper';
import { Ellipse } from './ellipse';
import { Vec2 } from './vec2';
export enum TypeStyle {
    Stroke = 'stroke',
    Fill = 'fill',
    StrokeFill = 'strokeFill',
}
// tslint:disable: no-any
describe('Ellipse ', () => {
    it('should create', () => {
        expect(new Ellipse({} as Vec2, 2, 2, TypeStyle.Fill, 2, 'black', 'red')).toBeTruthy();
    });

    it('case stroke', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const ellipse = new Ellipse({} as Vec2, 2, 2, TypeStyle.Stroke, 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'Stroke').and.callThrough();

        ellipse.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case Fill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const ellipse = new Ellipse({} as Vec2, 2, 2, TypeStyle.Fill, 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'fill').and.callThrough();

        ellipse.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case StrokeFill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const ellipse = new Ellipse({} as Vec2, 2, 2, TypeStyle.StrokeFill, 2, 'black', 'red');

        const fillSpy = spyOn<any>(ctx, 'Fill').and.callThrough();
        const strokeSpy = spyOn<any>(ctx, 'Stroke').and.callThrough();
        ellipse.draw(ctx);

        expect(fillSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });
});
