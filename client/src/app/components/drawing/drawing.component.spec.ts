import { CdkDrag } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { DrawingComponent } from './drawing.component';

//tslint:disable
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingStub: DrawingService;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['onMouseDown', 'onMouseUp']);
        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            imports: [MatDialogModule],
            providers: [{ provide: DrawingService, useValue: drawingStub }, { provide: ToolManagerService, useValue: toolManagerSpy }, CdkDrag],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    //     teste si moitie de work area
    //     it('should have a default WIDTH and HEIGHT', () => {
    //         const height = component.height;
    //         const width = component.width;
    //         expect(height).toEqual(DEFAULT_HEIGHT);
    //         expect(width).toEqual(DEFAULT_WIDTH);
    //     });

    // teste si moitie de work area
    // fit('canvas should have a WIDTH and HEIGHT of half the dimensions of the working area', () => {
    //     const height = component.workingArea.nativeElement.offsetHeight;
    //     const width = component.workingArea.nativeElement.offsetHeight;
    //     expect(component.height).toEqual(height / 2);
    //     expect(component.width).toEqual(width / 2);
    // });

    // it(" should call the tool's mouse move when receiving a mouse move event", () => {
    //     const event = {} as MouseEvent;
    //     const mouseEventSpy = spyOn(toolManagerSpy, 'onMouseMove').and.callThrough();
    //     component.onMouseMove(event);
    //     expect(mouseEventSpy).toHaveBeenCalled();
    //     expect(mouseEventSpy).toHaveBeenCalledWith(event);
    // });

    it(" should call the tool's manager mouse down when receiving a mouse down event if not resizing", () => {
        const event = {
            target: {
                className: 'dummyString',
            },
        };
        const mouseCoord = spyOn(component, 'mouseCoord').and.stub();
        component.onMouseDown(event as any);
        expect(toolManagerSpy.onMouseDown).toHaveBeenCalled();
        expect(toolManagerSpy.onMouseDown).toHaveBeenCalledWith(event as any, mouseCoord(event as any));
    });

    // it(" should not call the tool's manager mouse down when receiving a mouse down event if resizing", () => {
    //     const event = {} as MouseEvent;
    //     const mouseEventSpy = spyOn(toolManagerSpy, 'onMouseDown').and.callThrough();
    //     component.onMouseDown(event);
    //     expect(mouseEventSpy).toHaveBeenCalled();
    //     expect(mouseEventSpy).toHaveBeenCalledWith(event, { x: event.offsetX, y: event.offsetY });
    // });

    // it(" should call the tool's mouse up when receiving a mouse up event", () => {
    //     component['toolManagerService'].currentTool = rectangleSpy;
    //     const event = {
    //         target: {
    //             className: 'dummyString',
    //         },
    //         offsetX: 25,
    //         offsetY: 25,
    //     };
    //     //const mouseEventSpy = spyOn<any>(rectangleSpy, 'onMouseUp').and.callThrough();
    //     component.onMouseUp(event as any);
    //     // expect(mouseEventSpy).toHaveBeenCalled();
    //     //3expect(component['toolManagerService'].currentTool.mouseCoord.x).toEqual(event.offsetX);
    //     //expect(component['toolManagerService'].currentTool.mouseCoord.y).toEqual(event.offsetY);

    //     //expect(rectangleSpy.onMouseUp).toHaveBeenCalled();
    //     // expect(rectangleSpy.onMouseUp).toHaveBeenCalledWith(event as any);
    // });

    it('should return canvas width', () => {
        const CANVAS_WIDTH = 10;
        component['canvasSize'].x = CANVAS_WIDTH;
        const width = component.width;
        expect(width).toEqual(CANVAS_WIDTH);
    });

    it('should return canvas height', () => {
        const CANVAS_HEIGHT = 25;
        component['canvasSize'].y = CANVAS_HEIGHT;
        const width = component.width;
        expect(width).toEqual(CANVAS_HEIGHT);
    });
});
