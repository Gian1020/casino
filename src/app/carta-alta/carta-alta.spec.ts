import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaAlta } from './carta-alta';

describe('CartaAlta', () => {
  let component: CartaAlta;
  let fixture: ComponentFixture<CartaAlta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaAlta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaAlta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
