import { Component, Input } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {

  @Input() deck = Deck.empty();

  @Input() cover = false;

  @Input() spread = false;

  /**
   * If a card **in a spreaded deck** is covered
   * @param index index of the card inside the deck
   * @returns `true` if card `index` is covered
   */
  isCovered(index: number): boolean {
    return this.cover && index < this.deck.length - 1;
  }

}
