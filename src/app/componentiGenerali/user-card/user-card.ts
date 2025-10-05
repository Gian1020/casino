import { Component, Input, Signal } from '@angular/core';
import { InputUser } from '../../carta-alta/interfacciaCartaAlta/InputUser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCard {
  @Input() inputUser!:Signal<InputUser>;
  
  get nomeUtente(){
    return this.inputUser().nome
  }

  get punteggio(){
    return this.inputUser().punteggio;
  }

  get country(){
    return this.inputUser().country;
  }
}
