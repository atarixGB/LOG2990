// import { CdkDrag } from '@angular/cdk/drag-drop';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { LineService } from '@app/services/tools/line/line.service';
// import { DrawingComponent } from './drawing.component';

// //tslint:disable
// describe('DrawingComponent', () => {
//     let component: DrawingComponent;
//     let fixture: ComponentFixture<DrawingComponent>;
//     let toolStub: ToolStub;
//     let drawingStub: DrawingService;

//     beforeEach(async(() => {
//         toolStub = new ToolStub({} as DrawingService);
//         drawingStub = new DrawingService();

//         TestBed.configureTestingModule({
//             declarations: [DrawingComponent, MatDialog],
//             providers: [{ provide: DrawingService, useValue: drawingStub }, { provide: LineService, useValue: toolStub }, MatDialog, CdkDrag],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DrawingComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     teste si moitie de work area
//     it('should have a default WIDTH and HEIGHT', () => {
//         const height = component.height;
//         const width = component.width;
//         expect(height).toEqual(DEFAULT_HEIGHT);
//         expect(width).toEqual(DEFAULT_WIDTH);
//     });

//     fit(" should call the tool's mouse move when receiving a mouse move event", () => {
//         const event = {} as MouseEvent;
//         const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
//         component.onMouseMove(event);
//         expect(mouseEventSpy).toHaveBeenCalled();
//         expect(mouseEventSpy).toHaveBeenCalledWith(event);
//     });

//     it(" should call the tool's mouse down when receiving a mouse down event", () => {
//         const event = {} as MouseEvent;
//         const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
//         component.onMouseDown(event);
//         expect(mouseEventSpy).toHaveBeenCalled();
//         expect(mouseEventSpy).toHaveBeenCalledWith(event);
//     });

//     it(" should call the tool's mouse up when receiving a mouse up event", () => {
//         const event = {} as MouseEvent;
//         //const;
//         const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
//         component.onMouseUp(event);
//         expect(mouseEventSpy).toHaveBeenCalled();
//         expect(mouseEventSpy).toHaveBeenCalledWith(event);
//     });

//     it('should return canvas width', () => {
//         const CANVAS_WIDTH = 10;
//         const canvasSpy = spyOn<any>(component, 'witdh').and.callThrough();
//         component['canvasSize'].x = CANVAS_WIDTH;
//         expect(canvasSpy).toBe(CANVAS_WIDTH);
//     });
// });
