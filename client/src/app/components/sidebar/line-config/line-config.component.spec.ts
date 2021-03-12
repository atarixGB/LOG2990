import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LineConfigComponent } from './line-config.component';
import { MatOption, MatOptionModule } from '@angular/material/core';

//tslint:disable
describe('LineConfigComponent', () => {
    let component: LineConfigComponent;
    let fixture: ComponentFixture<LineConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineConfigComponent,MatSlider,MatSelect,MatOption],
            imports:[FormsModule,MatSliderModule,MatSelectModule,MatOptionModule,BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should update line width', () => {
        const expectedResult = 7;
        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });
});
