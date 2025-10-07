import { Component, signal, WritableSignal } from '@angular/core';
import { CombinazioneMax } from '../interfacciaPoker3/ComboMaxPoker';
import { Card } from '../interfacciaGenerale/Card';
import { LogicaMazzo } from '../service/logica-mazzo';
import { CartaFrancese } from "../componentiGenerali/carta-francese/carta-francese";
import { UserCard } from "../componentiGenerali/user-card/user-card";
import { MazzoFrancese } from "../componentiGenerali/mazzo-francese/mazzo-francese";
import { InputUser } from '../carta-alta/interfacciaCartaAlta/InputUser';
import { InputVignetta } from '../carta-alta/interfacciaCartaAlta/InputVignetta';
import { InputMazzo } from '../carta-alta/interfacciaCartaAlta/InputMazzo';
import { InputCarta } from '../carta-alta/interfacciaCartaAlta/InputCarta';
import { Vignetta } from "../vignetta/vignetta";

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
  utenteSignalPoker3: WritableSignal<InputCarta> = signal<InputCarta>({ carta: { numero: "", seme: '' }, contatore: 0 });

  //PC
  cartePc: Card[] = [];
  comboMaxPc!: CombinazioneMax;
  punteggioPc: number = 0;
  pcSignalPoker3: WritableSignal<InputCarta> = signal<InputCarta>({ carta: { numero: "", seme: '' }, contatore: 0 });

  //mazzo
  mazzo!: Card[];
  mazzoSignalPoker3: WritableSignal<InputMazzo> = signal<InputMazzo>({ contatoreClick: 0, lunghezzaMazzo: 52, valoreBloccoClick: 0, arrCarteSfoltireMazzo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
 
  //commento della vittoria di ogni round
  stringaComboRound!: string;
  commentoVincitoreRound!: string;

  //variabile per blocare il click del mazzo
  contatoreClick: number = 0;
  numeroCarteVisualizzazioneMazzo: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //var per comunicazione con componente app-user-card
  cardUtenteSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER", punteggio: this.punteggioUtene, country: "Italy" });
  cardPcSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "USER_PC", punteggio: this.punteggioPc, country: "Space" });
  cardDrowSignalPoker3: WritableSignal<InputUser> = signal<InputUser>({ nome: "NoWinner", punteggio: 4, country: "" })
  textVignettaSignalPoker3: WritableSignal<InputVignetta>= signal<InputVignetta>({contatore:0,commento:""})
  
  //variabili che servono per la card Winner
  flagVincitorePartita: number = 0;
  chiHaVinto: string = "";
  punteggioVincitore: string = "";
  country: string = "";
  classeCard: string = "";
  router: any;

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
      this.sfoltisciMazzo()
      //funzione che controlla la vitoria
      this.checkWinnerRound(this.controlloMaxPunteggio(this.carteUtente), this.controlloMaxPunteggio(this.cartePc));

      this.commentoVincitoreRound = "Ha vinto il giocatore " + this.stringaComboRound + " il round numero " + this.contatoreClick;

      this.vincitoreFinale();
    }
  }

  daiCarte(){
    this.distribuisci(this.mazzo)
  }

  sfoltisciMazzo() {
    if (this.contatoreClick % 1 == 0) {
      this.numeroCarteVisualizzazioneMazzo.pop();
    }
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
        if ((mano[i].numero ?? 0) === (mano[j].numero ?? 0)) {
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
      if ((Number(mano[i].numero)) == Number((mano[i + 1].numero)) - 1) {
        contatore++;
      }
    }
    if (contatore == 2) return true;
    let arr = [];
    for (let carte of mano) {
      arr.push(carte.numero);
    }
    if (arr.map(Number).includes(14) && arr.map(Number).includes(2) && arr.map(Number).includes(3)) {
      return true;
    }

    return false;
  }

  controlloSimbolo(mano: Card[]): boolean {
    let contatore: number = 0;
    for (let i = 0; i < mano.length - 1; i++) {
      if ((mano[i].seme ?? 0) == (mano[i + 1].seme ?? 0)) {
        contatore++
      }
    }
    if (contatore === mano.length - 1) {
      return true;
    }
    else return false;
  }

  vincitoreFinale() {
    if (this.contatoreClick == 8) {
      if (this.punteggioUtene > this.punteggioPc) {
        this.flagVincitorePartita = 1;
        this.chiHaVinto = "Utente";
        this.punteggioVincitore = "Punteggio: " + `${this.punteggioUtene}`;
        this.country = "Italy";
        this.classeCard = "card-utente";
      }
      else if (this.punteggioUtene < this.punteggioPc) {
        this.flagVincitorePartita = 2;
        this.chiHaVinto = "Utente_PC";
        this.punteggioVincitore = "Punteggio: " + `${this.punteggioPc}`;
        this.country = "Spazio";
        this.classeCard = "card-pc";
      }
      else {
        this.flagVincitorePartita = 3;
        this.chiHaVinto = "Patta";
        this.punteggioVincitore = "Punteggio: PARI";
        this.classeCard = "card-pc";
      }
    }
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
          if (comboMaxUtente.cards[0].numero! > comboMaxPc.cards[0].numero!) {
            this.punteggioUtene++;
            this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
          }
          else if (comboMaxUtente.cards[0].numero! < comboMaxPc.cards[0].numero!) {
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
        if (comboMaxUtente.cards[1].numero! > comboMaxPc.cards[1].numero!) {
          this.punteggioUtene++;
          this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        }
        else if (comboMaxUtente.cards[1].numero! < comboMaxPc.cards[1].numero!) {
          this.punteggioPc++;
          this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        }
        else {
          let valoreCheNonCoppiaUtente: number = this.trovaDiverso(Number(comboMaxUtente.cards[0].numero), Number(comboMaxUtente.cards[1].numero), Number(comboMaxUtente.cards[2].numero));
          let valoreCheNonCoppiaPC: number = this.trovaDiverso(Number(comboMaxPc.cards[0].numero), Number(comboMaxPc.cards[1].numero), Number(comboMaxPc.cards[2].numero));
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
    if (comboMaxUtente.cards[0].numero! > comboMaxPc.cards[0].numero!) {
      this.punteggioUtene++;
      this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
    }
    else if (comboMaxUtente.cards[0].numero! < comboMaxPc.cards[0].numero!) {
      this.punteggioPc++;
      this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
    }
    else if (comboMaxUtente.cards[0].numero! == comboMaxPc.cards[0].numero!) {
      if (Number(comboMaxUtente.cards[0].numero) == 2) {
        if (comboMaxUtente.cards[comboMaxUtente.cards.length - 1].numero! < comboMaxPc.cards[comboMaxPc.cards.length - 1].numero!) {
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
      if (comboMaxUtente.cards[i].numero! > comboMaxPc.cards[i].numero!) {
        this.punteggioUtene++;
        this.stringaComboRound = "l'Utente con " + comboMaxUtente.nomeCombo;
        break;
      }
      if (comboMaxUtente.cards[i].numero! < comboMaxPc.cards[i].numero!) {
        this.punteggioPc++;
        this.stringaComboRound = "il PC con " + comboMaxPc.nomeCombo;
        break;
      }
    }
  }
  
  tornaHome() {
    this.router.navigate(['']);
  }
  reset(){
    
  }
}

