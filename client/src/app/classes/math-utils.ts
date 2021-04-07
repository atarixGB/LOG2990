import { Vec2 } from './vec2';

export const INFINITY = 10000;
export const COLINEAR = 0;
const ANGLE_PI_IN_DEGREES = 180;
export interface Segment {
    initial: Vec2;
    final: Vec2;
}

export class Utils {
    static findOrientation(p: Vec2, q: Vec2, r: Vec2): number {
        const value: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (value === 0) return 0;
        return value > 0 ? 1 : 2;
    }

    static pointOnSegment(p: Vec2, q: Vec2, r: Vec2): boolean {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;
        return false;
    }

    static segmentsDoIntersect(segment1: Segment, segment2: Segment): boolean {
        const p1: Vec2 = segment1.initial;
        const q1: Vec2 = segment1.final;
        const p2: Vec2 = segment2.initial;
        const q2: Vec2 = segment2.final;

        const o1 = this.findOrientation(p1, q1, p2);
        const o2 = this.findOrientation(p1, q1, q2);
        const o3 = this.findOrientation(p2, q2, p1);
        const o4 = this.findOrientation(p2, q2, q1);

        if (o1 !== o2 && o3 !== o4) return true;
        if (o1 === COLINEAR && this.pointOnSegment(p1, p2, q1)) return true;
        if (o2 === COLINEAR && this.pointOnSegment(p1, q2, q1)) return true;
        if (o3 === COLINEAR && this.pointOnSegment(p2, p1, q2)) return true;
        if (o4 === COLINEAR && this.pointOnSegment(p2, q1, q2)) return true;
        return false;
    }

    static getVector(segment: Segment): Vec2 {
        const dx = segment.final.x - segment.initial.x;
        const dy = segment.final.y - segment.initial.y;
        const vector: Vec2 = { x: dx, y: dy };
        return vector;
    }

    static getHypothenuse(vector: Vec2): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    static dotProduct(u: Vec2, v: Vec2): number {
        return u.x * v.x + u.y * v.y;
    }

    static radToDegree(angleInRad: number): number {
        return (angleInRad * ANGLE_PI_IN_DEGREES) / Math.PI;
    }

    static findAngleBetweenTwoSegments(segment1: Segment, segment2: Segment): number {
        const u: Vec2 = this.getVector(segment1);
        const v: Vec2 = this.getVector(segment2);
        const numerator: number = this.dotProduct(u, v);
        const denominator: number = this.getHypothenuse(u) * this.getHypothenuse(v);
        const angleInRadians: number = Math.acos(numerator / denominator);
        return this.radToDegree(angleInRadians);
    }

    static pointInCircle(mousePosition: Vec2, basePoint: Vec2, radius: number): boolean {
        const dx = Math.abs(basePoint.x - mousePosition.x);
        const dy = Math.abs(basePoint.y - mousePosition.y);
        return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

    static pointInPolygon(p: Vec2, polygon: Vec2[]): boolean {
        let isInside = false;
        let minX = polygon[0].x;
        let maxX = polygon[0].x;
        let minY = polygon[0].y;
        let maxY = polygon[0].y;

        for (let i = 1; i < polygon.length; i++) {
            const q = polygon[i];
            minX = Math.min(q.x, minX);
            maxX = Math.max(q.x, maxX);
            minY = Math.min(q.y, minY);
            maxY = Math.max(q.y, maxY);
        }

        if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
            return false;
        }

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (
                polygon[i].y > p.y !== polygon[j].y > p.y &&
                p.x < ((polygon[j].x - polygon[i].x) * (p.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
            ) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    static translatePolygon(polygon: Vec2[], oldOrigin: Vec2, newOrigin: Vec2): Vec2[] {
        const dx = newOrigin.x - oldOrigin.x;
        const dy = newOrigin.y - oldOrigin.y;

        for (const point of polygon) {
            point.x = point.x + dx;
            point.y = point.y + dy;
        }
        return polygon;
    }

    static findMinCoord(coordinates: Vec2[]): Vec2 {
        let minX;
        let minY;

        minX = coordinates[0].x;
        for (const i in coordinates) {
            if (coordinates[i].x < minX) {
                minX = coordinates[i].x;
            }
        }

        minY = coordinates[0].y;
        for (const i in coordinates) {
            if (coordinates[i].y < minY) {
                minY = coordinates[i].y;
            }
        }
        return { x: minX, y: minY };
    }

    static findMaxCoord(coordinates: Vec2[]): Vec2 {
        let maxX;
        let maxY;

        maxX = coordinates[0].x;
        for (const i in coordinates) {
            if (coordinates[i].x > maxX) {
                maxX = coordinates[i].x;
            }
        }

        maxY = coordinates[0].y;
        for (const i in coordinates) {
            if (coordinates[i].y > maxY) {
                maxY = coordinates[i].y;
            }
        }

        return { x: maxX, y: maxY };
    }
}
