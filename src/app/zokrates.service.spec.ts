import { TestBed } from '@angular/core/testing';

import { ZokratesService } from './zokrates.service';

describe('ZokratesService', () => {
  let service: ZokratesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZokratesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
