import { TestBed } from '@angular/core/testing';

import { ServerAuthInterceptor } from './server-auth.interceptor';

describe('ServerAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ServerAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ServerAuthInterceptor = TestBed.inject(ServerAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
