import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { LassoService } from './lasso.service';

interface Segment {
    initial: Vec2;
    final: Vec2;
}

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

    it('should return the smallest coordinate in both X and Y', () => {
        const coords: Vec2[] = [
            { x: 0, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 1 },
            { x: 3, y: 3 },
            { x: 1, y: 0 },
        ];

        const expectedResult: Vec2 = { x: 0, y: 0 };
        let result = service.findMinCoord(coords);
        expect(result).toEqual(expectedResult);
    });

    it('should return the largest coordinate in both X and Y', () => {
        const coords: Vec2[] = [
            { x: 0, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 1 },
            { x: 3, y: 3 },
            { x: 1, y: 0 },
        ];

        const expectedResult: Vec2 = { x: 3, y: 3 };
        let result = service.findMaxCoord(coords);
        expect(result).toEqual(expectedResult);
    });

    it('should return true if point is inside the square', () => {
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];
        let pointToTest: Vec2 = { x: 5, y: 5 };
        const result = service.pointInPolygon(pointToTest);
        expect(result).toBeTrue();
    });

    it('should return true if point is inside the concave polygon (n = 5)', () => {
        service.polygonCoords = [
            { x: 0, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 1 },
            { x: 3, y: 3 },
            { x: 1, y: 0 },
        ];
        let pointToTest: Vec2 = { x: 0.5, y: 1 };
        const result = service.pointInPolygon(pointToTest);
        expect(result).toBeTrue();
    });

    it('should return false if point is NOT inside the square', () => {
        service.polygonCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];
        let pointToTest: Vec2 = { x: 20, y: 5 };
        const result = service.pointInPolygon(pointToTest);
        expect(result).toBeFalse();
    });

    it('should return false if point is NOT inside the concave polygone (n = 5)', () => {
        service.polygonCoords = [
            { x: 0, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 1 },
            { x: 3, y: 3 },
            { x: 1, y: 0 },
        ];
        let pointToTest: Vec2 = { x: 1.25, y: 1.5 };
        const result = service.pointInPolygon(pointToTest);
        expect(result).toBeFalse();
    });

    it('should return true if two segments intersect', () => {
        service['areIntesected'] = false;
        const segment1: Segment = {
            initial: { x: 10, y: 0 },
            final: { x: 10, y: 10 },
        };
        const segment2: Segment = {
            initial: { x: 5, y: 5 },
            final: { x: 100, y: 5 },
        };

        const res = service['segmentsDoIntersect'](segment1, segment2);
        expect(res).toBeTrue();
    });

    it('should return false if two segments DO NOT intersect', () => {
        service['areIntesected'] = false;
        const segment1: Segment = {
            initial: { x: 0, y: 0 },
            final: { x: 2, y: 2 },
        };
        const segment2: Segment = {
            initial: { x: 3, y: 0 },
            final: { x: 2, y: 3 },
        };

        const res = service['segmentsDoIntersect'](segment1, segment2);
        expect(res).toBeFalse();
    });

    it('should return false if two segments are parallel', () => {
        service['areIntesected'] = false;
        const segment1: Segment = {
            initial: { x: 0, y: 0 },
            final: { x: 0, y: 10 },
        };
        const segment2: Segment = {
            initial: { x: 5, y: 5 },
            final: { x: 20, y: 5 },
        };

        const res = service['segmentsDoIntersect'](segment1, segment2);
        expect(res).toBeFalse();
    });
});
