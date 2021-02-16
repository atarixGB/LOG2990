import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider } from '@angular/material/slider';
import { PencilConfigComponent } from './pencil-config.component';

describe('PencilConfigComponent', () => {
    let component: PencilConfigComponent;
    let fixture: ComponentFixture<PencilConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilConfigComponent, MatSlider],
            // imports: [mo]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format label', () => {
        let param = 8;
        let expectedResult = '8px';
        expect(component.formatLabel(param)).toEqual(expectedResult);
    });
});
