import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { COLOR_POSITION } from '@app/constants';
import { ColorDisplayerComponent } from 'src/app/components/sidebar/color-components/color-displayer/color-displayer.component';
import { CASES_ARRAY, FIRSTCOLORTEST, SECONDCOLORTEST } from 'src/app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ColorPickerComponent } from './color-picker.component';

class EventMock {
    button = 2;
    preventDefault() {
        return false;
    }
}

fdescribe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;
    //let mouseEvent: MouseEvent;
    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['updatePixelColor']);
        colorManagerSpy.selectedColor = new Array<RGBA>();
        colorManagerSpy.selectedColor[ColorOrder.primaryColor] = FIRSTCOLORTEST;
        colorManagerSpy.selectedColor[ColorOrder.secondaryColor] = SECONDCOLORTEST;
        /* mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 2,
        } as MouseEvent;*/
    });
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatDialogModule, HttpClientModule],
            declarations: [ColorPickerComponent, ColorDisplayerComponent],
            providers: [{ provide: ColorManagerService, useValue: colorManagerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create listeners when opened', () => {
        const mouseEvent = new MouseEvent('mousedown');
        const mouseEventButton = new MouseEvent('click', { button: 2 });
        component.eventListeners.mouseDown(mouseEvent);
        component.eventListeners.contextMenu(mouseEventButton);
        expect(component.eventListeners.changedMouseDown).toBeTruthy();
    });

    it('should prevent context menu from opening', () => {
        const clickSpy = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component.eventListeners.contextMenu(clickSpy);
        expect(clickSpy.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should change main color when left button of mouse down', () => {
        const mouseEvent = new MouseEvent('click', { button: 0 });
        const coordinates = { x: 1, y: 1 };
        component.coord = coordinates;
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        const pixels: Uint8ClampedArray = new Uint8ClampedArray(CASES_ARRAY);
        const colorPixel: ImageData = new ImageData(pixels, 1, 1);
        contextSpy.getImageData.and.returnValue(colorPixel);
        component.arrayColorPixel = pixels;
        component.eventListeners.mouseDown(mouseEvent);
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalled();
    });

    fit('should change secondary color when right button of mouse down', () => {
        //   const mouseEvent = new MouseEvent('click', { button: 2 });
        // const coordinates = { x: 1, y: 1 };
        //   component.coord = coordinates;
        //const pixels: Uint8ClampedArray = new Uint8ClampedArray(CASES_ARRAY);
        const colorPickerSpy = spyOn<any>(component, 'colorPicker').and.stub();
        let eventMock = new EventMock();
        //    const preventDefaultSpy = spyOn<any>(mouseEvent, 'preventDefault').and.stub();
        //const colorPixel: ImageData = new ImageData(pixels, 1, 1);
        component['onMouseDown'](eventMock as any);
        // expect(preventDefaultSpy).toHaveBeenCalled();
        expect(colorPickerSpy).toHaveBeenCalledWith(component.coord, ColorOrder.secondaryColor, COLOR_POSITION[1]);
    });

    it('should not change when wrong button of mouse down', () => {
        const mouseEvent = new MouseEvent('click', { button: 1 });
        const coordinates = { x: 1, y: 1 };
        component.coord = coordinates;
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        const pixels: Uint8ClampedArray = new Uint8ClampedArray(CASES_ARRAY);
        const colorPixel: ImageData = new ImageData(pixels, 1, 1);
        contextSpy.getImageData.and.returnValue(colorPixel);
        component.arrayColorPixel = pixels;
        component.eventListeners.mouseDown(mouseEvent);
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
    });

    it('should not change when colorPixels does not exist', () => {
        const mouseEvent = new MouseEvent('click', { button: 2 });
        const coordinates = { x: 1, y: 1 };
        component.coord = coordinates;
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        contextSpy.getImageData.and.returnValue({ data: undefined });
        component.eventListeners.mouseDown(mouseEvent);
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
    });
});
