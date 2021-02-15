import { TestBed } from '@angular/core/testing';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from './color-manager.service';

// tslint:disable:no-magic-numbers
fdescribe('ColorManagerService', () => {
    let colorManagerService: ColorManagerService;
    const rgbaColor: RGBA = {
        Dec: {
            Red: 255,
            Green: 255,
            Blue: 255,
            Alpha: 1,
        },
        Hex: {
            Red: 'ff',
            Green: 'ff',
            Blue: 'ff',
        },
        inString: 'rgba(255, 255, 255, 1)',
    };
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
        colorManagerService.updateRGBAColor(ColorOrder.primaryColor, rgbaColor, true);
        expect(colorManagerService.lastColors.length).toBe(3);
    });

    it('should not update history', () => {
        colorManagerService.lastColors.length = 3;
        colorManagerService.updateRGBAColor(ColorOrder.primaryColor, rgbaColor, true);
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

    it('should update color',()=>{
       

    })
});
