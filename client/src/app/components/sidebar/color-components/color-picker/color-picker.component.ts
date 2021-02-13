// Code used for this section is from an External Source
// Lukas Marx (2018) Creating a Color Picker Component with Angular
// Available at : https://github.com/LukasMarx/angular-color-picker
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
