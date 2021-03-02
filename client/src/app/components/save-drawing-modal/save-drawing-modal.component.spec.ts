import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveDrawingModalComponent } from './save-drawing-modal.component';

// tsling: disabled
describe('SaveDrawingModalComponent', () => {
    let component: SaveDrawingModalComponent;
    let fixture: ComponentFixture<SaveDrawingModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveDrawingModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
