import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselDrawingComponent } from './carousel-drawing.component';

// tslint:disable
describe('CarouselDrawingComponent', () => {
    let fixture: ComponentFixture<CarouselDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselDrawingComponent);
        fixture.detectChanges();
    });
});
