import { TestBed } from '@angular/core/testing';

import { UsersList } from './users-list';

describe('UsersList', () => {
  let service: UsersList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
