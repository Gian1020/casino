import { Component, signal } from '@angular/core';
import type { WritableSignal } from '@angular/core';
import { Card } from '../interfacciaGenerale/Card';
import { CartaFrancese } from '../componentiGenerali/carta-francese/carta-francese';
import { MazzoFrancese } from "../componentiGenerali/mazzo-francese/mazzo-francese";
import { LogicaMazzo } from '../service/logica-mazzo';
import { InputCarta } from './interfacciaCartaAlta/InputCarta';
import { InputMazzo } from './interfacciaCartaAlta/InputMazzo';
import { UserCard } from "../componentiGenerali/user-card/user-card";
import { InputUser } from './interfacciaCartaAlta/InputUser';

@Component({
  selector: 'app-carta-alta',
  imports: [CartaFrancese, MazzoFrancese, UserCard],
  templateUrl: './carta-alta.html',
  styleUrl: './carta-alta.css'
})
export class CartaAlta {

  //carte Utente
  cartaUtente: Card[] = [];
  punteggio1: number = 0;
  //var comunicazione con il componente app-carta-francese
  utenteSignal: WritableSignal<InputCarta> = signal<InputCarta>({ carta: { numero: "", seme: '' }, contatore: 0 });

  //carte Pc
  cartaPc: Card[] = [];
  punteggio2: number = 0;
  //var comunicazione con il componente app-carta-francese
  pcSignal: WritableSignal<InputCarta> = signal<InputCarta>({ carta: { numero: "", seme: '' }, contatore: 0 });


  //mazzo
  mazzo!: Card[];
  mazzoSignal: WritableSignal<InputMazzo> = signal<InputMazzo>({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
  //sfoltisce mazzo
  contatoreClick: number = 0;
  arrCarteSfoltireMazzo: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  //var per comunicazione con componente app-user-card
  cardUtenteSignal: WritableSignal<InputUser>= signal<InputUser>({ nome: "USER", punteggio: 0, country: "Italy"});
  cardPcSignal:WritableSignal<InputUser>= signal<InputUser>({ nome: "USER_PC", punteggio: 0, country: "Space"});
  
  //vincitore
  flagVincitorePartita: number = 0;
  vincitore!: string;
  country!: string;
  punteggioVincitore!: string;
  classeCard: string = "";

  //vignetta
  commentoVincitoreRound!: string;
  valoreSemeStringa!: string;
  simboliTupla: { [key: string]: string } = { "S": "♠", "C": "♣", "D": "♦", "H": "♥" };
  numeri: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];



  //inietta il service accedere alle funzioni di logica mazzo
  constructor(private logicaMazzo: LogicaMazzo) { }

  //utilizza le funzioni di logica mazzo
  ngOnInit() {
    this.logicaMazzo.creaCarte();
    this.logicaMazzo.mischia();
  }

  //funzione che serve a distriduire le carte al click del figlio (app-mazzo-francese)
  distribuisciCarta() {
    //mazzo
    this.mazzo = this.logicaMazzo.mazzo;
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
    this.aggiornaCartaUtente();
    this.aggiornaCartaPc();

  }
  //funzione che serve a catturare l evento di click in (app-mazzo-francese)
  daiCarte(evento: any) {
    this.distribuisciCarta();
  }

  //funzione che serve a aggiornare i valori del utente in figlio (app-carta-francese)
  aggiornaUtente(cartaUtente: Card) {
    this.utenteSignal.set({ carta: cartaUtente, contatore: this.contatoreClick });
  }

  //funzione che serve a aggiornare i valori del pc in figlio (app-carta-francese)
  aggiornaPc(cartaPc: Card) {
    this.pcSignal.set({ carta: cartaPc, contatore: this.contatoreClick });
    console.log(this.pcSignal);
  }

  aggiornaCartaUtente(){
    this.cardUtenteSignal.set({ nome: "USER", punteggio: this.punteggio1, country: "Italy"})
  }

  aggiornaCartaPc(){
    this.cardPcSignal.set({ nome: "USER_PC", punteggio: this.punteggio2, country: "Space"})
  }

  aggiornaMazzo() {
    this.mazzoSignal.set({ contatoreClick: this.contatoreClick, lunghezzaMazzo: this.mazzo.length, valoreBloccoClick: 0, arrCarteSfoltireMazzo: this.arrCarteSfoltireMazzo })
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
      if (carta1.seme > carta2.seme) {
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


  simboloSeme(card: Card) {
    this.valoreSemeStringa = `${card.numero}${this.simboliTupla[card.seme!]}`;
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
}
function Signal<T>(arg0: { numero: string; seme: string; }) {
  throw new Error('Function not implemented.');
}

