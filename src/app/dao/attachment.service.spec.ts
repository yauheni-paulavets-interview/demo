import { TestBed, inject } from '@angular/core/testing';

import { AttachmentDao } from './attachment.service';

describe('AttachmentDao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachmentDao]
    });
  });

  it('should be created', inject([AttachmentDao], (service: AttachmentDao) => {
    expect(service).toBeTruthy();
  }));
});
