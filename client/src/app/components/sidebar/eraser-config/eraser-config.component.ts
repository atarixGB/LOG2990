import { Component, OnInit } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent implements OnInit {
    constructor(public eraserService: EraserService) {}

    ngOnInit(): void {}

    formatLabel(value: number) {
        return value + 'px';
    }
}
