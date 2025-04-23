import { TestBed, inject } from '@angular/core/testing';

import { IcotxService } from './icotx.service';

describe('IcotxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcotxService]
    });
  });

  it('should be created', inject([IcotxService], (service: IcotxService) => {
    expect(service).toBeTruthy();
  }));
});
