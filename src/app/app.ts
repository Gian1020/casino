import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartaAlta } from './carta-alta/carta-alta';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CartaAlta],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('casino');
}
