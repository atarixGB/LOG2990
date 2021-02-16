import { TestBed } from '@angular/core/testing';
import { ToolList } from '@app/constants';
import { PencilService } from './pencil/pencil-service';
import { RectangleService } from './rectangle/rectangle.service';
import { ToolManagerService } from './tool-manager.service';

import SpyObj = jasmine.SpyObj;

//tslint:disable
describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let RectangleServiceSpy: SpyObj<RectangleService>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
        RectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['handleKeyDown']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be pencilService by default', () => {
        expect(service.currentTool instanceof PencilService).toBeTrue();
    });

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

        expect(service.currentTool).toBeInstanceOf(PencilService);
    });

    it('switchToolWithKeys should switch tool if valid keyShortcut', () => {
        let shortcut = 'y';
        service.currentTool = RectangleServiceSpy;

        service.switchToolWithKeys(shortcut);

        expect(service.currentTool).not.toBeInstanceOf(RectangleService);
    });

    it('switchTool should switch tool if valid tool', () => {
        let newTool = ToolList.Rectangle;
        service.currentTool = undefined;

        service.switchTool(newTool);

        expect(service.currentTool).toBeInstanceOf(RectangleService);
    });

    it('switchTool should not switch tool if invalid tool', () => {
        service.currentTool = RectangleServiceSpy;

        let getSpy = spyOn(service.serviceBindings, 'get');

        service.switchTool(5);

        expect(getSpy).not.toHaveBeenCalled();
        expect(service.currentTool).toEqual(RectangleServiceSpy);
    });
});
