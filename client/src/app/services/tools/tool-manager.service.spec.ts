import { TestBed } from '@angular/core/testing';
import { PencilService } from './pencil/pencil-service';
import { ToolManagerService } from './tool-manager.service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be pencilService by default', () => {
        expect(service.currentTool instanceof PencilService).toBeTrue();
    });

    it('should handle hot keys shortcut', () => {});
});
