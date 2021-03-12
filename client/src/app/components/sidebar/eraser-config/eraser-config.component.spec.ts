import { FormsModule } from '@angular/forms';
import { MatSliderModule,MatSlider } from '@angular/material/slider';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EraserConfigComponent } from './eraser-config.component';

describe('PencilConfigComponent', () => {
    let component: EraserConfigComponent;
    let fixture: ComponentFixture<EraserConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserConfigComponent,MatSlider],
            imports:[MatSliderModule,FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should recreate format label', () => {
        const expectedResult = '5px';
        const param = 5;
        expect(component.formatLabel(param)).toEqual(expectedResult);
    });
});
