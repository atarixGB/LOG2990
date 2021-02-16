import { TestBed } from '@angular/core/testing';
import { LineService } from './line/line.service';
import { PencilService } from './pencil/pencil-service';
import { ToolManagerService } from './tool-manager.service';

import SpyObj = jasmine.SpyObj;

fdescribe('ToolManagerService', () => {
    let service: ToolManagerService;
    let lineServiceSpy: SpyObj<LineService>;
    // let lineServiceStub: LineService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
        // lineServiceStub = new LineService();
        lineServiceSpy = jasmine.createSpyObj('LineService', ['handleKeyDown']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be pencilService by default', () => {
        expect(service.currentTool instanceof PencilService).toBeTrue();
    });

    it('should handle hot keys shortcut', () => {
        service.currentTool = service.currentTool as LineService;
        const keyMock = { key: 'Shift' } as KeyboardEvent;
        service.handleHotKeysShortcut(keyMock);
        expect(service.currentTool).toBeDefined();
        expect(lineServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(lineServiceSpy.handleKeyDown).toHaveBeenCalledWith(keyMock);
    });
});
