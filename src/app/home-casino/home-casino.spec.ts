import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCasino } from './home-casino';

describe('HomeCasino', () => {
  let component: HomeCasino;
  let fixture: ComponentFixture<HomeCasino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCasino]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCasino);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
