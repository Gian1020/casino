import { Injectable } from '@angular/core';
import { Card } from '../interfacciaGenerale/Card';

@Injectable({
  providedIn: 'root'
})
export class LogicaMazzo {
  mazzo:Card[]=[];
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
      for (let indexCarta in this.mazzo) {
        let indexCasuale: number = Math.floor(Math.random() * this.mazzo.length);
        let varAppoggio = this.mazzo[indexCarta];
        this.mazzo[indexCarta] = this.mazzo[indexCasuale];
        this.mazzo[indexCasuale] = varAppoggio;
      }
    }
}
