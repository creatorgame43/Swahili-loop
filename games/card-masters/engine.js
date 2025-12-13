// 🃏 Card Masters - Game Engine
// Blackjack, Poker, Solitaire games

class CardDeck {
  constructor() {
    this.suits = ['♠', '♥', '♦', '♣'];
    this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.cards = this.createDeck();
    this.shuffle();
  }

  createDeck() {
    const deck = [];
    for (let suit of this.suits) {
      for (let rank of this.ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.cards.length === 0) {
      this.cards = this.createDeck();
      this.shuffle();
    }
    return this.cards.pop();
  }
}

class Blackjack {
  constructor(config = {}) {
    this.bet = config.bet || 10;
    this.balance = config.balance || 1000;
    this.deck = new CardDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.gameState = 'betting'; // betting, playing, dealerTurn, finished
    this.coinsEarned = 0;
    this.playerValue = 0;
    this.dealerValue = 0;
    this.dealCards();
  }

  dealCards() {
    this.playerHand = [this.deck.drawCard(), this.deck.drawCard()];
    this.dealerHand = [this.deck.drawCard(), this.deck.drawCard()];
    this.updateValues();
    this.gameState = 'playing';

    if (this.playerValue === 21) {
      this.finishGame('blackjack');
    }
  }

  updateValues() {
    this.playerValue = this.calculateHand(this.playerHand);
    this.dealerValue = this.calculateHand(this.dealerHand);
  }

  calculateHand(hand) {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  }

  hit() {
    this.playerHand.push(this.deck.drawCard());
    this.updateValues();

    if (this.playerValue > 21) {
      this.finishGame('bust');
    }
  }

  stand() {
    this.gameState = 'dealerTurn';
    
    while (this.dealerValue < 17) {
      this.dealerHand.push(this.deck.drawCard());
      this.updateValues();
    }

    this.determineWinner();
  }

  determineWinner() {
    if (this.dealerValue > 21) {
      this.finishGame('dealerBust');
    } else if (this.playerValue > this.dealerValue) {
      this.finishGame('playerWin');
    } else if (this.dealerValue > this.playerValue) {
      this.finishGame('dealerWin');
    } else {
      this.finishGame('push');
    }
  }

  finishGame(result) {
    this.gameState = 'finished';

    switch (result) {
      case 'blackjack':
        this.coinsEarned = Math.floor(this.bet * 2.5);
        break;
      case 'playerWin':
      case 'dealerBust':
        this.coinsEarned = this.bet * 2;
        break;
      case 'push':
        this.coinsEarned = this.bet;
        break;
      case 'bust':
      case 'dealerWin':
        this.coinsEarned = 0;
        break;
    }
  }

  getGameState() {
    return {
      gameState: this.gameState,
      playerHand: this.playerHand,
      dealerHand: this.dealerHand,
      playerValue: this.playerValue,
      dealerValue: this.dealerValue,
      bet: this.bet,
      coinsEarned: this.coinsEarned
    };
  }
}

class SimplifiedPoker {
  constructor(config = {}) {
    this.playerCoins = config.playerCoins || 1000;
    this.aiCoins = 1000;
    this.bet = config.bet || 50;
    this.deck = new CardDeck();
    this.playerHand = [];
    this.aiHand = [];
    this.pot = 0;
    this.gameState = 'playing';
    this.coinsEarned = 0;
    this.dealCards();
  }

  dealCards() {
    this.playerHand = [this.deck.drawCard(), this.deck.drawCard()];
    this.aiHand = [this.deck.drawCard(), this.deck.drawCard()];
    this.pot = this.bet * 2;
  }

  call() {
    this.gameState = 'showdown';
    this.determineWinner();
  }

  fold() {
    this.coinsEarned = 0;
    this.gameState = 'finished';
  }

  raise(amount) {
    this.pot += amount;
    this.playerCoins -= amount;

    if (Math.random() > 0.5) {
      this.gameState = 'showdown';
      this.determineWinner();
    }
  }

  getHandStrength(hand) {
    // Simplified scoring
    const values = hand.map(card => {
      if (card.rank === 'A') return 14;
      if (card.rank === 'K') return 13;
      if (card.rank === 'Q') return 12;
      if (card.rank === 'J') return 11;
      return parseInt(card.rank);
    });

    return values.reduce((a, b) => a + b, 0);
  }

  determineWinner() {
    const playerStrength = this.getHandStrength(this.playerHand);
    const aiStrength = this.getHandStrength(this.aiHand);

    if (playerStrength > aiStrength) {
      this.coinsEarned = this.pot;
    } else {
      this.coinsEarned = 0;
    }

    this.gameState = 'finished';
  }

  getGameState() {
    return {
      gameState: this.gameState,
      playerHand: this.playerHand,
      playerCoins: this.playerCoins,
      aiCoins: this.aiCoins,
      pot: this.pot,
      bet: this.bet,
      coinsEarned: this.coinsEarned
    };
  }
}

module.exports = { Blackjack, SimplifiedPoker, CardDeck };
