import { Component, Input } from '@angular/core';
import { Card } from '../+models/card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() card!: Card;

  @Input() cover = false;

  get suit() {
    switch (this.card.suit) {
      case 'clubs': return 'Clubs';
      case 'coins': return 'Coins';
      case 'cups': return 'Cups';
      case 'swords': return 'Sword';
      default: return '';
    }
  }

}
