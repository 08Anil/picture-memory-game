Game.Card = function(value) {
  this.value = value;
  this.isRevealed = true;

  this.reveal = function() {
    this.isRevealed = true;
  }

  this.conceal = function() {
    this.isRevealed = false;
  }
};
