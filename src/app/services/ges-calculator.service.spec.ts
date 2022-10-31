import { TestBed } from '@angular/core/testing';

import { GesCalculatorService } from './ges-calculator.service';

describe('GesCalculatorService', () => {
  let service: GesCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GesCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
