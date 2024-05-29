import { createAction, props } from '@ngrx/store';
import { LayoutSetting } from '../+models/settings.model';

export const openAbout = createAction(
    '[Game/Menu] About Open',
    props<{ show?: boolean }>()
);

export const openNewGame = createAction(
    '[Game/Menu] New Game',
    props<{ show?: boolean }>()
);

export const openSettings = createAction(
    '[Game/Menu] Settings',
    props<{ show?: boolean }>()
);

export const setLayout = createAction(
    '[Game/Menu] Set Layout',
    props<{ layout: LayoutSetting }>()
);