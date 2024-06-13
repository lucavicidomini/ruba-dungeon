import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { GameFacade } from './game.facade';
import { MenuFacade } from './menu.facade';
import * as TutorialActions from './tutorial.actions';
import * as TutorialSelectors from './tutorial.selectors';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { TutorialService } from '../tutorial.service';

@Injectable()
export class TutorialEffects {

  exit$ = createEffect(() => this.actions$.pipe(
    ofType(TutorialActions.exit),
    tap(() => this.menuFacade.about(true)),
    tap(() => this.gameFacade.reset()),
    tap(() => this.tutorialService.stop()),
  ), { dispatch: false });

  start$ = createEffect(() => this.actions$.pipe(
    ofType(TutorialActions.start),
    tap(() => this.gameFacade.start()),
    tap(() => this.tutorialService.start()),
    map(() => TutorialActions.next()),
  ));

  step$ = createEffect(() => this.actions$.pipe(
    ofType(TutorialActions.next),
    withLatestFrom(this.store.select(TutorialSelectors.selectIndex)),
    map(([, step]) => this.tutorialService.getStep(step)),
    tap(step => this.tutorialService.highlight(step)),
    tap(step => this.tutorialService.constrain(step)),
    tap(step => this.tutorialService.autoClick(step)),
    map(step => TutorialActions.nextReady({ step })),
  ));

  nextReady$ = createEffect(() => this.actions$.pipe(
    ofType(TutorialActions.nextReady),
    withLatestFrom(this.store.select(TutorialSelectors.selectIndex)),
    map(([, step]) => this.tutorialService.getStep(step)),
    filter(step => !step),
    map(() => TutorialActions.exit()),
  ));

  constructor(
    private actions$: Actions,
    private gameFacade: GameFacade,
    private menuFacade: MenuFacade,
    private store: Store<AppState>,
    private tutorialService: TutorialService,
  ) {}
}
