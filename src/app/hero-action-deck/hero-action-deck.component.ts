import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';
import { SuitLabels, Suits } from '../+models/card.model';
import { CommonModule } from '@angular/common';

export interface PlayAction {
  suit: Suits,
  deck: Deck,
}

@Component({
  selector: 'app-hero-action-deck',
  standalone: true,
  imports: [
    CommonModule,
    SelectableDeckComponent,
  ],
  templateUrl: './hero-action-deck.component.html',
  styleUrl: './hero-action-deck.component.scss'
})
export class HeroActionDeckComponent {

  SuitLabel = SuitLabels;

  @Input() deck: Deck = Deck.empty();

  @Output() play = new EventEmitter<PlayAction>();

  selectedDeck: Deck = Deck.empty();

  onSelect(newSelection: Deck) {
    if (newSelection.length > 1) {
      const allowedValue = newSelection.peek()?.value!;
      const differentValue = !!newSelection.cards.find(card => card.value !== allowedValue);
      if (differentValue) {
        return;
      }
    }
    this.selectedDeck = newSelection;
  }

  onPlay(suit: Suits) {
    this.play.emit({ suit, deck: this.selectedDeck });
  }

  getButton(suit: Suits) {
    return `Play ${SuitLabels[suit]}`;
  }

  get selectedCardSuits() {
    return Array.from(new Set(this.selectedDeck.cards.map(card => card.suit)).values());
  }

  get disabledPlay() {
    return this.deck.length && !this.selectedDeck.length;
  }

}
