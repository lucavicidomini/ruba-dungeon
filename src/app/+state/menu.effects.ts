import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { StorageService } from '../storage.service';
import * as MenuActions from './menu.actions';
import { MenuFacade } from './menu.facade';

@Injectable()
export class MenuEffects implements OnInitEffects {

  private readonly KEY_LAYOUT = 'layout';

  ngrxOnInitEffects() {
    return MenuActions.init();
  }

  ifsetting = (key: string, fn: (value: any) => void) => {
    const value = this.storageService.load(key);
    value && fn(value);
  }

  init$ = createEffect(() =>  this.actions$.pipe(
    ofType(MenuActions.init),
    tap(() => this.ifsetting(this.KEY_LAYOUT, layout => this.menuFacade.setLayout(layout))),
  ), { dispatch: false });

  setLayout$ = createEffect(() =>  this.actions$.pipe(
    ofType(MenuActions.setLayout),
    tap(({ layout }) => this.storageService.save(this.KEY_LAYOUT, layout)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private menuFacade: MenuFacade,
    private storageService: StorageService,
  ) {}
}