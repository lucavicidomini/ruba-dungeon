import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SuitLabels, Suits } from '../+models/card.model';
import { Deck } from '../+models/deck.model';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';

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

  @Input() aidSelected: Deck = Deck.empty();

  @Input() deck: Deck = Deck.empty();

  @Input() selectedDeck: Deck = Deck.empty();

  @Output() play = new EventEmitter<Suits>();

  @Output() selectCards = new EventEmitter<Deck>();

  onSelect(newSelection: Deck) {
    // Deny selection of combos with different values
    const oldValue = this.selectedDeck.peek()?.value;
    if (oldValue) {
      const differentCard = newSelection.cards.find(card => card.value !== oldValue);
      if (differentCard) {
        newSelection = Deck.empty();
        newSelection.push(differentCard);
      }
    }

    // If some aid is selected, disable selection of actions with different suits (but allow combo)
    if (this.aidSelected.length && newSelection.length === 1) {
      const aidSuit = this.aidSelected.peek()?.suit;
      const differentCard = newSelection.cards.find(card => card.suit !== aidSuit);
      if (differentCard) {
        return;
      }
    }

    this.selectCards.emit(newSelection);
  }

  onPlay(suit?: Suits) {
    this.play.emit(suit);
  }

  getButton(suit?: Suits) {
    return suit ? `Play ${SuitLabels[suit]}` : 'Play';
  }

  disableButton(suit?: Suits) {
    const disablePlay = this.deck.length && !this.selectedDeck.length;

    const aidSuit = this.aidSelected.peek()?.suit;
    const disableSuit = suit && aidSuit ? aidSuit !== suit : false;
    return disablePlay || disableSuit;
  }

  get selectedCardSuits() {
    return Array.from(new Set(this.selectedDeck.cards.map(card => card.suit)).values()).sort();
  }

}
