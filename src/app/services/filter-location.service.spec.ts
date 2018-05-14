import { TestBed, inject } from '@angular/core/testing';

import { FilterLocationService } from './filter-location.service';

describe('FilterLocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterLocationService]
    });
  });

  it('should be created', inject([FilterLocationService], (service: FilterLocationService) => {
    expect(service).toBeTruthy();
  }));
});
