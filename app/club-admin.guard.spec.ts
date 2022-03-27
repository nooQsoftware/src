import { TestBed } from '@angular/core/testing';

import { ClubAdminGuard } from './club-admin.guard';

describe('ClubAdminGuard', () => {
  let guard: ClubAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClubAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
