import { Component, inject, signal } from '@angular/core';
import type { WritableSignal } from '@angular/core';
import { Card } from '../interfacciaGenerale/Card';
import { CartaFrancese } from '../componentiGenerali/carta-francese/carta-francese';
import { MazzoFrancese } from "../componentiGenerali/mazzo-francese/mazzo-francese";
import { LogicaMazzo } from '../service/logica-mazzo';
import { InputCarta } from './interfacciaCartaAlta/InputCarta';
import { InputMazzo } from './interfacciaCartaAlta/InputMazzo';
import { UserCard } from "../componentiGenerali/user-card/user-card";
import { InputUser } from './interfacciaCartaAlta/InputUser';
import { Router } from '@angular/router';
import { InputVignetta } from './interfacciaCartaAlta/InputVignetta';
import { Vignetta } from "../vignetta/vignetta";

@Component({
  selector: 'app-carta-alta',
  imports: [CartaFrancese, MazzoFrancese, UserCard, Vignetta],
  templateUrl: './carta-alta.html',
  styleUrl: './carta-alta.css'
})
export class CartaAlta {

  //carte Utente
  cartaUtente: Card[] = [];
  punteggio1: number = 0;
  //var comunicazione con il componente app-carta-francese
  utenteSignalCartaAlta: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: '' });

  //carte Pc
  cartaPc: Card[] = [];
  punteggio2: number = 0;
  //var comunicazione con il componente app-carta-francese
  pcSignalCartaAlta: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: '' });


  //mazzo
  mazzo!: Card[];
  mazzoSignalCartaAlta: WritableSignal<InputMazzo> = signal<InputMazzo>({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], gioco:"cartaAlta"  });
  //sfoltisce mazzo
  contatoreClick: number = 0;
  arrCarteSfoltireMazzo: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  //var per comunicazione con componente app-user-card
  cardUtenteSignalCartaAlta: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER", punteggio: this.punteggio1, country: "Italy" });
  cardPcSignalCartaAlta: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER_PC", punteggio: this.punteggio2, country: "Space" });
  cardDrowSignalCartaAlta: WritableSignal<InputUser> = signal<InputUser>({ nome: "NoWinner", punteggio: 13, country: "" })
  //vincitore
  flagVincitorePartita: number = 0;

  //vignetta
  commentoVincitoreRound!: string;
  valoreSemeStringa!: string;
  simboliTupla: { [key: string]: string }[] = [{ "S": "♠" }, { "C": "♣" }, { "D": "♦" }, { "H": "♥" }];
  numeri: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  textVignettaSignalCartaAlta: WritableSignal<InputVignetta> = signal<InputVignetta>({ commento: "" })


  //inietta il service accedere alle funzioni di logica mazzo
  constructor(private logicaMazzo: LogicaMazzo) { }

  //utilizza le funzioni di logica mazzo
  ngOnInit() {
    this.logicaMazzo.creaCarte();
    this.logicaMazzo.mischia();
    this.mazzo = [...this.logicaMazzo.mazzo];
  }

  //funzione che serve a distriduire le carte al click del figlio (app-mazzo-francese)
  distribuisciCarta() {
    if (this.mazzo.length === 0) return;
    this.contatoreClick++;

    // carta utente
    const cartaU = this.mazzo.shift()!;
    this.aggiornaUtente(cartaU);
    this.cartaUtente.push(cartaU);

    // carta pc
    const cartaP = this.mazzo.shift()!;
    this.aggiornaPc(cartaP);
    this.cartaPc.push(cartaP);

    this.sfoltisciMazzo();
    this.checkWinnerRound(this.cartaUtente[this.cartaUtente.length - 1], this.cartaPc[this.cartaPc.length - 1]);
    this.aggiornaVignetta()
    this.aggiornaCardUtente();
    this.aggiornaCardPc();
    this.cardDrowSignalCartaAlta;
  }
  //funzione che serve a catturare l evento di click in (app-mazzo-francese)
  daiCarte() {
    this.distribuisciCarta();
  }

  //funzione che serve a aggiornare i valori del utente in figlio (app-carta-francese)
  aggiornaUtente(cartaUtente: Card) {
    this.utenteSignalCartaAlta.set( { numero: cartaUtente.numero , seme: cartaUtente.seme });
  }

  aggiornaPc(cartaPc: Card) {
    this.pcSignalCartaAlta.set({ numero: cartaPc.numero, seme: cartaPc.seme });
  }

  resetUtente() {
    this.utenteSignalCartaAlta.set({ numero: "0", seme: "0"});
  }
  resetPc() {
    this.pcSignalCartaAlta.set({ numero: "0", seme: "0" });
  }
  resetMazzo() {
    this.mazzoSignalCartaAlta.set({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], gioco:"cartaAlta" })
  }

  //funzione che serve a aggiornare i valori del pc in figlio (app-carta-francese)
  aggiornaCardUtente() {
    this.cardUtenteSignalCartaAlta.set({ nome: "USER", punteggio: this.punteggio1, country: "Italy" })
  }

  aggiornaCardPc() {
    this.cardPcSignalCartaAlta.set({ nome: "USER_PC", punteggio: this.punteggio2, country: "Space" })
  }

   resetCardUtente() {
    this.cardUtenteSignalCartaAlta.set({ nome: "USER", punteggio: 0, country: "Italy" })
  }

  resetCardPc() {
    this.cardPcSignalCartaAlta.set({ nome: "USER_PC", punteggio: 0, country: "Space" })
  }

  aggiornaMazzo() {
    this.mazzoSignalCartaAlta.set({ contatoreClick: this.contatoreClick, lunghezzaMazzo: this.mazzo.length, valoreBloccoClick: 0, arrCarteSfoltireMazzo: this.arrCarteSfoltireMazzo, gioco:"cartaAlta"  })
  }

  aggiornaVignetta() {
    this.textVignettaSignalCartaAlta.set({ commento: this.commentoVincitoreRound });
  }

  resetVignetta() {
    this.textVignettaSignalCartaAlta.set({ commento: "" });
  }

  sfoltisciMazzo() {
    if (this.contatoreClick % 2 == 0) {
      this.arrCarteSfoltireMazzo.pop();
      this.aggiornaMazzo();
    }
  }

  checkWinnerRound(carta1: Card, carta2: Card) {

    if (this.numeri.indexOf(carta1.numero) > this.numeri.indexOf(carta2.numero)) {
      this.simboloSeme(carta1);
      this.commentoVincitoreRound = "Ha vinto Utente con ";
      this.punteggio1++;

    }
    else if (this.numeri.indexOf(carta1.numero) === this.numeri.indexOf(carta2.numero)) {
      if (this.getIndice(carta1.seme) > this.getIndice(carta2.seme)) {
        this.simboloSeme(carta1);
        this.commentoVincitoreRound = "Ha vinto Utente con ";
        this.punteggio1++;

      }
      else {
        this.simboloSeme(carta2);
        this.commentoVincitoreRound = "Ha vinto Pc con ";
        this.punteggio2++;

      }
    }
    else {
      this.simboloSeme(carta2);
      this.commentoVincitoreRound = "Ha vinto Pc con ";
      this.punteggio2++;

    }
    this.commentoVincitoreRound += this.valoreSemeStringa;

    if (this.contatoreClick == 26) {
      this.checkWinner();
    }
  }

  getIndice(seme: string): number {
    return this.simboliTupla.findIndex(obj => seme in obj);
  }

  simboloSeme(card: Card) {
    const oggettoSeme = this.simboliTupla.find(obj => card.seme! in obj);
    if (oggettoSeme) {
      this.valoreSemeStringa = `${card.numero}${oggettoSeme[card.seme!]}`;
    }
  }

  checkWinner() {
    if (this.punteggio1 > this.punteggio2) {
      this.flagVincitorePartita = 1;

    }
    else if (this.punteggio1 < this.punteggio2) {
      this.flagVincitorePartita = 2;
    }


    else if ((this.punteggio1 == this.punteggio2)) {
      this.flagVincitorePartita = 3;
    }
  
}

  private router = inject(Router);

  tornaHome() {
    this.router.navigate(['']);
  }
  reset() {
    this.punteggio1=0;
    this.punteggio2=0;
    this.contatoreClick = 0;
    this.arrCarteSfoltireMazzo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.flagVincitorePartita = 0;
    this.resetMazzo();
    this.resetUtente();
    this.resetCardPc()
    this.resetCardUtente()
    this.resetPc();
    this.resetVignetta();
    this.logicaMazzo.mischia();
    this.mazzo = [...this.logicaMazzo.mazzo];
  }
}
function Signal<T>(arg0: { numero: string; seme: string; }) {
  throw new Error('Function not implemented.');
}

