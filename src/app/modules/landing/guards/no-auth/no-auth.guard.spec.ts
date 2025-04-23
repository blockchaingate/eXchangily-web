import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoAuthGuard]
    });
  });

  it('should ...', inject([NoAuthGuard], (guard: NoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
