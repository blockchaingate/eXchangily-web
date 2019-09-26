import { TestBed, inject } from '@angular/core/testing';

import { IcotxesAuthService } from './icotxes-auth.service';

describe('IcotxesAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcotxesAuthService]
    });
  });

  it('should be created', inject([IcotxesAuthService], (service: IcotxesAuthService) => {
    expect(service).toBeTruthy();
  }));
});
