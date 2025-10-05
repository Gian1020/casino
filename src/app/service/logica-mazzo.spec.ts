import { TestBed } from '@angular/core/testing';

import { LogicaMazzo } from './logica-mazzo';

describe('LogicaMazzo', () => {
  let service: LogicaMazzo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicaMazzo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
