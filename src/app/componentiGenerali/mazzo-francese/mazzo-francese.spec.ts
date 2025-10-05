import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazzoFrancese } from './mazzo-francese';

describe('MazzoFrancese', () => {
  let component: MazzoFrancese;
  let fixture: ComponentFixture<MazzoFrancese>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazzoFrancese]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MazzoFrancese);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
