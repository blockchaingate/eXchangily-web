import { TestBed, inject } from '@angular/core/testing';

import { AppAuthService } from './app-auth.service';

describe('AppAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppAuthService]
    });
  });

  it('should be created', inject([AppAuthService], (service: AppAuthService) => {
    expect(service).toBeTruthy();
  }));
});
