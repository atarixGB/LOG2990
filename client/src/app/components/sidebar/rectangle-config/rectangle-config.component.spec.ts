import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RectangleConfigComponent } from './rectangle-config.component';

// tslint:disable
describe('RectangleConfigComponent', () => {
    let component: RectangleConfigComponent;
    let fixture: ComponentFixture<RectangleConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update Line width', () => {
        const expectedResult = 77;
        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });
});
