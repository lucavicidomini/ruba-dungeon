export enum GameStatus {
    /** The game has just been loaded */
    GAME_INIT = 'GAME_INIT',

    /** Player is ready to draw an event card */
    CRAWL_READY = 'CRAWL_READY',

    /** Player draw a card */
    CRAWL_ACT = 'CRAWL_ACT',

    /** Dice was thrown and user can acknowledge it */
    RESOLVE_THREW_DICE = 'RESOLVE_THREW_DICE',
}