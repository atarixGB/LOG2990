import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from '@app/constants';
import { RGBA } from '@app/interfaces-enums/rgba';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { AlphaSliderComponent } from '../alpha-slider/alpha-slider.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { ColorPopupComponent } from './color-popup.component';
fdescribe('ColorPopupComponent', () => {
    let component: ColorPopupComponent;
    let fixture: ComponentFixture<ColorPopupComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatFormFieldModule, MatInputModule, FormsModule, BrowserAnimationsModule],
            declarations: [ColorPopupComponent, AlphaSliderComponent, ColorSliderComponent, ColorPaletteComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: ColorOrder.primaryColor },
                { provide: ColorManagerService, useValue: colorManagerSpy },
            ],
        }).compileComponents();
    }));
    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', [
            'this.colorManager.updateWithHex',
            'updateColorWithPixel',
            'getColorStringAlpha',
        ]);
        colorManagerSpy.selectedColor = new Array<RGBA>();
        colorManagerSpy.selectedColor[ColorOrder.primaryColor] = FIRSTCOLORTEST;
        colorManagerSpy.selectedColor[ColorOrder.secondaryColor] = SECONDCOLORTEST;
        colorManagerSpy.getColorStringAlpha.and.returnValue('rgba(255,255,255,1)');
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should close dialog', () => {
        component.closeWindow();

        expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
    it('should update hex', () => {
        component.updateHex();
        expect(colorManagerSpy.updateWithHex).toHaveBeenCalledTimes(1);
    });
    it('should update history when clicked left', () => {
        const buttonType = new MouseEvent('click', { buttons: 1 });
        component.colorHistory = [FIRSTCOLORTEST, SECONDCOLORTEST];
        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(colorManagerSpy.updateRGBAColor).toHaveBeenCalledTimes(1);
    });
    it('should update history when clicked right', () => {
        const buttonType = new MouseEvent('click', { buttons: 2 });
        component.colorHistory = [FIRSTCOLORTEST, SECONDCOLORTEST];
        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(colorManagerSpy.updateRGBAColor).toHaveBeenCalledTimes(1);
    });
    it('should not update history when clicked 3', () => {
        const buttonType = new MouseEvent('click', { buttons: 3 });
        component.colorHistory = [FIRSTCOLORTEST, SECONDCOLORTEST];
        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(colorManagerSpy.updateRGBAColor).toHaveBeenCalledTimes(0);
    });
    it('should prevent default action for right click', () => {
        const clickSpy = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component.contextMenu(clickSpy);
        expect(clickSpy.preventDefault).toHaveBeenCalledTimes(1);
    });
});
