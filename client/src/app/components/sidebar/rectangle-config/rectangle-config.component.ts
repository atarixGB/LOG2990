import { Component } from '@angular/core';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent {
    constructor(public rectangleService: RectangleService) {}

    updateLineWidth(value: number): string {
        return value + 'px';
    }
}
