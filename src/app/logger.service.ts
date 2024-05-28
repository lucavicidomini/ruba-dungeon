import { Injectable } from '@angular/core';
import { Character } from './+models/character.model';
import { Card, SuitLabels, Suits } from './+models/card.model';
import { Deck } from './+models/deck.model';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private logs: string[] = [];

  private card(card: Card | undefined) {
    return card ? `${card.value}${SuitLabels[card.suit]}` : '(None)';
  }

  private character(character: Character) {
    return `${this.card(character.card)} having ${character.hp} HPs`;
  }

  private deck(deck: Deck) {
    return deck.cards.map(card => this.card(card)).join(', ') || '(None)';
  }

  private hp(subject: string, hpDelta: number) {
    if (hpDelta > 0) {
      return `${subject} recovers ${hpDelta} HPs.`;
    }
    if (hpDelta < 0) {
      return `${subject} loses ${-hpDelta} HPs.`;
    }
    return `${subject} retains its HPs.`
  }

  append(log: string) {
    this.logs.push(log);
    console.info(log);
  };

  actionPlay(
    aidSelected: Deck,
    enemyActionSelected: Card | undefined,
    enemyClubAttack: number,
    enemyDelta: number,
    enemyHealing: number,
    enemyShield: number,
    enemySwordAttack: number,
    heroActionSelected: Deck,
    heroClubAttack: number,
    heroDelta: number,
    heroHealing: number,
    heroRelic: number,
    heroShield: number,
    heroSwordAttack: number,
    parries: number,
    suit: Suits | undefined,
  ) {
    const heroRelicCard = (heroRelic && suit) ? new Card(heroRelic, suit) : undefined;
    const suitStr = (suit && heroActionSelected.length > 1) ? ` as ${SuitLabels[suit]}` : '';

    const messages: string[] = [];
    messages.push(`Hero played ${this.deck(heroActionSelected)}${suitStr};`);
    messages.push(`Aids ${this.deck(aidSelected)};`);
    messages.push(`Relic ${this.card(heroRelicCard)}.`);
    messages.push(`Enemy responded with ${this.card(enemyActionSelected)}.`);

    if (heroClubAttack) {
      const clubMessages: string[] = [];
      clubMessages.push(`Hero carries a total attack of ${heroClubAttack} by clubs`);
      if (enemyClubAttack && heroClubAttack > enemyClubAttack) {
        clubMessages.push(`and parries ${parries}`);
      }
      clubMessages.push('.');
      messages.push(clubMessages.join(''));
    }

    if (heroSwordAttack) {
      messages.push(`Hero carries a total attack of ${heroSwordAttack} by swords.`);
    }

    if (heroShield) {
      messages.push(`Hero shields ${heroShield}.`);
    }

    if (heroHealing) {
      messages.push(`Hero heals ${heroHealing} HPs.`);
    }

    if (enemyClubAttack) {
      const clubMessages: string[] = [];
      clubMessages.push(`Enemy carries a total attack of ${enemyClubAttack} by clubs`);
      if (heroClubAttack && enemyClubAttack > heroClubAttack) {
        clubMessages.push(` and parries ${parries}`);
      }
      clubMessages.push('.');
      messages.push(clubMessages.join(''));
    }

    if (enemySwordAttack) {
      messages.push(`Enemy carries a total attack of ${enemySwordAttack} by swords.`);
    }

    if (enemyShield) {
      messages.push(`Enemy shields ${enemyShield}.`);
    }

    if (enemyHealing) {
      messages.push(`Enemy heals ${enemyHealing} HPs.`);
    }

    messages.push(this.hp('Hero', heroDelta));
    messages.push(this.hp('Enemy', enemyDelta));

    this.append(messages.join(' '))
  }

  actionStart(action: number) {
    this.append(`Started action ${action}`);
  }

  challenge(enemy: Character) {
    this.append(`Challenged enemy ${this.character(enemy)}`);
  }

  collect(card: Card) {
    this.append(`Collected ${this.card(card)}`);
  }

  draw(card: Card) {
    this.append(`Drawn ${this.card(card)}`);
  }

  keepSelectedAction(kept: Deck, discarded: Deck) {
    this.append(`Kept ${this.deck(kept)}; discarded ${this.deck(discarded)}`);
  }

  reveal(enemy: Character) {
    this.append(`Revealed enemy ${this.character(enemy)}`);
  }

  reshuffle() {
    this.append('Reshuffled dungeon cards.')
  }

  resolveCardFailure(eventCard: Card, hpDelta: number) {
    this.append(`Failed ${this.card(eventCard)}. ${this.hp('Hero', hpDelta)}`);
  }

  resolveCardSuccess(eventCard: Card, hpDelta: number) {
    this.append(`Resolved ${this.card(eventCard)}. ${this.hp('Hero', hpDelta)}`);
  }

  resolvedCard(hp: number) {
    this.append(`Hero has ${hp} HPs.`);
  }

  throwDice(dice: number) {
    this.append(`Thrown dice. Value is ${dice}.`);
  }

}
