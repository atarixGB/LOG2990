import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { LassoService } from './lasso.service';

// tslint:disable
fdescribe('LassoService', () => {
    let service: LassoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LassoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should find the smallest X coordinates', () => {
    //     const squareCoords: Vec2[] = [
    //         { x: 1, y: 1 },
    //         { x: 2, y: 2 },
    //         { x: 3, y: 3 },
    //         { x: 4, y: 4 },
    //     ];

    //     const expectedResult = 1;
    //     let result = service.findMinCoord(squareCoords, Axis.X);
    //     expect(result).toEqual(expectedResult);
    // });

    // it('should find the smallest Y coordinates', () => {
    //     const squareCoords: Vec2[] = [
    //         { x: 1, y: 1 },
    //         { x: 2, y: 2 },
    //         { x: 3, y: 3 },
    //         { x: 4, y: 4 },
    //     ];

    //     const expectedResult = 1;
    //     let result = service.findMinCoord(squareCoords, Axis.Y);
    //     expect(result).toEqual(expectedResult);
    // });

    // it('should find the largest X coordinate', () => {
    //     const squareCoords: Vec2[] = [
    //         { x: 1, y: 1 },
    //         { x: 2, y: 2 },
    //         { x: 3, y: 3 },
    //         { x: 4, y: 4 },
    //     ];

    //     const expectedResult = 4;
    //     let result = service.findMaxCoord(squareCoords, Axis.X);
    //     expect(result).toEqual(expectedResult);
    // });

    // it('should find the largest Y coordinate', () => {
    //     const squareCoords: Vec2[] = [
    //         { x: 1, y: 1 },
    //         { x: 2, y: 2 },
    //         { x: 3, y: 3 },
    //         { x: 4, y: 4 },
    //     ];

    //     const expectedResult = 4;
    //     let result = service.findMaxCoord(squareCoords, Axis.Y);
    //     expect(result).toEqual(expectedResult);
    // });

    // it('should not be inside the polygon', () => {
    //     const square: Vec2[] = [
    //         { x: 0, y: 0 },
    //         { x: 10, y: 0 },
    //         { x: 10, y: 10 },
    //         { x: 0, y: 10 },
    //     ];
    //     let n = square.length;
    //     let p: Vec2 = { x: 20, y: 20 };
    //     const result = service.pointInPolygon(square, n, p);
    //     expect(result).toBeFalse();
    // });

    fit('should be inside the polygon', () => {
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];
        let p: Vec2 = { x: 5, y: 5 };
        const result = service.pointInPolygon(p);
        expect(result).toBeTrue();
    });
});
