import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolygonConfigComponent } from './polygon-config.component';
import { MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

describe('PolygonConfigComponent', () => {
    let component: PolygonConfigComponent;
    let fixture: ComponentFixture<PolygonConfigComponent>;
    const initialSides = 5;
    const finalSides=8;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygonConfigComponent,MatLabel,MatOption],
            imports:[MatSliderModule,MatSelectModule,FormsModule,BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update polygon line width', () => {
        const expectedResult = 5;
        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });

    it('getSides should update component sides ', () => {
       component.sides=initialSides;
       component.getSides(finalSides);
        expect(component.polygonService.sides).toEqual(finalSides);
    });
});
