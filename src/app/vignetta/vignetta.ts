import { Component, Input, Signal } from '@angular/core';
import { InputVignetta } from '../carta-alta/interfacciaCartaAlta/InputVignetta';

@Component({
  selector: 'app-vignetta',
  imports: [],
  templateUrl: './vignetta.html',
  styleUrl: './vignetta.css'
})
export class Vignetta {
  @Input() inputVignetta!:Signal<InputVignetta>;

  get commento (){
    return this.inputVignetta().commento;
  }
}
