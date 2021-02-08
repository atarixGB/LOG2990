import { TestBed } from '@angular/core/testing';

import { LineStyleService } from './line-style.service';

describe('LineStyleService', () => {
  let service: LineStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
