import { Injectable } from '@angular/core';
import { Card } from '../interfacciaGenerale/Card';

@Injectable({
  providedIn: 'root'
})
export class LogicaMazzo {
  mazzo: Card[] = [];
  semi: string[] = ["S", "C", "D", "H"];
  numeri: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  creaCarte() {
    for (let seme of this.semi) {
      for (let numero of this.numeri) {
        let carta: Card = { numero: numero, seme: seme }
        this.mazzo.push(carta);
      }
    }
    console.log(this.mazzo);
  }


  mischia() {
    for (let i = this.mazzo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.mazzo[i], this.mazzo[j]] = [this.mazzo[j], this.mazzo[i]];
    }
  }
}
