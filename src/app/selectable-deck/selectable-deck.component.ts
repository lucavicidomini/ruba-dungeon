import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Card } from '../+models/card.model';

@Component({
  selector: 'app-selectable-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './selectable-deck.component.html',
  styleUrl: './selectable-deck.component.scss'
})
export class SelectableDeckComponent {

  @Input() deck = Deck.empty();

  @Input() selectedDeck: Deck | null = null;

  @Output() selectCards = new EventEmitter<Deck>();

  isSelected(card: Card): boolean {
    return this.selectedDeck?.includes(card) ?? false;
  }

  onToggle(card: Card): void {
    const newSelectedDeck = this.selectedDeck?.clone() ?? Deck.empty();

    if (this.isSelected(card)) {
      newSelectedDeck.remove(card);
    } else {
      newSelectedDeck.push(card);
    }

    console.log(newSelectedDeck);
    this.selectCards.emit(newSelectedDeck);
  }

  get selectedCards(): Card[] {
    return this.selectedDeck?.cards ?? [];
  }

}
