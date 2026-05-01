import { TestBed } from '@angular/core/testing';

import { GoldDataService } from './gold-data.service';

describe('GoldDataService', () => {
  let service: GoldDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
