import { TestBed } from '@angular/core/testing';

import { ExportService } from '@app/services/export-image/export.service';

// tslint:disabled
describe('ExportService', () => {
    let service: ExportService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
