import { Injectable } from '@angular/core';
import { ColorChoice } from '../../interfaces-enums/color-choice';
import { RGBA } from '../../interfaces-enums/rgba';

const NUMBER_OF_HISTORY_COLORS = 10;
const NUMBER_OF_COLOR_CHOICE = 3;
const MAX_COLOR = 255;
const ALPHA_POSITION = 3;
const HEXADECIMAL_BASE = 16;
const VALIDATOR_HEX = RegExp('^[a-fA-f0-9 ]+'); //RegExp (regular expression)

@Injectable({
    providedIn: 'root'
})
export class ColorManagerService {
    colorSelected: RGBA[];
    colorHistory: RGBA[];

    constructor() {
        this.colorHistory = new Array<RGBA>();
        this.colorSelected = new Array<RGBA>();
        let tempArray = new Array<RGBA>();
        for (let i = 0; i < NUMBER_OF_COLOR_CHOICE + NUMBER_OF_HISTORY_COLORS; i++) {
            tempArray = (i < NUMBER_OF_COLOR_CHOICE) ? this.colorSelected : this.colorHistory;
            tempArray.push({
                Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 1 },
                Hex: { Red: '0', Green: '0', Blue: '0' },
                inString: 'rgba(0,0,0,1)'
            });
        }
        this.updateColorWithHex(ColorChoice.mainColor, 'ff', '0', '0');
        this.updateColorWithHex(ColorChoice.secondaryColor, '0', 'ff', '0');
        this.updateColorWithHex(ColorChoice.backgroundColor, 'ff', 'ff', 'ff');
    }

    private updateHistory(colorChoice: ColorChoice, shouldDeleteLast: boolean): void {
        this.colorHistory.unshift(JSON.parse(JSON.stringify(this.colorSelected[colorChoice])));
        if (shouldDeleteLast) {
            this.colorHistory.pop();
        }
    }

    private updateColorString(colorChoice: ColorChoice): void {
        this.colorSelected[colorChoice].inString =
            'rgba(' + this.colorSelected[colorChoice].Dec.Red + ','
            + this.colorSelected[colorChoice].Dec.Green + ','
            + this.colorSelected[colorChoice].Dec.Blue + ','
            + this.colorSelected[colorChoice].Dec.Alpha + ')';
    }

    getColorStringWithCustomAlpha(colorChoice: ColorChoice, isAlphaMax: boolean): string {
        let colorString = 'rgba(' + this.colorSelected[colorChoice].Dec.Red + ','
            + this.colorSelected[colorChoice].Dec.Green + ','
            + this.colorSelected[colorChoice].Dec.Blue + ',';
        colorString += isAlphaMax ? '1)' : '0)';
        return colorString;
    }

    updateColorWithPixel(colorChoice: ColorChoice, colorPixel: Uint8ClampedArray): void {
        this.colorSelected[colorChoice].Dec.Red = colorPixel[0];
        this.colorSelected[colorChoice].Dec.Green = colorPixel[1];
        this.colorSelected[colorChoice].Dec.Blue = colorPixel[2];
        this.colorSelected[colorChoice].Dec.Alpha = colorPixel[ALPHA_POSITION] / MAX_COLOR;
        this.colorSelected[colorChoice].Hex.Red = colorPixel[0].toString(HEXADECIMAL_BASE);
        this.colorSelected[colorChoice].Hex.Green = colorPixel[1].toString(HEXADECIMAL_BASE);
        this.colorSelected[colorChoice].Hex.Blue = colorPixel[2].toString(HEXADECIMAL_BASE);
        this.updateColorString(colorChoice);
        if (this.colorSelected[colorChoice].Dec.Alpha === 1) { // do not add to history if color changed by alpha
            this.updateHistory(colorChoice, true);
        }
    }

    updateColorWithHex(colorChoice: ColorChoice, redHex: string, greenHex: string, blueHex: string): void {
        if (VALIDATOR_HEX.test(redHex) && VALIDATOR_HEX.test(greenHex) && VALIDATOR_HEX.test(blueHex)) {
            this.colorSelected[colorChoice].Dec.Red = parseInt(redHex, 16);
            this.colorSelected[colorChoice].Dec.Green = parseInt(greenHex, 16);
            this.colorSelected[colorChoice].Dec.Blue = parseInt(blueHex, 16);
            this.colorSelected[colorChoice].Hex.Red = redHex;
            this.colorSelected[colorChoice].Hex.Green = greenHex;
            this.colorSelected[colorChoice].Hex.Blue = blueHex;
            this.updateColorString(colorChoice);
            this.updateHistory(colorChoice, true);
        }
    }

    updateColorWithRGBA(colorChoice: ColorChoice, colorElement: RGBA, shouldDeleteLast: boolean): void {
        this.colorSelected[colorChoice].Dec = colorElement.Dec;
        this.updateColorString(colorChoice);
        this.updateHistory(colorChoice, shouldDeleteLast);
    }
}
