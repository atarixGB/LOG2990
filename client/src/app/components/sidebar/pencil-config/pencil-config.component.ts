import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil/pencil-service';

@Component({
    selector: 'app-pencil-config',
    templateUrl: './pencil-config.component.html',
    styleUrls: ['./pencil-config.component.scss'],
})
export class PencilConfigComponent implements OnInit {
    constructor(public pencilService: PencilService) {}

    ngOnInit(): void {}

    formatLabel(value: number) {
        return value + 'px';
    }
}
