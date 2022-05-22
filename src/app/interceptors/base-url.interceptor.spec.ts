import { TestBed } from '@angular/core/testing';

import { BaseURLInterceptor } from './base-url.interceptor';

describe('BaseURLInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseURLInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BaseURLInterceptor = TestBed.inject(BaseURLInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
