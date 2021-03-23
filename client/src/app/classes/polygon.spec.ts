import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Polygon } from './polygon';
import { Vec2 } from './vec2';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('Polygon', () => {
    it('should create an instance', () => {
        expect(new Polygon({} as Vec2, 2, 3, 'Fill', 2, 'black', 'red')).toBeTruthy();
    });

    it('case Stroke', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, 'Stroke', 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'Stroke').and.callThrough();

        polygon.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case Fill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, 'Fill', 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'fill').and.callThrough();

        polygon.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case StrokeFill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, 'StrokeFill', 2, 'black', 'red');

        const fillSpy = spyOn<any>(ctx, 'Fill').and.callThrough();
        const strokeSpy = spyOn<any>(ctx, 'Stroke').and.callThrough();
        polygon.draw(ctx);

        expect(fillSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });
});
