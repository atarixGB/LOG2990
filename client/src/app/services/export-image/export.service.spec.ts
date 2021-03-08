import { TestBed } from '@angular/core/testing';
import { ExportService } from '@app/services/export-image/export.service';

// tslint:disabled
fdescribe('ExportService', () => {
    let service: ExportService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Initial name is mon-dessin', () => {
        expect(service.drawingTitle).toEqual('mon-dessin');
    });

    it('Initial current drawing is null', () => {
        expect(service.currentDrawing).toEqual('');
    });

    it('Initial current format is png', () => {
        expect(service.currentImageFormat).toEqual('png');
    });

    it('Initial current filter is none', () => {
        expect(service.currentFilter).toEqual('none');
    });

    it('Initial filter intensity is 50', () => {
        expect(service.filterIntensity).toEqual(50);
    });
});
