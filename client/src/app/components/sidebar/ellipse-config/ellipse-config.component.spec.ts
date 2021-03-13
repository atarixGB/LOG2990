import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EllipseConfigComponent } from './ellipse-config.component';

// tslint:disable
describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent],
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
