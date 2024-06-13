import { createAction, props } from '@ngrx/store';
import { TutorialStep } from '../+models/tutorial.model';

export const start = createAction(
    '[Game/Tutorial] Start'
);

export const next = createAction(
    '[Game/Tutorial] Next'
);

export const nextReady = createAction(
    '[Game/Tutorial] Next Ready',
    props<{ step: TutorialStep | undefined }>()
);

export const exit = createAction(
    '[Game/Tutorial] Exit'
);