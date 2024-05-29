import { createAction } from '@ngrx/store';

export const openAbout = createAction(
    '[Game/Menu] About Open'
);

export const openNewGame = createAction(
    '[Game/Menu] New Game'
);

export const openSettings = createAction(
    '[Game/Menu] Settings'
);