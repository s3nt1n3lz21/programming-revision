import { TestBed } from '@angular/core/testing';

import { APICacheInterceptor } from './apicache.interceptor';

describe('APICacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      APICacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: APICacheInterceptor = TestBed.inject(APICacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
