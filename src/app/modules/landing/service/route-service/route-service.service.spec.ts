import { TestBed, inject } from '@angular/core/testing';

import { RouteServiceService } from './route-service.service';

describe('RouteServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteServiceService]
    });
  });

  it('should be created', inject([RouteServiceService], (service: RouteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
