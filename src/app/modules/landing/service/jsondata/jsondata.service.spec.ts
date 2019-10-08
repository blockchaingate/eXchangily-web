import { TestBed, inject } from '@angular/core/testing';

import { JsondataService } from './jsondata.service';

describe('JsondataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsondataService]
    });
  });

  it('should be created', inject([JsondataService], (service: JsondataService) => {
    expect(service).toBeTruthy();
  }));
});
