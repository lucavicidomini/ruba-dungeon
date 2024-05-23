export enum GameStatus {
    /** The game has just been loaded */
    GAME_INIT = 'GAME_INIT',

    /** Player is ready to draw an event card */
    CRAWL_READY = 'CRAWL_READY',

    /** Player draw a card */
    CRAWL_ACT = 'CRAWL_ACT',
}