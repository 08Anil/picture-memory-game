var Game = {

  settings: {
    rows: 2,
    columns: 3
  },

  cards: [],

  initialize: function(rows, columns) {
    var validOptions = true;

    if (validOptions) {
      this.settings.rows = rows;
      this.settings.columns = columns;
      this.createCards(25).shuffleCards(rows * columns);
    }

    return this.cards;
  },


  createCards: function(max) {
    var cards = [];
    var count = 0;
    var maxValue = max
    while (count < maxValue) {
      cards[count] = new this.Card(count + 1);
      count++;
    }

    this.cards = cards;

    return this;
  },

  shuffleCards: function(limit) {
    var cards = this.cards;
    var shuffledCards = [];
    var randomIndex = 0;

    while (shuffledCards.length < limit) {
      randomIndex = Math.floor(Math.random() * 25);
      if (cards[randomIndex]) {
        shuffledCards.push(cards[randomIndex]);
        cards[randomIndex] = false;
      }
    }
    this.cards = shuffledCards;

    return this;
  },

  play: (function() {
    var revealedCards = 0;

    return function(index) {
      var status = {};
      var value = this.cards[index].value;
      var imageToCheck = document.getElementById('findImage');

      if (!this.cards[index].isRevealed) {
        this.cards[index].reveal();
        if (value == parseInt(imageToCheck.className.split('-')[1])) {
          status.code = 1;
          status.message = "Match";
          revealedCards++;
          if (revealedCards === this.cards.length) {
            revealedCards = 0;
            status.code = 0;
            status.message = "Game Over";
          }
        } else {
          this.cards[index].conceal();
          status.code = 2;
          status.message = "No match";
          status.index = index;
        }
      } else {
        status.code = -1;
        status.message = 'Card is already facing up.';
      }

      return status;

    };
  })()

};
