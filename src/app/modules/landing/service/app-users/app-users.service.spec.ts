import { TestBed, inject } from '@angular/core/testing';

import { AppUsersService } from './app-users.service';

describe('AppUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppUsersService]
    });
  });

  it('should be created', inject([AppUsersService], (service: AppUsersService) => {
    expect(service).toBeTruthy();
  }));
});
