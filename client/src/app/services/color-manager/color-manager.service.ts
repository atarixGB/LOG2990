// this service is responsible of the storage of our 10 selected colors
// it will also handle the conversion from hex code to RGB
import { Injectable } from '@angular/core';
import { COLOR_HISTORY, COLOR_ORDER, HEX_BASE, HEX_VALIDATOR, MAX_DEC_RANGE, OPACITY_POS_ALPHA } from '@app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    // 2 arrays of the interface RGBA
    selectColor: RGBA[];
    lastsColor: RGBA[];

    constructor() {
        this.lastsColor = new Array<RGBA>();
        this.selectColor = new Array<RGBA>();
        let temp = new Array<RGBA>();

        for (let i = 0; i < COLOR_ORDER + COLOR_HISTORY; i++) {
            temp = i < COLOR_ORDER ? this.selectColor : this.lastsColor;
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
        this.lastsColor.unshift(JSON.parse(JSON.stringify(this.selectColor[colorOrder])));
        if (shouldDeleteLast) {
            this.lastsColor.pop();
        }
    }
    private updateColorString(colorOrder: ColorOrder): void {
        this.selectColor[colorOrder].inString =
            'rgba(' +
            this.selectColor[colorOrder].Dec.Red +
            ',' +
            this.selectColor[colorOrder].Dec.Green +
            ',' +
            this.selectColor[colorOrder].Dec.Blue +
            ',' +
            this.selectColor[colorOrder].Dec.Alpha +
            ')';
    }

    getColorStringAlpha(colorOrder: ColorOrder, alphaMax: boolean): string {
        let colorInString =
            'rgba(' +
            this.selectColor[colorOrder].Dec.Red +
            ',' +
            this.selectColor[colorOrder].Dec.Green +
            ',' +
            this.selectColor[colorOrder].Dec.Blue +
            ',';
        colorInString += alphaMax ? '1)' : '0)';
        return colorInString;
    }

    upgradePixelColor(colorOrder: ColorOrder, colorPixel: Uint8ClampedArray): void {
        this.selectColor[colorOrder].Dec.Red = colorPixel[0];
        this.selectColor[colorOrder].Dec.Green = colorPixel[1];
        this.selectColor[colorOrder].Dec.Blue = colorPixel[2];
        this.selectColor[colorOrder].Dec.Alpha = colorPixel[OPACITY_POS_ALPHA] / MAX_DEC_RANGE;
        this.selectColor[colorOrder].Hex.Red = colorPixel[0].toString(HEX_BASE);
        this.selectColor[colorOrder].Hex.Green = colorPixel[1].toString(HEX_BASE);
        this.selectColor[colorOrder].Hex.Blue = colorPixel[2].toString(HEX_BASE);
        this.updateColorString(colorOrder);
        if (this.selectColor[colorOrder].Dec.Alpha === 1) {
            // do not add to history if color changed by alpha
            this.updateColorLasts(colorOrder, true);
        }
    }

    updateWithHex(colorOrder: ColorOrder, redHex: string, greenHex: string, blueHex: string): void {
        if (HEX_VALIDATOR.test(redHex) && HEX_VALIDATOR.test(greenHex) && HEX_VALIDATOR.test(blueHex)) {
            this.selectColor[colorOrder].Dec.Red = parseInt(redHex, 16);
            this.selectColor[colorOrder].Dec.Green = parseInt(greenHex, 16);
            this.selectColor[colorOrder].Dec.Blue = parseInt(blueHex, 16);
            this.selectColor[colorOrder].Hex.Red = redHex;
            this.selectColor[colorOrder].Hex.Green = greenHex;
            this.selectColor[colorOrder].Hex.Blue = blueHex;
            this.updateColorString(colorOrder);
            this.updateColorLasts(colorOrder, true);
        }
    }

    upgradeRGBAColor(colorOrder: ColorOrder, colorElement: RGBA, shouldDeleteLast: boolean): void {
        this.selectColor[colorOrder].Dec = colorElement.Dec;
        this.updateColorString(colorOrder);
        this.updateColorLasts(colorOrder, shouldDeleteLast);
    }
}
