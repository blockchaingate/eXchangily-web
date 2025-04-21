/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BannerService } from './banner.service';

describe('Service: Banner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BannerService]
    });
  });

  it('should ...', inject([BannerService], (service: BannerService) => {
    expect(service).toBeTruthy();
  }));
});
