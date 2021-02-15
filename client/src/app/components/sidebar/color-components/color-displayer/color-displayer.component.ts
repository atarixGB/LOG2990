import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COLOR_WINDOW_WIDTH } from '@app/constants';
import { ColorPopupComponent } from 'src/app/components/sidebar/color-components/color-popup/color-popup.component';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Component({
    selector: 'app-color-displayer',
    templateUrl: './color-displayer.component.html',
    styleUrls: ['./color-displayer.component.scss'],
})
export class ColorDisplayerComponent {
    primaryColor: RGBA;
    secondaryColor: RGBA;

    ColorOrder: typeof ColorOrder = ColorOrder;

    constructor(public dialog: MatDialog, private colorManager: ColorManagerService) {
        this.primaryColor = this.colorManager.selectedColor[ColorOrder.primaryColor];
        this.secondaryColor = this.colorManager.selectedColor[ColorOrder.secondaryColor];
    }

    openColorPicker(colorOrder: ColorOrder): void {
        const window = this.dialog.open(ColorPopupComponent, {
            width: COLOR_WINDOW_WIDTH,
            data: colorOrder,
        });
        window.close();
    }

    exchangeColorOrder(): void {
        const primary = this.colorManager.selectedColor[ColorOrder.primaryColor];
        const secondary = this.colorManager.selectedColor[ColorOrder.secondaryColor];

        const tempForSwitch = JSON.parse(JSON.stringify(primary));

        primary.Dec = secondary.Dec;
        primary.Hex = secondary.Hex;
        primary.inString = secondary.inString;

        secondary.Dec = tempForSwitch.Dec;
        secondary.Hex = tempForSwitch.Hex;
        secondary.inString = tempForSwitch.inString;
    }
}
