import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FIRSTCOLORTEST } from '@app/constants';
import { AlphaSliderComponent } from 'src/app/components/sidebar/color-components/alpha-slider/alpha-slider.component';
import { ColorPaletteComponent } from 'src/app/components/sidebar/color-components/color-palette/color-palette.component';
import { ColorSliderComponent } from 'src/app/components/sidebar/color-components/color-slider/color-slider.component';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ColorPopupComponent } from './color-popup.component';
// tslint:disable
describe('ColorPopupComponent', () => {
    let component: ColorPopupComponent;
    let fixture: ComponentFixture<ColorPopupComponent>;
    let colorManagerSpy: ColorManagerService;
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async(() => {
        colorManagerSpy = new ColorManagerService();

        TestBed.configureTestingModule({
            imports: [MatFormFieldModule, MatInputModule, FormsModule, BrowserAnimationsModule],
            declarations: [ColorPopupComponent, ColorPaletteComponent, ColorSliderComponent, AlphaSliderComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: ColorOrder.primaryColor },
                { provide: ColorManagerService, useValue: colorManagerSpy },
            ],
        }).compileComponents();
    }));

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
        const a = spyOn(colorManagerSpy, 'updateWithHex').and.stub();
        component.updateHex();
        expect(a).toHaveBeenCalledWith(ColorOrder.primaryColor, 'ff', '0', '0');
    });
    it('should update history when clicked left', () => {
        const buttonType = new MouseEvent('click', { buttons: 1 });
        const a = spyOn(colorManagerSpy, 'updateRGBAColor').and.stub();

        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(a).toHaveBeenCalledWith(ColorOrder.primaryColor, FIRSTCOLORTEST, false);
        //             expect(a).toHaveBeenCalledWith(ColorOrder.primaryColor, FIRSTCOLORTEST, false);
    });
    it('should update history when clicked right', () => {
        // charge
        const buttonType = new MouseEvent('click', { buttons: 2 });
        const a = spyOn(colorManagerSpy, 'updateRGBAColor').and.stub();

        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(a).toHaveBeenCalledWith(ColorOrder.secondaryColor, FIRSTCOLORTEST, false);
    });
    it('should not update history when clicked 3', () => {
        const buttonType = new MouseEvent('click', { buttons: 3 });
        const a = spyOn(colorManagerSpy, 'updateRGBAColor').and.stub();

        component.mouseClickOnHistory(buttonType, FIRSTCOLORTEST);
        expect(a).not.toHaveBeenCalledWith(ColorOrder.secondaryColor, FIRSTCOLORTEST, false);
    });
    it('should prevent default action for right click', () => {
        const clickSpy = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component.contextMenu(clickSpy);
        expect(clickSpy.preventDefault).toHaveBeenCalledTimes(1);
    });
});
