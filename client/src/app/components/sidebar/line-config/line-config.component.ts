import { Component } from '@angular/core';
import { LineService } from '@app/services/tools/line.service';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent {
    lineService: LineService;
    lineWidth: number;

    constructor(lineService: LineService) {
        this.lineService = lineService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
