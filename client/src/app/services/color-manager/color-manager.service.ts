// this service is responsible of the storage of our 10 selected colors
// it will also handle the conversion from hex code to RGB
import { Injectable } from '@angular/core';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';

const NUMBER_OF_HISTORY_COLORS = 10; // we can store the last 10 chosen colors
const COLOR_CHOICE = 2; // we have 2 color choices primary and secondary color
const VALIDATOR_HEX = RegExp('^[a-fA-F0-9 ]+'); // RegExp (regular expression) ensures that the hex code is valid ( 0 to 9, A->F and a->f)
const BASE = 16;

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    constructor() {
        this.oldColors = new Array<RGBA>();
        this.selectedColors = new Array<RGBA>();
        let temp = new Array<RGBA>();

        for (let i = 0; i < COLOR_CHOICE + NUMBER_OF_HISTORY_COLORS; i++) {
            temp = i < COLOR_CHOICE ? this.selectedColors : this.oldColors;
            temp.push({
                Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 1 },
                Hex: { Red: '0', Green: '0', Blue: '0' },
                inString: 'rgba(0,0,0,1)',
            });
        }
        this.updateWithHex(ColorOrder.primaryColor, 'ff', '0', '0');
        this.updateWithHex(ColorOrder.secondaryColor, '0', 'ff', '0');
    }
    // 2 arrays of the interface RGBA
    selectedColors: RGBA[];
    oldColors: RGBA[];

    private updateHistory(colorOrder: ColorOrder, lastElement: boolean): void {
        this.oldColors.push(JSON.parse(JSON.stringify(this.selectedColors[colorOrder])));
        if (lastElement) {
            this.oldColors.pop();
        }
    }
    private updateColorString(colorOrder: ColorOrder): void {
        this.selectedColors[colorOrder].inString =
            'rgba(' +
            this.selectedColors[colorOrder].Dec.Red +
            ',' +
            this.selectedColors[colorOrder].Dec.Green +
            ',' +
            this.selectedColors[colorOrder].Dec.Blue +
            ',' +
            this.selectedColors[colorOrder].Dec.Alpha +
            ')';
    }

    customizeOpacity(colorOrder: ColorOrder, alpha: number): void {
        if (alpha > 0 && alpha < 1) {
            this.selectedColors[colorOrder].Dec.Alpha - alpha;
        }
    }

    updateWithHex(colorOrder: ColorOrder, redCode: string, greenCode: string, blueCode: string): void {
        if (VALIDATOR_HEX.test(redCode) && VALIDATOR_HEX.test(greenCode) && VALIDATOR_HEX.test(blueCode)) {
            this.selectedColors[colorOrder].Dec.Red = parseInt(redCode, BASE);
            this.selectedColors[colorOrder].Dec.Green = parseInt(greenCode, BASE);
            this.selectedColors[colorOrder].Dec.Blue = parseInt(blueCode, BASE);

            this.selectedColors[colorOrder].Hex.Red = redCode;
            this.selectedColors[colorOrder].Hex.Green = greenCode;
            this.selectedColors[colorOrder].Hex.Blue = blueCode;

            this.updateColorString(colorOrder);
            this.updateHistory(colorOrder, true); // with every update we must remove our last element so second argument is always true
        }
    }
}
