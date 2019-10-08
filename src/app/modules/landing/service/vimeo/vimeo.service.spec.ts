import { TestBed, inject } from '@angular/core/testing';

import { VimeoService } from './vimeo.service';

describe('VimeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VimeoService]
    });
  });

  it('should be created', inject([VimeoService], (service: VimeoService ) => {
    expect(service).toBeTruthy();
  }));
});
