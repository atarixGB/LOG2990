import { Vec2 } from './vec2';

export const INFINITY = 10000;

export interface Segment {
    initial: Vec2;
    final: Vec2;
}

export class Utils {
    static findOrientation(p: Vec2, q: Vec2, r: Vec2): number {
        let value: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (value == 0) return 0;
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

        if (o1 != o2 && o3 != o4) return true;
        if (o1 == 0 && this.pointOnSegment(p1, p2, q1)) return true;
        if (o2 == 0 && this.pointOnSegment(p1, q2, q1)) return true;
        if (o3 == 0 && this.pointOnSegment(p2, p1, q2)) return true;
        if (o4 == 0 && this.pointOnSegment(p2, q1, q2)) return true;
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
        return (angleInRad * 180) / Math.PI;
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

    static pointInPolygon(point: Vec2, polygon: Vec2[]): boolean {
        const rayCastingLine: Vec2 = { x: INFINITY, y: point.y };
        let count = 0;
        let i = 0;
        let isInside: boolean;

        do {
            let next = (i + 1) % polygon.length;
            let segment1 = {
                initial: { x: polygon[i].x, y: polygon[i].y },
                final: { x: polygon[next].x, y: polygon[next].y },
            };
            let segment2 = {
                initial: { x: point.x, y: point.y },
                final: { x: rayCastingLine.x, y: point.y },
            };

            if (Utils.segmentsDoIntersect(segment1, segment2)) {
                if (Utils.findOrientation(segment1.initial, point, segment1.final) === 0) {
                    return Utils.pointOnSegment(segment1.initial, point, segment1.final);
                }
                count = count + 1;
            }
            i = next;
        } while (i != 0);

        isInside = count % 2 === 1;
        return isInside;
    }

    static translatePolygon(polygon: Vec2[], oldOrigin: Vec2, newOrigin: Vec2): void {
        const dx = newOrigin.x - oldOrigin.x;
        const dy = newOrigin.y - oldOrigin.y;

        for (let i = 0; i < polygon.length; i++) {
            polygon[i].x = polygon[i].x + dx;
            polygon[i].y = polygon[i].y + dy;
        }
    }

    static findMinCoord(coordinates: Vec2[]): Vec2 {
        let minX;
        let minY;

        minX = coordinates[0].x;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].x < minX) {
                minX = coordinates[i].x;
            }
        }

        minY = coordinates[0].y;
        for (let i = 0; i < coordinates.length; i++) {
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
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].x > maxX) {
                maxX = coordinates[i].x;
            }
        }

        maxY = coordinates[0].y;
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].y > maxY) {
                maxY = coordinates[i].y;
            }
        }

        return { x: maxX, y: maxY };
    }
}
