import { TestBed } from '@angular/core/testing';
import { PencilService } from './pencil/pencil-service';
import { RectangleService } from './rectangle/rectangle.service';
import { ToolManagerService } from './tool-manager.service';

import SpyObj = jasmine.SpyObj;

fdescribe('ToolManagerService', () => {
    let service: ToolManagerService;
    let RectangleServiceSpy: SpyObj<RectangleService>;
    // let lineServiceStub: LineService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
        // lineServiceStub = new LineService();
        RectangleServiceSpy = jasmine.createSpyObj('Rectangle', ['handleKeyDown']);
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

    fit('should not handle hot keys shortcut if tool defined and incorrect KeyboardEvent', () => {
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
});
