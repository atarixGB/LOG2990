import { TestBed } from '@angular/core/testing';

import { SelectionUtilsService } from './selection-utils.service';

describe('SelectionUtilsService', () => {
  let service: SelectionUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
