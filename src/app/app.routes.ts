import { Routes } from '@angular/router';
import { HomeCasino } from './home-casino/home-casino';
import { CartaAlta } from './carta-alta/carta-alta';
import { PokerTre } from './poker-tre/poker-tre';

export const routes: Routes = [{
    path: '',
    component: HomeCasino
},
{
    path: 'cartaAlta',
    component: CartaAlta
},
{
    path:"poker3",
    component: PokerTre
}
];

