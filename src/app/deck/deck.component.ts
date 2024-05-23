import { Component, Input } from '@angular/core';
import { Deck } from '../+models/deck.model';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {

  @Input() deck = Deck.empty();

}
