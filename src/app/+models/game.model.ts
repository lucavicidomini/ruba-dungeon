export enum GameStatus {
    /** The game has just been loaded */
    GAME_INIT = 'GAME_INIT',

    /** Prepare combat phase */
    COMBAT = 'COMBAT',

    /** Player is ready to draw an event card */
    CRAWL_READY = 'CRAWL_READY',

    /** Player draw a card */
    CRAWL_ACT = 'CRAWL_ACT',

    /** After a combat is resolved, player can select which action cards to keep or discard */
    DISCARD_ACTION = 'DISCARD_ACTION',

    /** After a bribe, the enemy card is revealed */
    ENEMY_REVEALED = 'ENEMY_REVEALED',

    GAME_OVER = 'GAME_OVER',

    GAME_WON = 'GAME_WON',

    /** Dice was thrown and user can acknowledge it */
    RESOLVE_THREW_DICE = 'RESOLVE_THREW_DICE',
}

export type KeepDiscardAction = 'keep' | 'discard';