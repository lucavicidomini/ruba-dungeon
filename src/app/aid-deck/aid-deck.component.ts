import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';

@Component({
  selector: 'app-aid-deck',
  standalone: true,
  imports: [SelectableDeckComponent],
  templateUrl: './aid-deck.component.html',
  styleUrl: './aid-deck.component.scss'
})
export class AidDeckComponent {

  @Input() actionSelected: Deck = Deck.empty();

  @Input() deck: Deck = Deck.empty();

  @Input() enable = false;

  @Input() selectedDeck: Deck = Deck.empty();

  @Output() selectCards = new EventEmitter<Deck>();

  onSelect(newSelection: Deck) {
    if (!this.enable) {
      return;
    }

    // If some action card is selected, dany selecting aid card with different suits
    const actionSuits = this.actionSelected.cards.map(card => card.suit);
    const aidSuits = newSelection.cards.map(card => card.suit);
    const suitIsAllowed = aidSuits.reduce((isAllowed, suit) => isAllowed && actionSuits.includes(suit), true);
    if (actionSuits.length && !suitIsAllowed) {
      return;
    }

    this.selectCards.emit(newSelection);
  }

}
