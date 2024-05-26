import { Component, Input } from '@angular/core';
import { Card, SuitLabels } from '../+models/card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  SuitLabels = SuitLabels;

  @Input() card!: Card;

  @Input() selected = false;

  @Input() cover = false;

  get css() {
    return `card c${this.card.value} c${this.card.suit} ${this.selected}`;
  }

  get suit() {
    return this.SuitLabels[this.card.suit];
  }

}
