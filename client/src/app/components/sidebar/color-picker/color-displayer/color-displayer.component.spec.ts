import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorDisplayerComponent } from './color-displayer.component';

describe('ColorDisplayerComponent', () => {
    let component: ColorDisplayerComponent;
    let fixture: ComponentFixture<ColorDisplayerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorDisplayerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorDisplayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
