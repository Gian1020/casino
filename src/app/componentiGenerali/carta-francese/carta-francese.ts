import { Component, effect, Input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputCarta } from '../../carta-alta/interfacciaCartaAlta/InputCarta';

@Component({
  selector: 'app-carta-francese',
  imports: [FormsModule],
  templateUrl: './carta-francese.html',
  styleUrl: './carta-francese.css'
})
export class CartaFrancese {

  @Input() inputCarta!:Signal<InputCarta>;
  
  get codeGiocatore(): string {
    return this.inputCarta().numero! + this.inputCarta().seme!;
  }

  get numeroCartaStringa(): string {
    return this.inputCarta().numero;
  }

  get numeroCartaInt(): number{
    return Number(this.inputCarta().numero);
  }
}

