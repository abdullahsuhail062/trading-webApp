import { TestBed } from '@angular/core/testing';

import { GoldPriceService } from './gold-price.service.js';

describe('GoldPriceServiceTs', () => {
  let service: GoldPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
