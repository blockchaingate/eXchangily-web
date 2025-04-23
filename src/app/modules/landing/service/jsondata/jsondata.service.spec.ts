import { TestBed, inject } from '@angular/core/testing';

import { JsonFileService } from './jsondata.service';

describe('JsondataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonFileService]
    });
  });

  it('should be created', inject([JsonFileService], (service: JsonFileService) => {
    expect(service).toBeTruthy();
  }));
});
