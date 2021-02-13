import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorOpacityComponent } from './color-opacity.component';

describe('ColorOpacityComponent', () => {
    let component: ColorOpacityComponent;
    let fixture: ComponentFixture<ColorOpacityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorOpacityComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorOpacityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
