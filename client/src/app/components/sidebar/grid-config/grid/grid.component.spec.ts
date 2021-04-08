import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { GridComponent } from './grid.component';

// tslint:disable

fdescribe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setGrid']);
        selectionServiceSpy = jasmine.createSpyObj('selectionService', ['setGridSpaces']);

        TestBed.configureTestingModule({
            declarations: [GridComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
            imports: [MatSliderModule, MatSlideToggleModule, FormsModule, BrowserAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call setgrid if grid is enabled', () => {
        component.switchGridView(true);
        expect(drawingServiceSpy.setGrid).toHaveBeenCalled();
    });

    it('should clear canvas when grid view is disabled', () => {
        component.switchGridView(false);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should set grid spacing on grid size change if grid is enabled', () => {
        component.isEnabled = true;
        component.changeGridSize(10);
        expect(selectionServiceSpy.setGridSpaces).toHaveBeenCalled();
        expect(drawingServiceSpy.setGrid).toHaveBeenCalled();
    });

    it('should change opacity on changeOpacity call and set grid if grid is enabled', () => {
        component.isEnabled = true;
        component.currentOpacity = 100;
        component.changeOpacity(50);
        expect(drawingServiceSpy.setGrid).toHaveBeenCalled();
        expect(component.currentOpacity).toEqual(50);
    });

});
