import { TestBed } from '@angular/core/testing';

import { EventInterceptor } from './event.interceptor';

describe('EventInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EventInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EventInterceptor = TestBed.inject(EventInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
