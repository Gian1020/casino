import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokerTre } from "./poker-tre/poker-tre";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PokerTre],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('casino');
}
