import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaFrancese } from './carta-francese';

describe('CartaFrancese', () => {
  let component: CartaFrancese;
  let fixture: ComponentFixture<CartaFrancese>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaFrancese]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaFrancese);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
