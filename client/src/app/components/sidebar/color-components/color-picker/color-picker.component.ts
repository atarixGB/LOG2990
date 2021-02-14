import { Component,ElementRef,ViewChild } from '@angular/core';
import{COLOR_POSITION} from '@app/constants';
import { Vec2 } from 'src/app/classes/vec2';
import{ColorOrder} from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    // Hue is the result of the color-slider, whereas color is the result of the color-palette.
    hue: string;
    color: string;
}
