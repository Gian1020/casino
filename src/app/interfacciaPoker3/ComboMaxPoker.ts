import { Card } from "../interfacciaGenerale/Card";


export interface CombinazioneMax {
    combo:number;
    cards:Card[];
    nomeCombo:string;
}

/*LEGGENDA COMBO = 
                    0 --> carta alta
                    1 --> coppia
                    2 --> colore
                    3 --> scala
                    4 --> tris
                    5 --> scalaReale
                    */