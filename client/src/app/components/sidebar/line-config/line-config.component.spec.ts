import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LineConfigComponent } from './line-config.component';

describe('LineConfigComponent', () => {
    let component: LineConfigComponent;
    let fixture: ComponentFixture<LineConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should update line width', () => {
        let expectedResult = 7;
        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });
});
