import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ColorOrder } from './../../../../interfaces-enums/color-order';
import { ColorManagerService } from './../../../../services/color-manager/color-manager.service';

const DEFAULT_OPACITY = 1;

@Component({
    selector: 'app-color-opacity',
    templateUrl: './color-opacity.component.html',
    styleUrls: ['./color-opacity.component.scss'],
})
export class ColorOpacityComponent implements AfterViewInit, OnChanges {
    @Input() opacity: number;

    @Output() alpha: EventEmitter<string> = new EventEmitter(true);

    colorOrder: ColorOrder;
    private colorManager: ColorManagerService;

    ngAfterViewInit(): void {
        this.updateOpacity(this.colorOrder, DEFAULT_OPACITY);
    }
    ngOnChanges(change: SimpleChanges): void {
        if (change.opacity) {
            this.updateOpacity;
        }
    }

    updateOpacity(colorOrder: ColorOrder, opacity: number): void {
        this.colorManager.customizeOpacity(colorOrder, opacity);
    }
}
