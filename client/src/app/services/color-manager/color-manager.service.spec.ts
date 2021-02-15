import { TestBed } from '@angular/core/testing';
import { FIRSTCOLORTEST } from 'src/app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from './color-manager.service';

// tslint:disable:no-magic-numbers
fdescribe('ColorManagerService', () => {
    let colorManagerService: ColorManagerService;

    beforeEach(() => TestBed.configureTestingModule({}));
    beforeEach(() => {
        colorManagerService = TestBed.inject(ColorManagerService);
    });

    it('should be created', () => {
        colorManagerService = TestBed.inject(ColorManagerService);
        expect(colorManagerService).toBeTruthy();
    });

    it('should update history', () => {
        colorManagerService.lastColors.length = 3;
        colorManagerService.updateRGBAColor(ColorOrder.primaryColor, FIRSTCOLORTEST, true);
        expect(colorManagerService.lastColors.length).toBe(3);
    });

    it('should not update history', () => {
        colorManagerService.lastColors.length = 3;
        colorManagerService.updateRGBAColor(ColorOrder.primaryColor, FIRSTCOLORTEST, false);
        expect(colorManagerService.lastColors.length).toBe(4);
    });

    it('should get custom string with max alpha', () => {
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red = 50;
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green = 100;
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue = 0;
        const result = colorManagerService.getColorStringAlpha(ColorOrder.primaryColor, true);
        expect(result).toBe('rgba(50,100,0,1)');
    });

    it('should get custom string with 0 for alpha', () => {
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red = 50;
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green = 100;
        colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue = 0;
        const result = colorManagerService.getColorStringAlpha(ColorOrder.primaryColor, false);
        expect(result).toBe('rgba(50,100,0,0)');
    });

    it('should update primary color with hex', () => {
        colorManagerService.updateWithHex(ColorOrder.primaryColor, '67', '4A', 'BB');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red).toBe(103);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green).toBe(74);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue).toBe(187);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Red).toBe('67');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Green).toBe('4A');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Blue).toBe('BB');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].inString).toBe('rgba(103,74,187,1)');
    });

    it('should update secondary color with hex', () => {
        colorManagerService.updateWithHex(ColorOrder.secondaryColor, '67', '4A', 'BB');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Red).toBe(103);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Green).toBe(74);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Blue).toBe(187);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Red).toBe('67');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Green).toBe('4A');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Blue).toBe('BB');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].inString).toBe('rgba(103,74,187,1)');
    });

    it('should not update primary color with hex', () => {
        colorManagerService.updateWithHex(ColorOrder.primaryColor, 'ZQ', 'TP', 'SS');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red).toBe(255);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green).toBe(0);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue).toBe(0);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Red).toBe('ff');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Green).toBe('0');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Blue).toBe('0');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].inString).toBe('rgba(255,0,0,1)');
    });

    it('should not update secondary color with hex', () => {
        colorManagerService.updateWithHex(ColorOrder.secondaryColor, 'zQ', 'TP', 'ss');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Red).toBe(0);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Green).toBe(255);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Dec.Blue).toBe(0);
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Red).toBe('0');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Green).toBe('ff');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].Hex.Blue).toBe('0');
        expect(colorManagerService.selectedColor[ColorOrder.secondaryColor].inString).toBe('rgba(0,255,0,1)');
    });

    it('should update color with hex and update history', () => {
        const colorPixel = new Uint8ClampedArray(4);
        colorPixel[0] = 197;
        colorPixel[1] = 145;
        colorPixel[2] = 192;
        colorPixel[3] = 255;
        colorManagerService.updatePixelColor(ColorOrder.primaryColor, colorPixel);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red).toBe(197);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green).toBe(145);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue).toBe(192);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Alpha).toBe(1);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Red).toBe('c5');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Green).toBe('91');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Blue).toBe('c0');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].inString).toBe('rgba(197,145,192,1)');
    });

    it('should update color with hex and not update history', () => {
        const colorPixel = new Uint8ClampedArray(4);
        colorPixel[0] = 197;
        colorPixel[1] = 145;
        colorPixel[2] = 192;
        colorPixel[3] = 51;
        colorManagerService.updatePixelColor(ColorOrder.primaryColor, colorPixel);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Red).toBe(197);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Green).toBe(145);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Blue).toBe(192);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Dec.Alpha).toBe(0.2);
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Red).toBe('c5');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Green).toBe('91');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].Hex.Blue).toBe('c0');
        expect(colorManagerService.selectedColor[ColorOrder.primaryColor].inString).toBe('rgba(197,145,192,0.2)');
    });
});
