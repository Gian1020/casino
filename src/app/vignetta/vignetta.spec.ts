import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vignetta } from './vignetta';

describe('Vignetta', () => {
  let component: Vignetta;
  let fixture: ComponentFixture<Vignetta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vignetta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vignetta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
