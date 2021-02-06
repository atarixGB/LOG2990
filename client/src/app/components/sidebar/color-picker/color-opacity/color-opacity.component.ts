import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-color-opacity',
    templateUrl: './color-opacity.component.html',
    styleUrls: ['./color-opacity.component.scss'],
})
export class ColorOpacityComponent {
    opacityForm = new FormControl('');

    updateOpacity(): void {
        this.opacityForm.setValue('0.5');
    }
}
