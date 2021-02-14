import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPopupComponent } from './color-popup.component';

describe('ColorPopupComponent', () => {
    let component: ColorPopupComponent;
    let fixture: ComponentFixture<ColorPopupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPopupComponent],
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
});
