import { Component } from '@angular/core';
import { TypeOfJunctions } from '@app/constants';
import { LineStyleService } from '@app/line-style.service';
import { LineService } from '@app/services/tools/line/line.service';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent {
    lineService: LineService;
    lineStyleService: LineStyleService;
    TypeOfJunctions: typeof TypeOfJunctions = TypeOfJunctions;

    constructor(lineService: LineService, lineStyleService: LineStyleService) {
        this.lineService = lineService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
