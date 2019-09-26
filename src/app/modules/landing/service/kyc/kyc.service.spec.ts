import { TestBed, inject } from '@angular/core/testing';

import { KycService } from './kyc.service';

describe('KycService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KycService]
    });
  });

  it('should be created', inject([KycService], (service: KycService) => {
    expect(service).toBeTruthy();
  }));
});
