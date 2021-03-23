import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Polygon } from './polygon';
import { Vec2 } from './vec2';
import { TestBed } from '@angular/core/testing';
import { TypeStyle } from '@app/constants';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('Polygon', () => {
    let canvasTestHelper:CanvasTestHelper;
    beforeEach(()=>{
        canvasTestHelper=TestBed.inject(CanvasTestHelper);

    });

    it('should create an instance', () => {
        expect(new Polygon({} as Vec2, 2, 3, 'Fill', 2, 'black', 'red')).toBeTruthy();
    });

    it('case Stroke', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, 'stroke', 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'stroke');

        polygon.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case Fill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, TypeStyle.fill, 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'fill');

        polygon.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case StrokeFill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const polygon = new Polygon({} as Vec2, 2, 3, TypeStyle.strokeFill, 2, 'black', 'red');

        const fillSpy = spyOn<any>(ctx, 'fill');
        const strokeSpy = spyOn<any>(ctx, 'stroke');
        polygon.draw(ctx);

        expect(fillSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });
});
