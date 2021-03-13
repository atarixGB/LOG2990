import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EllipseConfigComponent } from './ellipse-config.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent,MatLabel,MatOption],
            imports:[MatSliderModule,MatFormFieldModule,MatSelectModule,FormsModule,BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update ellipse line width', () => {
        const expectedResult = 5;

        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });
});
