import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { InputMazzo } from '../../carta-alta/interfacciaCartaAlta/InputMazzo';


@Component({
  selector: 'app-mazzo-francese',
  imports: [],
  templateUrl: './mazzo-francese.html',
  styleUrls: ['./mazzo-francese.css']
})
export class MazzoFrancese {
  @Output() servi = new EventEmitter<void>();
  @Input() inputMazzo!:WritableSignal<InputMazzo>;
  
  get contatoreClick(){
    return this.inputMazzo().contatoreClick;
  }

  get arrCarteSfoltireMazzo(){
    return this.inputMazzo().arrCarteSfoltireMazzo;
  }

  get valoreBloccoClick(){
    return this.inputMazzo().valoreBloccoClick;
  }

  get lunghezzaMazzo(){
    return this.inputMazzo().lunghezzaMazzo;
  }


  chiediCarte(){
    this.servi.emit();
  }}
