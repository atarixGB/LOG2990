import { TestBed } from '@angular/core/testing';
import { ToolList } from '@app/constants';
import { PencilService } from './pencil/pencil-service';
import { RectangleService } from './rectangle/rectangle.service';
import { ToolManagerService } from './tool-manager.service';

import SpyObj = jasmine.SpyObj;

//tslint:disable
fdescribe('ToolManagerService', () => {
    let service: ToolManagerService;
    let RectangleServiceSpy: SpyObj<RectangleService>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
        RectangleServiceSpy = jasmine.createSpyObj('RectangleService', [
            'handleKeyDown',
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseClick',
            'onMouseDoubleClick',
            'handleKeyUp',
        ]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be pencilService by default', () => {
        expect(service.currentTool instanceof PencilService).toBeTrue();
    });

    it('should call mouse move of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseMove(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseMove).toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseMove).toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).toEqual(mouseCoord);
    });

    it('should not call mouse move of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseMove(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseMove).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseMove).not.toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).not.toEqual(mouseCoord);
    });

    it('should call mouse down of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseDown(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseDown).toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseDown).toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).toEqual(mouseCoord);
    });

    it('should not call mouse down of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseDown(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseDown).not.toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).not.toEqual(mouseCoord);
    });

    it('should call mouse up of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseUp(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseUp).toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseUp).toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).toEqual(mouseCoord);
    });

    it('should not call mouse up of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as MouseEvent;
        const mouseCoord = { x: 25, y: 25 };
        service.onMouseUp(event, mouseCoord);
        expect(RectangleServiceSpy.onMouseUp).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseUp).not.toHaveBeenCalledWith(event);
        expect(RectangleServiceSpy.mouseCoord).not.toEqual(mouseCoord);
    });

    it('should call mouse click of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as MouseEvent;
        service.onMouseClick(event);
        expect(RectangleServiceSpy.onMouseClick).toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseClick).toHaveBeenCalledWith(event);
    });

    it('should not call mouse click of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as MouseEvent;
        service.onMouseClick(event);
        expect(RectangleServiceSpy.onMouseClick).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseClick).not.toHaveBeenCalledWith(event);
    });

    it('should call mouse double click of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as MouseEvent;
        service.onMouseDoubleClick(event);
        expect(RectangleServiceSpy.onMouseDoubleClick).toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseDoubleClick).toHaveBeenCalledWith(event);
    });

    it('should not call mouse double click of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as MouseEvent;
        service.onMouseDoubleClick(event);
        expect(RectangleServiceSpy.onMouseDoubleClick).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.onMouseDoubleClick).not.toHaveBeenCalledWith(event);
    });

    it('should call handle key up of current tool if tool is not undefine', () => {
        service.currentTool = RectangleServiceSpy;
        const event = {} as KeyboardEvent;
        service.handleKeyUp(event);
        expect(RectangleServiceSpy.handleKeyUp).toHaveBeenCalled();
        expect(RectangleServiceSpy.handleKeyUp).toHaveBeenCalledWith(event);
    });

    it('should not call mouse double click of current tool if tool is undefine', () => {
        service.currentTool = undefined;
        const event = {} as KeyboardEvent;
        service.handleKeyUp(event);
        expect(RectangleServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.handleKeyUp).not.toHaveBeenCalledWith(event);
    it('should handle hot keys shortcut if tool defined and correct KeyboardEvent', () => {
        service.currentTool = RectangleServiceSpy;
        const keyMock = { key: 'Shift' } as KeyboardEvent;

        const switchToolWithKeysSpy = spyOn(service, 'switchToolWithKeys');

        service.handleHotKeysShortcut(keyMock);

        expect(service.currentTool).toBeDefined();
        expect(RectangleServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(RectangleServiceSpy.handleKeyDown).toHaveBeenCalledWith(keyMock);
        expect(switchToolWithKeysSpy).not.toHaveBeenCalled();
    });

    it('should not handle hot keys shortcut if tool defined and incorrect KeyboardEvent', () => {
        service.currentTool = RectangleServiceSpy;
        const keyMock = { key: 'undefined' } as KeyboardEvent;

        const switchToolWithKeysSpy = spyOn(service, 'switchToolWithKeys');

        service.handleHotKeysShortcut(keyMock);

        expect(RectangleServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.handleKeyDown).not.toHaveBeenCalledWith(keyMock);
        expect(switchToolWithKeysSpy).toHaveBeenCalled();
    });

    it('should not handle hot keys shortcut if tool not defined and correct KeyboardEvent', () => {
        service.currentTool = undefined;
        const keyMock = { key: 'undefined' } as KeyboardEvent;

        const switchToolWithKeysSpy = spyOn(service, 'switchToolWithKeys');

        service.handleHotKeysShortcut(keyMock);

        expect(RectangleServiceSpy.handleKeyDown).not.toHaveBeenCalled();
        expect(RectangleServiceSpy.handleKeyDown).not.toHaveBeenCalledWith(keyMock);
        expect(switchToolWithKeysSpy).toHaveBeenCalled();
    });

    it('switchToolWithKeys should switch tool if valid keyShortcut', () => {
        let shortcut = 'c';
        service.currentTool = RectangleServiceSpy;

        service.switchToolWithKeys(shortcut);

        expect(service.currentToolEnum).toEqual(ToolList.Pencil);
        expect(service.currentTool).toBeInstanceOf(PencilService);
    });

    it('switchToolWithKeys should switch tool if valid keyShortcut', () => {
        let shortcut = 'y';
        service.currentTool = RectangleServiceSpy;

        service.switchToolWithKeys(shortcut);

        expect(service.currentToolEnum).not.toEqual(ToolList.Rectangle);
        expect(service.currentTool).not.toBeInstanceOf(RectangleService);
    });

    it('switchTool should switch tool if valid tool', () => {
        let newTool = ToolList.Rectangle;
        service.currentTool = undefined;

        service.switchTool(newTool);

        expect(service.currentToolEnum).toEqual(ToolList.Rectangle);
        expect(service.currentTool).toBeInstanceOf(RectangleService);
    });

    it('switchTool should not switch tool if invalid tool', () => {
        service.currentTool = RectangleServiceSpy;
        service.currentToolEnum = ToolList.Rectangle;

        let getSpy = spyOn(service.serviceBindings, 'get');

        service.switchTool(5);

        expect(getSpy).not.toHaveBeenCalled();
        expect(service.currentToolEnum).toEqual(ToolList.Rectangle);
        expect(service.currentTool).toEqual(RectangleServiceSpy);
    });
});
