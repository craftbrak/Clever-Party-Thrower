import { TestBed } from '@angular/core/testing';

import { EcarInterceptor } from './ecar.interceptor';

describe('EcarInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EcarInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EcarInterceptor = TestBed.inject(EcarInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
