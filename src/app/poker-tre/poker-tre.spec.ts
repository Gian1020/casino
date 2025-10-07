import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerTre } from './poker-tre';

describe('PokerTre', () => {
  let component: PokerTre;
  let fixture: ComponentFixture<PokerTre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokerTre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokerTre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
