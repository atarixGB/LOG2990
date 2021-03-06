import { Injectable } from '@angular/core';
import { COLOR_HISTORY, COLOR_ORDER, HEX_BASE, HEX_VALIDATOR, MAX_DEC_RANGE, OPACITY_POS_ALPHA } from '@app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    selectedColor: RGBA[];
    lastColors: RGBA[];

    constructor() {
        this.lastColors = new Array<RGBA>();
        this.selectedColor = new Array<RGBA>();
        let temp = new Array<RGBA>();

        for (let i = 0; i < COLOR_ORDER + COLOR_HISTORY; i++) {
            temp = i < COLOR_ORDER ? this.selectedColor : this.lastColors;
            temp.push({
                Dec: { Red: 0, Green: 0, Blue: 0, Alpha: 1 },
                Hex: { Red: '0', Green: '0', Blue: '0' },
                inString: 'rgba(0,0,0,1)',
            });
        }
        this.updateWithHex(ColorOrder.primaryColor, 'ff', '0', '0');
        this.updateWithHex(ColorOrder.secondaryColor, '0', 'ff', '0');
    }

    private updateColorLasts(colorOrder: ColorOrder, shouldDeleteLast: boolean): void {
        this.lastColors.unshift(JSON.parse(JSON.stringify(this.selectedColor[colorOrder])));
        if (shouldDeleteLast) {
            this.lastColors.pop();
        }
    }
    private updateColorString(colorOrder: ColorOrder): void {
        this.selectedColor[colorOrder].inString =
            'rgba(' +
            this.selectedColor[colorOrder].Dec.Red +
            ',' +
            this.selectedColor[colorOrder].Dec.Green +
            ',' +
            this.selectedColor[colorOrder].Dec.Blue +
            ',' +
            this.selectedColor[colorOrder].Dec.Alpha +
            ')';
    }

    getColorStringAlpha(colorOrder: ColorOrder, alphaMax: boolean): string {
        let colorInString =
            'rgba(' +
            this.selectedColor[colorOrder].Dec.Red +
            ',' +
            this.selectedColor[colorOrder].Dec.Green +
            ',' +
            this.selectedColor[colorOrder].Dec.Blue +
            ',';
        colorInString += alphaMax ? '1)' : '0)';
        return colorInString;
    }

    updatePixelColor(colorOrder: ColorOrder, colorPixel: Uint8ClampedArray): void {
        this.selectedColor[colorOrder].Dec.Red = colorPixel[0];
        this.selectedColor[colorOrder].Dec.Green = colorPixel[1];
        this.selectedColor[colorOrder].Dec.Blue = colorPixel[2];
        this.selectedColor[colorOrder].Dec.Alpha = colorPixel[OPACITY_POS_ALPHA] / MAX_DEC_RANGE;
        this.selectedColor[colorOrder].Hex.Red = colorPixel[0].toString(HEX_BASE);
        this.selectedColor[colorOrder].Hex.Green = colorPixel[1].toString(HEX_BASE);
        this.selectedColor[colorOrder].Hex.Blue = colorPixel[2].toString(HEX_BASE);
        this.updateColorString(colorOrder);
        if (this.selectedColor[colorOrder].Dec.Alpha === 1) {
            this.updateColorLasts(colorOrder, true);
        }
    }

    updateWithHex(colorOrder: ColorOrder, redHex: string, greenHex: string, blueHex: string): void {
        if (HEX_VALIDATOR.test(redHex) && HEX_VALIDATOR.test(greenHex) && HEX_VALIDATOR.test(blueHex)) {
            this.selectedColor[colorOrder].Dec.Red = parseInt(redHex, 16);
            this.selectedColor[colorOrder].Dec.Green = parseInt(greenHex, 16);
            this.selectedColor[colorOrder].Dec.Blue = parseInt(blueHex, 16);
            this.selectedColor[colorOrder].Hex.Red = redHex;
            this.selectedColor[colorOrder].Hex.Green = greenHex;
            this.selectedColor[colorOrder].Hex.Blue = blueHex;
            this.updateColorString(colorOrder);
            this.updateColorLasts(colorOrder, true);
        }
    }

    updateRGBAColor(colorOrder: ColorOrder, colorElement: RGBA, shouldDeleteLast: boolean): void {
        this.selectedColor[colorOrder].Dec = colorElement.Dec;
        this.updateColorString(colorOrder);
        this.updateColorLasts(colorOrder, shouldDeleteLast);
    }
}
