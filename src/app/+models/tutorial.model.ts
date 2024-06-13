export interface TutorialMessage {
  content: string;
  style?: 'info' | 'easy'
}

export interface TutorialStep {
  m: string | TutorialMessage | (string | TutorialMessage)[];
  // If of element to user is obliged to click
  e?: string;
  // Id of element to highlight
  h?: string;
  // For development purposes only. If an action enables autoclick, the tutorial will go on automatically until an action will disable the autoclick
  autoclick?: boolean;
}

const AUTO_CLICK_ENABLE = { m: '** START AUTO CLICK ***', autoclick: true };
const AUTO_CLICK_DISABLE = { m: '** STOP AUTO CLICK ***', autoclick: false };

export const tutorialSteps: TutorialStep[] = [
  // Intro
  { m: ['Welcome to Ruba Dungeon, a solitaire dungeon crawler-style card game.', 'I will teach you the basics of the game.'] },
  { m: 'This tutorial covers the rules for EASY mode, but it will highlight differences with NORMAL mode.' },
  { m: 'Note: use the icon on top right of this window to drag it around and have a better view of the game board.' },

  // Game set up
  { m: 'Let’s start the game by setting up the board…' },
  { m: 'I picked a random card among Jacks and Knights. This will be the Hero. The Hero starts with 12 hit points.', h: '.hero.slot' },
  { m: 'All remaining Jacks, Knights and Kings will form the Character Deck (the character deck is hidden in compact layout).' , h: '.character.slot' },
  { m: 'Aces will form the Relic Deck (hidden in compact layout). Later in the game you will se how to obtain relics and what powers they grant you.', h: '.relic.slot' },
  { m: 'The rest of the cards will form the Dungeon Deck (hidden in compact layout).', h: '.dungeon.slot' },

  // Crawling
  { m: 'Now that the board is all set up, you can start the Crawling phase.' },
  { m: 'Draw an Event Card from the Dungeon Deck to see what surprise it holds…', e: '#button-draw' },

  // Gold collect
  { m: 'Good! Gold cards are among your best allies in the dungeon.', h: '.event.slot' },
  { m: 'Collect the card now.', e: '#button-collect' },
  { m: 'Draw another card…', e: '#button-draw' },
  { m: 'What a fortunate day! Collect the Gold Card.', e: '#button-collect' },
  { m: 'Collected gold is saved in the Gold Deck for later use.', h: '.gold.slot' },
  { m: 'Continue by drawing another card from the Dungeon Deck.', e: '#button-draw' },

  // Traps
  { m: 'When an Event Card is Clubs, you are facing a trap.', h: '.event.slot' },
  { m: 'If you had at least 7 Gold to spend in your Gold Deck, you could avoid the trap, but you only have 5 Gold.', h: '.gold.slot' },
  { m: 'You have to face the trap by throwing a Dice.', e: '#button-dice' },
  { m: 'Five! Good shot… but unfortunately not enough. To avoid a trap, you have to throw a 6, or a value that is at least the value of the Event Card. In this case the Event Card Value is 7, so the only way to avoid the trap was to achieve a 6 on your dice.' },
  { m: 'When you face a trap and lose, the Hero will lose health equal to half of the Event Card Value (the half of 7 is 3… we are not taking half values into account). When you face a trap and win, the Hero will pass through unharmed.' },
  { m: 'Click the action button to go on...', e: '#button-dice-fb' },
  { m: 'Draw the next Event Card from the Dungeon Deck.', e: '#button-draw' },

  // Concoctions
  { m: 'Not bad! Cups Event Card represent a concoction. You can always skip a cup card if you want. Otherwise you can challenge the concoction by throwing a dice, or you can buy it by spending an amount of Gold that is equal or greater than the Event Card Value.' },
  { m: 'If you win against Cups (either by dice of by buying it), the Hero will recover health equal to the Event Card Value (in this case, 4), but if your dice value is less that the Event Card value the Hero will lose health equal to half of the Event Card Value (in this case, the half of 4 is 2).' },

  // Buying event card
  { m: 'Winning against a 4 requires throwing a 4, 5 or 6 with the dice. Let’s spend some money instead.'},
  { m: 'When spending at least as much Gold as the Event Card Value, the Event Card is automatically resolved with success. You will lose some money but recover some health. Select the 3 Coins from your gold deck', e: '.gold.slot .c3.ccoins' },
  { m: 'Now select the 2 Coins, too.', e: '.gold.slot .c2.ccoins' },
  { m: 'The total is 5: enough to buy the healing potion. Click the Buy button.', e: '#button-spend' },
  { m: 'The Hero’s health was restored! Note that the Hero HP can never exceed its starting value of 12.', h: '.hero .hp' },

  // Combat
  { m: 'Let’s draw another card…', e: '#button-draw' },
  { m: 'Ouch! Sword Event Cards are enemy encounters. You can skip combats if you have enough Gold, but this time you have to fight the enemy. Choose combat to start the fight.', e: '#button-combat' },
  { m: 'This is your opponent. Enemies will always have a maximum of 6 HP.', h: '.enemy.slot' },
  { m: 'Each combat turn consists of 3 actions. The enemy will play an Action Card at each turn. You will only see the next action card, the others will be covered.', h: '.enemy-action.slot' },
  { m: 'These are the Hero Actions. At each turn you have to choose a card to play against the next enemy card.', h: '.hero-action.slot' },
  { m: 'Next Enemy Action Card is 5 Swords. In combat, Swords cards represent an attack. In this case, after the attack the Hero would lose 5 HP.', h: '.enemy-action.slot .c5.cswords' },
  { m: 'Coin cards in combat represent shields. Select 4 Golds: you will oppose a Shield of value 4 against an attack of value 5, hence losing only 1 HP.', e: '.hero-action.slot .c4.ccoins' },
  { m: 'Click Play Coins to play the action card', e: '#button-play-coins' },
  { m: 'Next Enemy Action card is 4 Clubs. In combat, Clubs represent a particular type of attack that you can parry if you play a Club on your turn.', h: '.enemy-action.slot .c4.cclubs' },
  { m: 'You can attack with 6 Clubs. Since the Enemy will attack with 4 Clubs, he will parry 4 points of your attack but still suffer a damage of 2 HP.', e: '.hero-action.slot .c6.cclubs' },
  { m: 'Click Play Clubs to play the action card', e: '#button-play-clubs' },
  { m: 'Now the enemy will attack with 6 Swords. You must respond with 3 Clubs. Remember that Clubs can only parry another Clubs attack. This clash will result in you losing 6 HP and the Enemy losing 3 HP.', e: '.hero-action.slot .c3.cclubs' },
  { m: 'Click Play Clubs to play the action card', e: '#button-play-clubs' },
  { m: 'You are still both alive, so a new Turn of 3 Actions will start.' },
  { m: 'Next Enemy Action Card is 7 Cups. In combat, Cups heal the character. Attack with 4 Swords. As result, the Enemy will only recover 3 HP.', e: '.hero-action.slot .c4.cswords' },
  { m: 'Click Play Swords to play the action card', e: '#button-play-swords' },
  { m: 'Next Enemy Action Card is 2 Cups: the enemy can heal again. Let’s put an end to this fight. When you have two or three cards of the same value, you can play them as Combo. Select your 4 Clubs', e: '.hero-action.slot .c4.cclubs' },
  { m: 'Now select yout 4 Coins', e: '.hero-action.slot .c4.ccoins' },
  { m: 'When you create a combo, you have to choose a suit among the ones of selected cards. In this case you can choose to play the combo as Gold (thus using a total of 8 shields) or as Clubs (thus dealing a total attack of 8). Choose to play as Clubs: this will defeat the enemy.', e: '#button-play-clubs' },
  { m: 'Your Enemy had 4 HP and healed by 2. By attacking with 8 Clubs, his health went to zero. You can also play a combo in the first action of a turn. In this case, you may have no cards left to respond and will have to withstand the enemy\'s actions.' },

  // After combat
  { m: 'When you defeat an enemy, he will temporarily join your side and wait for your call in the Aid Deck.', h: '.aid.slot' },
  { m: 'When you defeat an enemy King, you will permanently acquire his Relic. We will see what relics are useful for in your next fight.', h: '.obtained-relic.slot' },
  { m: 'When you defeat an enemy, you can choose to keep unused Hero Action Cards in your hands if you have them. With the last combo you used all cards in you hand. Let’s the crawling continue…', e: '#button-draw' },  

  // Collect gold
  { m: 'Collect the Gold and continue crawling…', e: '#button-collect' },
  { m: 'Collect the Gold and continue crawling…', e: '#button-draw' },

  // Skip combat
  { m: 'Another encounter. If you can spend an exact amount of Gold you can skip the fight altogether. Select your 5 Gold and go on' , e: '.gold.slot .c5.ccoins' },
  { m: 'Another encounter. If you can spend an exact amount of Gold you can skip the fight altogether. Select your 5 Gold and go on' , e: '#button-spend' },
  
  // Collect gold (X2)
  { m: 'Draw another card…', e: '#button-draw' },
  { m: 'Collect the Gold and continue crawling…', e: '#button-collect' },
  { m: 'Collect the Gold and continue crawling…', e: '#button-draw' },
  { m: 'Collect the Gold and continue crawling…', e: '#button-collect' },
  { m: 'Collect the Gold and continue crawling…', e: '#button-draw' },
  
  // Bribe (stealth kill)
  { m: 'Swords, again. If you spend more Gold than the Event Card Value, you can try to bribe the enemy. Select your 6 Gold and go on…', e: '.gold.slot .c6.ccoins' },
  { m: 'Swords, again. If you spend more Gold than the Event Card Value, you can try to bribe the enemy. Select your 6 Gold and go on…', e: '#button-spend' },
  { m: 'When you bribe an enemy, it will join your aids.', e: '#button-accept-aid' },
  
  // King bribe (combat 2: aids and relics)
  { m: 'Draw another card…', e: '#button-draw' },
  { m: 'Another encounter. Try to bribe your enemy again…', e: '.gold.slot .c7.ccoins' },
  { m: 'Another encounter. Try to bribe your enemy again…', e: '#button-spend' },
  { m: 'Kings cannot be bribed: you lost you gold and must fight your opponent', e: '#button-reveal-combat' },
  { m: 'Oh no. The enemy is attacking with 7 Swords. Even if you use 2 Coins for shielding or 2 Cups for healing, you will be left with no HP and die...' },
  { m: 'But wait! You have an ally on your side. You can spend one or more aid cards having the same suit as your selected card to increase its effect.' },
  { m: 'You want to ask to the Jack of Cups for help, so you have to play the 2 Cups. Select it...', e: '.hero-action.slot .c2.ccups' },
  { m: 'Now select your ally...', e: '.aid.slot .c8.ccups' },
  { m: 'By using this combination, you will face 7 damage but heal for 3 HP, leaving you with 1 HP.', e: '#button-play-cups' },
  { m: 'Once used, your allies are discarded, so you can use them only once.', h: '.aid.slot' },
  { m: 'Now your enemy is attacking you with 4 Clubs. Select your 3 Clubs...', e: '.hero-action.slot .c3.cclubs' },
  { m: 'Since you possess a Clubs relic, all your Clubs cards will be automatically increased by 1.', h: '.obtained-relic.slot' },
  { m: 'By playing your 3 Clubs now, you will parry a total amount of 4, leaving your HP untouched.', e: '#button-play-clubs' },
  { m: 'The enemy won\' attack you with this action. Unfortunately, you can\' attack either.', e: '.hero-action.slot .c2.ccoins' },
  { m: 'The enemy won\' attack you with this action. Unfortunately, you can\' attack either.', e: '#button-play-coins' },
  { m: 'That is you change. Select 6 Clubs...', e: '.hero-action.slot .c6.cclubs' },
  { m: 'The enemy will parry 2 of you attack. Even with your relic, he will survive with 2 HP.' },
  { m: 'Fortunately you can combine relics and aids. Select your ally.', e: '.aid.slot .c10.cclubs' },
  { m: 'With this combination you will inflict a total damage of 8. The enemy will parry 2 but still suffer 6 damage, thus defeating it.', e: '#button-play-clubs' },
  
  // Keep card
  { m: 'Remember that after a combat you can select one or more of your action cards and keep them for your next encounter.', 'h': '.hero-action.slot' },
  { m: 'Choose to keep your 5 Coins.', 'e': '.hero-action.slot .c5.ccoins' },
  { m: 'Choose to keep your 5 Coins.', 'e': '#button-keep' },

  // Done
  { m: 'This concludes the tutorial.' },
  { m: 'To win the game, you have to defeat all 4 kings and collect their relics.' },
  { m: 'Now, click next to go back to the game.' },
]