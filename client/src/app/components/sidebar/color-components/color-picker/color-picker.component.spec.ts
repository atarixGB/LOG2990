import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { COLOR_POSITION } from '@app/constants';
import { ColorDisplayerComponent } from 'src/app/components/sidebar/color-components/color-displayer/color-displayer.component';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from 'src/app/constants';
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
class SecondEventMock {
    button = 0;
    preventDefault() {
        return false;
    }
}
class ThirdEventMock {
    button = 1;
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
    
    //lui il est correct (pour créer l'instance OK)
    it('should create', () => {
        expect(component).toBeTruthy();
    });


    fit('should create listeners when opened', () => {
        const mouseEvent = new MouseEvent('mousedown');
        const mouseEventButton = new MouseEvent('click', { button: 2 });
         component['eventListeners'].mouseDown(mouseEvent);
        component['eventListeners'].contextMenu(mouseEventButton);
        component.ngOnInit();
        expect(component['eventListeners'].changedMouseDown).toBeTruthy();
    });

    it('should prevent context menu from opening', () => {
        const clickSpy = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component.eventListeners.contextMenu(clickSpy);
        expect(clickSpy.preventDefault).toHaveBeenCalledTimes(1);
    });

   
    
    //lui il est correct aussi
    it('should change secondary color when right button of mouse down', () => {
        const colorPickerSpy = spyOn<any>(component, 'colorPicker').and.stub();
        let eventMock = new EventMock();
        component['onMouseDown'](eventMock as any);
        expect(colorPickerSpy).toHaveBeenCalledWith(component.coord, ColorOrder.secondaryColor, COLOR_POSITION[1]);
    });
        //lui correct
    it('should change primary color when left button of mouse down', () => {
        const colorPickerSpy = spyOn<any>(component, 'colorPicker').and.stub();
        let eventMock = new SecondEventMock();
        component['onMouseDown'](eventMock as any);
        expect(colorPickerSpy).toHaveBeenCalledWith(component.coord, ColorOrder.primaryColor, COLOR_POSITION[0]);
    });
    //lui correct
    it('should not change when wrong button of mouse down', () => {
        const colorPickerSpy = spyOn<any>(component, 'colorPicker').and.stub();
        let eventMock = new ThirdEventMock();
        component['onMouseDown'](eventMock as any);
        expect(colorPickerSpy).toHaveBeenCalledTimes(0);
    });
    //lui correct (pour tester la methode colorPicker)
    it('should not change when colorPixels does not exist', () => {
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        contextSpy.getImageData.and.returnValue({ data: undefined });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
        //this.arrayColorPixel = false => expect expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
    });

    
    it('should change when colorPixels exists', () => {
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        let data= new ImageData(25,25);
        component.arrayColorPixel=contextSpy.getImageData.and.returnValue(data);
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(1);
        //this.arrayColorPixel = false => expect expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
    });
});
