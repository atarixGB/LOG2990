import { Component } from '@angular/core';
import { PolygonService } from 'src/app/services/tools/polygon/polygon.service';

@Component({
    selector: 'app-polygon-config',
    templateUrl: './Polygon-config.component.html',
    styleUrls: ['./Polygon-config.component.scss'],
})
export class PolygonConfigComponent {
    polygonService: PolygonService;
    sides: number = 3;

    constructor(polygonService: PolygonService) {
        this.polygonService = polygonService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
    getSides(sides: number): void {
        this.sides = sides;
        this.polygonService.sides = this.sides;
    }
}
