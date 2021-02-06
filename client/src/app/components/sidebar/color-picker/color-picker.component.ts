import { Component } from '@angular/core';

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
