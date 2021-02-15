import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from '@app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { AlphaSliderComponent } from '../alpha-slider/alpha-slider.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPopupComponent } from '../color-popup/color-popup.component';
import { ColorSliderComponent } from '../color-slider/color-slider.component';
import { ColorDisplayerComponent } from './color-displayer.component';
fdescribe('ColorDisplayerComponent', () => {
    let component: ColorDisplayerComponent;
    let fixture: ComponentFixture<ColorDisplayerComponent>;

    const dialogRefSpy = {
        open: jasmine.createSpy('open'),
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPopupComponent, ColorDisplayerComponent, AlphaSliderComponent, ColorPaletteComponent, ColorSliderComponent],
            imports: [MatIconModule, MatDialogModule, BrowserAnimationsModule, MatInputModule, MatFormFieldModule, FormsModule],
            providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [ColorPopupComponent] },
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorDisplayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open color picker', () => {
        component.openColorPicker(ColorOrder.secondaryColor);
        expect(ColorPopupComponent).toBeTruthy();
    });

    it('should switch color', () => {
        const colorMangerSpy = jasmine.createSpyObj('ColorManagerService', ['selectedColor']);
        colorMangerSpy.selectedColor[ColorOrder.primaryColor] = FIRSTCOLORTEST;
        colorMangerSpy.selectedColor[ColorOrder.secondaryColor] = SECONDCOLORTEST;
        component.exchangeColorOrder();
        expect(colorMangerSpy.selectedColor[ColorOrder.primaryColor]).toEqual(SECONDCOLORTEST);
        expect(colorMangerSpy.selectedColor[ColorOrder.secondaryColor]).toEqual(FIRSTCOLORTEST);
    });
});
