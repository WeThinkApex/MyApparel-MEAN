import { TestBed } from '@angular/core/testing';

import { ResuableService } from './resuable.service';

describe('ResuableService', () => {
  let service: ResuableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResuableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
