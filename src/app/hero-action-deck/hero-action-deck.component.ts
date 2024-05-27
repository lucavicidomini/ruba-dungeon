import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';
import { SuitLabels, Suits } from '../+models/card.model';
import { CommonModule } from '@angular/common';
import { GameFacade } from '../+state/game.facade';

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

  @Input() selectedDeck: Deck = Deck.empty();

  @Output() play = new EventEmitter<Suits>();

  @Output() selectCards = new EventEmitter<Deck>();

  onSelect(newSelection: Deck) {
    const oldValue = this.selectedDeck.peek()?.value;

    if (oldValue) {
      const differentCard = newSelection.cards.find(card => card.value !== oldValue);
      if (differentCard) {
        newSelection = Deck.empty();
        newSelection.push(differentCard);
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

  get selectedCardSuits() {
    return Array.from(new Set(this.selectedDeck.cards.map(card => card.suit)).values()).sort();
  }

  get disabledPlay() {
    return this.deck.length && !this.selectedDeck.length;
  }

}
