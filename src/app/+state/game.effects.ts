import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import * as GameActions from './game.actions';
import { Deck } from '../+models/deck.model';

@Injectable()
export class GamesEffects {

  start$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    map(() => {
        const dungeon = Deck.full();
        const heroCard = dungeon.popPlayerCard();
        const heroHp = 12;
        const character = dungeon.extractCharacterDeck();
        const relic = dungeon.extractRelicDeck();
        const aid = Deck.empty();
        const catacomb = Deck.empty();
        const event = Deck.empty();
        const gold = Deck.empty();
        const obtainedRelic = Deck.empty();
        dungeon.shuffle();
        return GameActions.setup({ aid, catacomb, dungeon, character, event, gold, relic, obtainedRelic, heroCard, heroHp });
    })
  ));

  constructor(
    private actions$: Actions,
  ) {}
}