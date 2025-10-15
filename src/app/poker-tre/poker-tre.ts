import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CombinazioneMax } from '../interfacciaPoker3/ComboMaxPoker';
import { Card } from '../interfacciaGenerale/Card';
import { LogicaMazzo } from '../service/logica-mazzo';
import { CartaFrancese } from "../componentiGenerali/carta-francese/carta-francese";
import { UserCard } from "../componentiGenerali/user-card/user-card";
import { MazzoFrancese } from "../componentiGenerali/mazzo-francese/mazzo-francese";
import { InputUser } from '../carta-alta/interfacciaCartaAlta/InputUser';
import { InputVignetta } from '../carta-alta/interfacciaCartaAlta/InputVignetta';
import { InputMazzo } from '../carta-alta/interfacciaCartaAlta/InputMazzo';
import { Router } from '@angular/router';
import { Vignetta } from "../vignetta/vignetta";
import { InputCarta } from '../carta-alta/interfacciaCartaAlta/InputCarta';

@Component({
  selector: 'app-poker-tre',
  imports: [CartaFrancese, UserCard, MazzoFrancese, Vignetta],
  templateUrl: './poker-tre.html',
  styleUrl: './poker-tre.css'
})
export class PokerTre {
  //Utente
  carteUtente: Card[] = [];
  comboMaxUtente!: CombinazioneMax;
  punteggioUtene: number = 0;
  utenteSignalCarta1: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });
  utenteSignalCarta2: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });
  utenteSignalCarta3: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });

  //PC
  cartePc: Card[] = [];
  comboMaxPc!: CombinazioneMax;
  punteggioPc: number = 0;
  pcSignalCarta1: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });
  pcSignalCarta2: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });
  pcSignalCarta3: WritableSignal<InputCarta> = signal<InputCarta>({ numero: "", seme: "" });

  //mazzo
  mazzo!: Card[];
  mazzoSignalPoker3: WritableSignal<InputMazzo> = signal<InputMazzo>({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], gioco: "poker3" });

  //commento della vittoria di ogni round
  stringaComboRound!: string;
  commentoVincitoreRound!: string;

  //variabile per blocare il click del mazzo
  contatoreClick: number = 0;
  numeroCarteVisualizzazioneMazzo: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //var per comunicazione con componente app-user-card
  cardUtenteSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER", punteggio: this.punteggioUtene, country: "Italy" });
  cardPcSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER_PC", punteggio: this.punteggioPc, country: "Space" });
  cardDrowSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "NoWinner", punteggio: 4, country: "" });
  textVignettaSignalPoker3: WritableSignal<InputVignetta> = signal<InputVignetta>({ commento: "" });

  //variabili che servono per la card Winner
  flagVincitorePartita: number = 0;
  chiHaVinto: string = "";
  punteggioVincitore: string = "";
  country: string = "";
  classeCard: string = "";
  arrValori: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];


  constructor(private logicaMazzo: LogicaMazzo) {
  }

  ngOnInit() {
    this.logicaMazzo.creaCarte();
    this.logicaMazzo.mischia();
    this.mazzo = [...this.logicaMazzo.mazzo];
  }

  distribuisci(mazzo: Card[]) {
    this.cartePc = [];
    this.carteUtente = [];
    if (mazzo.length > 5) {
      this.contatoreClick++;
      for (let i = 0; i < 3; i++) {
        // carta utente
        const cartaU = mazzo.shift()!;
        this.carteUtente.push(cartaU);
        // carta pc
        const cartaP = mazzo.shift()!;
        this.cartePc.push(cartaP);
      }
      this.aggiornaCarteUtente();
      this.aggiornaCartePc();
      this.sfoltisciMazzo();
      this.aggiornaMazzo();
      //funzione che controlla la vittoria
      this.checkWinnerRound(this.controlloMaxPunteggio(this.carteUtente), this.controlloMaxPunteggio(this.cartePc));
      this.aggiornaCardUtente();
      this.aggiornaCardPc();
      this.commentoVincitoreRound = "Ha vinto il giocatore " + this.stringaComboRound + " il round n. " + this.contatoreClick;
      this.aggiornaVignetta();
      if(this.contatoreClick==8){this.checkWinnerFinale();}
    }
  }

  daiCarte() {
    this.distribuisci(this.mazzo);
  }

  sfoltisciMazzo() {
    if (this.contatoreClick % 1 == 0) {
      this.numeroCarteVisualizzazioneMazzo.pop();
    }
  }

  aggiornaCarteUtente() {
    this.utenteSignalCarta1.set({ numero: this.carteUtente[0].numero, seme: this.carteUtente[0].seme });
    this.utenteSignalCarta2.set({ numero: this.carteUtente[1].numero, seme: this.carteUtente[1].seme });
    this.utenteSignalCarta3.set({ numero: this.carteUtente[2].numero, seme: this.carteUtente[2].seme });
  }

  resetCarteUtente() {
    this.utenteSignalCarta1.set({ numero: "", seme: "" });
    this.utenteSignalCarta2.set({ numero: "", seme: "" });
    this.utenteSignalCarta3.set({ numero: "", seme: "" });
  }

  aggiornaCartePc() {
    this.pcSignalCarta1.set({ numero: this.cartePc[0].numero, seme: this.cartePc[0].seme });
    this.pcSignalCarta2.set({ numero: this.cartePc[1].numero, seme: this.cartePc[1].seme });
    this.pcSignalCarta3.set({ numero: this.cartePc[2].numero, seme: this.cartePc[2].seme });
  }

  resetCartePc() {
    this.pcSignalCarta1.set({ numero: "", seme: "" });
    this.pcSignalCarta2.set({ numero: "", seme: "" });
    this.pcSignalCarta3.set({ numero: "", seme: "" });
  }

  aggiornaCardUtente() {
    this.cardUtenteSignalPoker3.set({ nome: "USER", punteggio: this.punteggioUtene, country: "Italy" });
  }

  resetCardUtente() {
    this.cardUtenteSignalPoker3.set({ nome: "USER", punteggio: 0, country: "Italy" });
  }

  aggiornaCardPc() {
    this.cardPcSignalPoker3.set({ nome: "USER_PC", punteggio: this.punteggioPc, country: "Space" });
  }

  resetCardPc() {
    this.cardPcSignalPoker3.set({ nome: "USER_PC", punteggio: 0, country: "Space" });
  }

  aggiornaVignetta() {
    this.textVignettaSignalPoker3.set({ commento: this.commentoVincitoreRound })
  }

  resetVignetta() {
    this.textVignettaSignalPoker3.set({ commento: "" });
  }

  aggiornaMazzo() {
    this.mazzoSignalPoker3.set({ contatoreClick: this.contatoreClick, lunghezzaMazzo: this.mazzo.length, valoreBloccoClick: 0, arrCarteSfoltireMazzo: this.numeroCarteVisualizzazioneMazzo, gioco: "poker3" })
  }

  resetMazzo() {
    this.mazzoSignalPoker3.set({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], gioco: "poker3" });
  }

  controlloMaxPunteggio(carteGiocatoreDaControllare: Card[]): CombinazioneMax {
    let chiControlliamo = [...carteGiocatoreDaControllare];
    chiControlliamo.sort((a, b) => (Number(a.numero) - Number(b.numero)));

    switch (true) {
      //case scala reale
      case (this.controlloSeScala(chiControlliamo) && this.controlloSimbolo(chiControlliamo)):
        return {
          combo: 5,
          cards: chiControlliamo,
          nomeCombo: "Scala reale"
        }
      //case tris
      case (chiControlliamo[0].numero == chiControlliamo[1].numero && chiControlliamo[0].numero == chiControlliamo[2].numero):
        return {
          combo: 4,
          cards: chiControlliamo,
          nomeCombo: "Tris"
        }
      //case scala
      case (this.controlloSeScala(chiControlliamo)):
        return {
          combo: 3,
          cards: chiControlliamo,
          nomeCombo: "Scala"
        }
      //case colore
      case (this.controlloSimbolo(chiControlliamo)):
        return {
          combo: 2,
          cards: chiControlliamo,
          nomeCombo: "Colore"
        }

      //case coppia
      case (this.controlloCoppia(chiControlliamo)):
        return {
          combo: 1,
          cards: chiControlliamo,
          nomeCombo: "Coppia"
        }

      //default carta alta
      default:
        return {
          combo: 0,
          cards: chiControlliamo,
          nomeCombo: "Carta Alta"
        }
    }
  }

  controlloCoppia(mano: Card[]) {
    for (let i = 0; i < mano.length - 1; i++) {
      for (let j = i + 1; j < mano.length; j++) {
        if (this.arrValori.indexOf(mano[i].numero) === this.arrValori.indexOf(mano[j].numero)) {
          return true;
        }
      }
    }
    return false;
  }

  controlloSeScala(mano: Card[]): boolean {
    //controllo scala tranne caso A 2 3
    let contatore = 0;
    for (let i = 0; i < mano.length - 1; i++) {
      if (this.arrValori.indexOf(mano[i].numero) == this.arrValori.indexOf(mano[i + 1].numero) - 1) {
        contatore++;
      }
    }
    if (contatore == 2) return true;
    let arr: string[] = [];
    for (let carte of mano) {
      arr.push(carte.numero);
    }

    if (arr.includes("A") && arr.includes("2") && arr.includes("3")) {
      return true;
    }

    return false;
  }

  controlloSimbolo(mano: Card[]): boolean {
    let contatore: number = 0;
    for (let i = 0; i < mano.length - 1; i++) {
      if ((mano[i].seme) == (mano[i + 1].seme)) {
        contatore++
      }
    }
    if (contatore === mano.length - 1) {
      return true;
    }
    else return false;
  }

  checkWinnerRound(comboMaxUtente: CombinazioneMax, comboMaxPc: CombinazioneMax) {
    //da controllare con log tutti i pareggi
    switch (true) {
      //controllo combo --> vincitore Utente
      case (comboMaxUtente.combo > comboMaxPc.combo): {
        this.punteggioUtene++;
        this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        break;
      }
      //controllo combo --> vincitore Pc
      case (comboMaxUtente.combo < comboMaxPc.combo): {
        this.punteggioPc++;
        this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        break;
      }
      //controllo combo --> pari
      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 5):
        {
          this.controllaComboScala(comboMaxUtente, comboMaxPc)
          break;
        }
      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 4):
        {
          if (this.arrValori.indexOf(comboMaxUtente.cards[0].numero) > this.arrValori.indexOf(comboMaxPc.cards[0].numero)) {
            this.punteggioUtene++;
            this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
          }
          else if (this.arrValori.indexOf(comboMaxUtente.cards[0].numero) < this.arrValori.indexOf(comboMaxPc.cards[0].numero)) {
            this.punteggioPc++;
            this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;;
          }
          break;
        }

      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 3):
        {
          this.controllaComboScala(comboMaxUtente, comboMaxPc)
          break;
        }

      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 2):
        {
          this.controlloCartaAlta(comboMaxUtente, comboMaxPc);
          break;
        }

      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 1): {
        if (this.arrValori.indexOf(comboMaxUtente.cards[1].numero)> this.arrValori.indexOf(comboMaxPc.cards[1].numero)) {
          this.punteggioUtene++;
          this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        }
        else if (this.arrValori.indexOf(comboMaxUtente.cards[1].numero)< this.arrValori.indexOf(comboMaxPc.cards[1].numero)) {
          this.punteggioPc++;
          this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        }
        else {
          let valoreCheNonCoppiaUtente: number = this.trovaDiverso(this.arrValori.indexOf(comboMaxUtente.cards[0].numero), this.arrValori.indexOf(comboMaxUtente.cards[1].numero), this.arrValori.indexOf(comboMaxUtente.cards[2].numero));
          let valoreCheNonCoppiaPC: number = this.trovaDiverso(this.arrValori.indexOf(comboMaxPc.cards[0].numero), this.arrValori.indexOf(comboMaxPc.cards[1].numero), this.arrValori.indexOf(comboMaxPc.cards[2].numero));
          if (valoreCheNonCoppiaUtente > valoreCheNonCoppiaPC) {
            this.punteggioUtene++;
            this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
          }
          else if (valoreCheNonCoppiaUtente < valoreCheNonCoppiaPC) {
            this.punteggioPc++;
            this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
          }
        }
        break;
      }

      case (comboMaxUtente.combo == comboMaxPc.combo && comboMaxUtente.combo == 0): {
        this.controlloCartaAlta(comboMaxUtente, comboMaxPc);
        break;
      }

    }


  } trovaDiverso(a: number, b: number, c: number) {
    if (a === b) return c;
    if (a === c) return b;
    return a; // per forza b === c
  }
  controllaComboScala(comboMaxUtente: CombinazioneMax, comboMaxPc: CombinazioneMax) {
    if (this.arrValori.indexOf(comboMaxUtente.cards[0].numero) > this.arrValori.indexOf(comboMaxPc.cards[0].numero)) {
      this.punteggioUtene++;
      this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
    }
    else if (this.arrValori.indexOf(comboMaxUtente.cards[0].numero) < this.arrValori.indexOf(comboMaxPc.cards[0].numero)) {
      this.punteggioPc++;
      this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
    }
    else if (this.arrValori.indexOf(comboMaxUtente.cards[0].numero) == this.arrValori.indexOf(comboMaxPc.cards[0].numero)) {
      if (Number(comboMaxUtente.cards[0].numero) == 2) {
        if (this.arrValori.indexOf(comboMaxUtente.cards[comboMaxUtente.cards.length - 1].numero) < this.arrValori.indexOf(comboMaxPc.cards[comboMaxPc.cards.length - 1].numero)) {
          this.punteggioUtene++;
          this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        }
        else {
          this.punteggioPc++;
          this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        }
      }
    }
  }
  controlloCartaAlta(comboMaxUtente: CombinazioneMax, comboMaxPc: CombinazioneMax) {
    for (let i = comboMaxUtente.cards.length - 1; i >= 0; i--) {
      if (this.arrValori.indexOf(comboMaxUtente.cards[i].numero) > this.arrValori.indexOf(comboMaxPc.cards[i].numero)) {
        this.punteggioUtene++;
        this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        break;
      }
      if (this.arrValori.indexOf(comboMaxUtente.cards[i].numero) < this.arrValori.indexOf(comboMaxPc.cards[i].numero)) {
        this.punteggioPc++;
        this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        break;
      }
    }
  }

  checkWinnerFinale() {
    if (this.punteggioUtene > this.punteggioPc) {
      this.flagVincitorePartita = 1;

    }
    else if (this.punteggioUtene < this.punteggioPc) {
      this.flagVincitorePartita = 2;
    }


    else if ((this.punteggioUtene == this.punteggioPc)) {
      this.flagVincitorePartita = 3;
    }
  
}

  private router = inject(Router);

  tornaHome() {
    this.router.navigate(['']);
  }
  reset() {
    this.contatoreClick = 0;
    this.numeroCarteVisualizzazioneMazzo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.flagVincitorePartita = 0;
    this.resetCardUtente();
    this.resetCardPc();
    this.resetCarteUtente();
    this.resetCartePc();
    this.resetVignetta();
    this.resetMazzo();
    this.logicaMazzo.mischia();
    this.mazzo = [...this.logicaMazzo.mazzo];
  }
}

