import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselDrawingComponent } from './carousel-drawing.component';

// tslint:disable
describe('CarouselDrawingComponent', () => {
    let component:CarouselDrawingComponent;
    let fixture: ComponentFixture<CarouselDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        component=fixture.componentInstance;
        fixture = TestBed.createComponent(CarouselDrawingComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
