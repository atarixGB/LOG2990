import { Component } from '@angular/core';
import { TypeOfJunctions } from '@app/constants';
import { LineService } from '@app/services/tools/line/line.service';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent {
    lineService: LineService;
    value: TypeOfJunctions;

    typeOfJunctions = [
        {
            name: 'Régulière',
            enumId: TypeOfJunctions.REGULAR,
        },
        {
            name: 'Point',
            enumId: TypeOfJunctions.CIRCLE,
        },
    ];

    constructor(lineService: LineService) {
        this.lineService = lineService;
        this.value = TypeOfJunctions.REGULAR;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
