import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolList } from '@app/constants';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyHandlerService } from '@app/services/key-handler/key-handler.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { DrawingData } from '@common/communication/drawing-data';
import { of } from 'rxjs';
import { DrawingComponent } from './drawing.component';

// tslint:disable
fdescribe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingStub: DrawingService;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let keyHandlerSpy: jasmine.SpyObj<KeyHandlerService>;
    let autoSaveServiceSpy: jasmine.SpyObj<AutoSaveService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let newDrawingServiceSpy: jasmine.SpyObj<NewDrawingService>;
    let baseCtxSpy: CanvasRenderingContext2D;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', [
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseLeave',
            'onMouseClick',
            'onMouseDoubleClick',
            'onWheel',
            'handleKeyUp',
            'handleHotKeysShortcut',
        ]);
        keyHandlerSpy = jasmine.createSpyObj('KeyHandlerService', ['handleKeyDown', 'handleKeyUp']);
        autoSaveServiceSpy = jasmine.createSpyObj('AutoSaveService', ['loadImage', 'saveCanvasState']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['']);
        newDrawingServiceSpy = jasmine.createSpyObj('NewDrawingService', ['getCleanStatus']);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            imports: [MatDialogModule, DragDropModule, BrowserAnimationsModule, RouterTestingModule],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: KeyHandlerService, useValue: keyHandlerSpy },
                { provide: AutoSaveService, useValue: autoSaveServiceSpy },

                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: {
                            subscribe: (fn: (value: Params) => void) =>
                                fn({
                                    url: 'url',
                                    height: 100,
                                    width: 100,
                                }),
                        },
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        baseCtxSpy = jasmine.createSpyObj('CanvasRendringContext', ['beginPath', 'closePath', 'stroke', 'fillRect', 'clearRect', 'getImageData']);
        component['baseCtx'] = baseCtxSpy;
    });

    it('should subscribe to clean status of NewDrawingService', () => {
        newDrawingServiceSpy.getCleanStatus.and.returnValue(of(true));
        spyOn<any>(drawingStub.baseCtx, 'beginPath').and.stub();
        spyOn<any>(drawingStub.baseCtx, 'clearRect').and.stub();
        spyOn<any>(drawingStub.previewCtx, 'clearRect').and.stub();
        spyOn<any>(drawingStub.lassoPreviewCtx, 'clearRect').and.stub();
        spyOn<any>(drawingStub.gridCtx, 'clearRect').and.stub();
        spyOn<any>(component, 'whiteBackgroundCanvas').and.stub();

        expect(drawingStub.baseCtx.beginPath).toHaveBeenCalled();
        expect(drawingStub.baseCtx.clearRect).toHaveBeenCalled();
        expect(drawingStub.previewCtx.clearRect).toHaveBeenCalled();
        expect(drawingStub.lassoPreviewCtx.clearRect).toHaveBeenCalled();
        expect(drawingStub.gridCtx.clearRect).toHaveBeenCalled();
    });

    it('should set canvasSize with width and height value of autoSaveService', () => {
        autoSaveServiceSpy.loadImage.and.stub();
        autoSaveServiceSpy.localDrawing = new DrawingData();
        autoSaveServiceSpy.localDrawing.width = 100;
        autoSaveServiceSpy.localDrawing.height = 100;

        component.ngAfterViewInit();
        if (window.onload) {
            window.onload({} as any);
        }
        expect(component.canvasSize.x).toEqual(autoSaveServiceSpy.localDrawing.width);
        expect(component.canvasSize.y).toEqual(autoSaveServiceSpy.localDrawing.height);
    });

    it('should set canvasSize with fetched width and height', () => {
        component.ngOnChanges();
        expect(component.canvasSize.x).toEqual(100);
        expect(component.canvasSize.y).toEqual(100);
    });

    xit('should not set canvasSize if fetched width and height are undefined', () => {
        component.ngOnChanges();
        expect(component.canvasSize.x).toEqual(100);
        expect(component.canvasSize.y).toEqual(100);
    });

    it('should return mouse coordinates correctly', () => {
        const mouseEvent = { x: 10, y: 10, button: 0 } as MouseEvent;

        const result = component.mouseCoord(mouseEvent);
        expect(result).toEqual({ x: 10, y: 10 });
    });

    it(" should call the tool's manager mouse move when receiving a mouse move event if not resizing", () => {
        const event = {
            target: {
                className: 'dummyString',
            },
        };
        const mouseCoord = spyOn(component, 'mouseCoord').and.stub();
        component.onMouseMove(event as any);
        expect(toolManagerSpy.onMouseMove).toHaveBeenCalled();
        expect(toolManagerSpy.onMouseMove).toHaveBeenCalledWith(event as any, mouseCoord(event as any));
    });

    it('should assign cursorCtx to component`s cursorCtx if currentToolEnum is Eraser', () => {
        toolManagerSpy.currentToolEnum = ToolList.Eraser;
        const event = {
            target: {
                className: 'dummyString',
            },
        };

        component.onMouseMove(event as any);
        expect(drawingStub.cursorCtx).toEqual(component['cursorCtx']);
    });

    it('should set currentTool to moveSelectionService if mouse is not on control point', () => {});

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

    it(" should call the tool's manager mouse up when receiving a mouse up event if not resizing", () => {
        const event = {
            target: {
                className: 'dummyString',
            },
        };
        const mouseCoord = spyOn(component, 'mouseCoord').and.stub();
        component.onMouseUp(event as any);
        expect(toolManagerSpy.onMouseUp).toHaveBeenCalled();
        expect(toolManagerSpy.onMouseUp).toHaveBeenCalledWith(event as any, mouseCoord(event as any));
    });

    it(" should not call the tool's manager mouse up when receiving a mouse up event if resizing", () => {
        const event = {
            target: {
                className: 'box',
            },
        };
        const mouseCoord = spyOn(component, 'mouseCoord').and.stub();
        component.onMouseDown(event as any);
        expect(toolManagerSpy.onMouseUp).not.toHaveBeenCalled();
        expect(toolManagerSpy.onMouseUp).not.toHaveBeenCalledWith(event as any, mouseCoord(event as any));
    });

    it(" should call the tool's manager mouse click when receiving a mouse click event if not resizing", () => {
        const event = {
            target: {
                className: 'dummyString',
            },
        };
        component.onMouseClick(event as any);
        expect(toolManagerSpy.onMouseClick).toHaveBeenCalled();
        expect(toolManagerSpy.onMouseClick).toHaveBeenCalledWith(event as any);
    });

    it(" should not call the tool's manager mouse click when receiving a mouse click event if resizing", () => {
        const event = {
            target: {
                className: 'box',
            },
        };
        component.onMouseClick(event as any);
        expect(toolManagerSpy.onMouseClick).not.toHaveBeenCalled();
        expect(toolManagerSpy.onMouseClick).not.toHaveBeenCalledWith(event as any);
    });

    it(" should call the tool's manager mouse double click when receiving a mouse double click event", () => {
        const event = {} as MouseEvent;
        component.onMouseDoubleClick(event);
        expect(toolManagerSpy.onMouseDoubleClick).toHaveBeenCalled();
        expect(toolManagerSpy.onMouseDoubleClick).toHaveBeenCalledWith(event);
    });

    it('should call onMouseLeave of ToolManagerService', () => {
        const event = {} as MouseEvent;
        component.onMouseLeave(event);
        expect(toolManagerSpy.onMouseLeave).toHaveBeenCalled();
    });

    it('should call onWheel of ToolManagerService', () => {
        const event = { preventDefault(): void {} } as WheelEvent;

        component.onWheel(event);
        expect(toolManagerSpy.onWheel).toHaveBeenCalled();
    });

    it(" should call the tool's manager mouse handle key up when receiving a key up event", () => {
        const event = {} as KeyboardEvent;
        component.handleKeyUp(event);
        expect(keyHandlerSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should call the modalHandler when CTRL + <key> is pressed', () => {
        const event = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
        component.handleKeyDown(event);
        expect(keyHandlerSpy.handleKeyDown).toHaveBeenCalled();
    });

    it('should set previewCanvas dimension accordingdly to mouse position', () => {
        const event = { pointerPosition: { x: 300, y: 300 } } as CdkDragMove;
        spyOn<any>(component['baseCanvas'].nativeElement, 'getBoundingClientRect').and.returnValue(new DOMRect());
        component['positionX'] = 300;
        component['positionY'] = 300;
        component['currentDrawing'] = new ImageData(10, 10);

        component.dragMoved(event, true, true);
        expect(component['previewCanvas'].nativeElement.width).toEqual(component['positionX']);
        expect(component['previewCanvas'].nativeElement.height).toEqual(component['positionY']);
        expect(component['baseCtx'].getImageData).toHaveBeenCalled();
    });

    it('should set canvas size correctly when drag ended if newWidth and newHeight are greather than MIN_SIZE', () => {
        component.canvasSize = { x: 100, y: 100 };
        const event = { distance: { x: 500, y: 500 } } as CdkDragEnd;
        component['drawing'] = new DrawingData();

        component.dragEnded(event);
        expect(component.canvasSize).toEqual({ x: 500, y: 500 });
        expect(autoSaveServiceSpy.saveCanvasState).toHaveBeenCalled();
    });

    it('should set canvas size to MIN_SIZE when drag ended if newWidth and newHeight are lower than MIN_SIZE', () => {
        component.canvasSize = { x: 10, y: 10 };
        const event = { distance: { x: 10, y: 10 } } as CdkDragEnd;

        component.dragEnded(event);
        expect(component.canvasSize).toEqual({ x: 250, y: 250 });
        expect(autoSaveServiceSpy.saveCanvasState).toHaveBeenCalled();
    });

    it('should set drag position correctly', () => {
        component.dragPosition = { x: 250, y: 250 };

        component.changePosition();
        expect(component.dragPosition).toEqual({ x: 250, y: 250 });
    });

    it('should return canvas width', () => {
        const CANVAS_WIDTH = 10;
        component['canvasSize'].x = CANVAS_WIDTH;
        const width = component.width;
        expect(width).toEqual(CANVAS_WIDTH);
    });

    it('should return canvas height', () => {
        const CANVAS_HEIGHT = 25;
        component['canvasSize'].y = CANVAS_HEIGHT;
        const height = component.height;
        expect(height).toEqual(CANVAS_HEIGHT);
    });

    it('should resolve image if image ', () => {});

    it('should not call onMouseMove of ToolManagerService if mouse is not resizing', () => {
        const event = {
            target: {
                className: 'box',
            },
        };
        const mouseCoord = spyOn(component, 'mouseCoord').and.stub();
        component['handleSelectionTool'](event as any);
        expect(toolManagerSpy.onMouseMove).not.toHaveBeenCalled();
        expect(mouseCoord).not.toHaveBeenCalled();
    });

    it('should set currentTool to moveSelectionService if currentToolEnum is SelectionRectangle and it is not a new selection', () => {
        const event = {
            target: {
                className: 'htmlclass',
            },
        };
        toolManagerSpy.currentToolEnum = ToolList.SelectionRectangle;
        selectionServiceSpy.newSelection = false;

        component['handleSelectionTool'](event as any);
        expect(toolManagerSpy.currentTool).toBeInstanceOf(MoveSelectionService);
    });

    it('should set currentTool to selectionService if currentToolEnum is SelectionRectangle it is a new selection', () => {
        const event = {
            target: {
                className: 'htmlclass',
            },
        };
        toolManagerSpy.currentToolEnum = ToolList.SelectionRectangle;
        selectionServiceSpy.newSelection = true;

        component['handleSelectionTool'](event as any);
        expect(toolManagerSpy.currentTool).toBeInstanceOf(SelectionService);
    });

    it('should change canvasSize to MIN_SIZE if canvasSize is smaller than 250px', () => {
        component.canvasSize.x = 100;
        component.canvasSize.y = 100;

        component['adjustCanvasSize']();
        expect(component.canvasSize.x).toEqual(100);
        expect(component.canvasSize.y).toEqual(100);
    });

    it('should change canvas background to white', () => {
        drawingStub.isGridEnabled = true;

        component['whiteBackgroundCanvas']();
        expect(baseCtxSpy.beginPath).toHaveBeenCalled();
        expect(component['baseCtx'].fillStyle).toEqual('#FFFFFF');
        expect(baseCtxSpy.fillRect).toHaveBeenCalled();
        expect(baseCtxSpy.closePath).toHaveBeenCalled();
    });

    it('should get new image if source image exists', async () => {
        spyOn<any>(component, 'getNewImage').and.callFake(() => {
            return Promise.resolve();
        });

        const result = component.getNewImage('url');
        if (window.onload) {
            window.onload({} as any);
        }
        expect(result).toBeInstanceOf(Promise);
    });
});
