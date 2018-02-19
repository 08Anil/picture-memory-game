(function($) {

  var handlePlay = function(rows = 3, columns = 3) {
    var cards = $.initialize(rows, columns);
    if (cards) {
      buildLayout($.cards, $.settings.rows, $.settings.columns);
    }
  };

  var restart = function(event) {
    event.preventDefault();
    event.target.style.setProperty('visibility', 'hidden');
    var image = document.getElementById('findImage');
    var display = document.querySelector('#time');
    image.classList = [];
    handlePlay(3, 3);
    startTimer(20, display);
  };

  var showRestartOption = function() {
    var restartBtn = document.getElementById('restart-game');
    restartBtn.setAttribute('style', 'visibility:visible');
  }

  var handleFlipCard = function(event) {
    event.preventDefault();
    var status = $.play(this.index);
    if (status.code != -1) {
      this.classList.toggle('clicked');
    }
    if (status.code == 2) {
      setTimeout(function() {
        var childNodes = document.getElementById('memory--cards').childNodes;
        childNodes[status.index].classList.remove('clicked');
      }.bind(status), 500);
    } else if (status.code === 0) {
      showRestartOption();
    } else if (status.code === 1) {
      setTimeout(function() {
        setImageToFind();
      }, 500);
    }
  };

  var buildLayout = function(cards, rows, columns) {
    if (!cards.length) {
      return;
    }
    var memoryCards = document.getElementById("memory--cards");
    var index = 0;
    var cardMaxWidth = document.getElementById('memory--app-left').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);
    var cardMaxHeight = document.getElementById('memory--app-left').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);
    while (memoryCards.firstChild) {
      memoryCards.firstChild.removeEventListener('click', handleFlipCard);
      memoryCards.removeChild(memoryCards.firstChild);
    }
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        memoryCards.appendChild(buildCardNode(
          index, cards[index].value, cards[index].isRevealed,
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }
    if (cardMaxHeight > cardHeightForMaxWidth) {
      memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      memoryCards.style.width = document.getElementById('memory--app-left').offsetWidth + "px";
      memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
    } else {
      memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      memoryCards.style.height = document.getElementById('memory--app-left').offsetHeight + "px";
      memoryCards.style.top = 0;
    }
  };

  window.addEventListener('resize', function() {
    buildLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  var restartGame = document.getElementById('restart-game');
  restartGame.addEventListener('click', restart);

  var buildCardNode = function(index, value, isRevealed, width, height) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.classList.add("flip-container");
    if (isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + value);
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };

  var setImageToFind = function() {
    var image = document.getElementById('findImage');
    while (true) {
      var card = $.cards[Math.floor(Math.random() * $.cards.length)];
      if (!card.isRevealed) {
        image.classList = [];
        image.classList.add("card-" + card.value);
        break;
      } else {
        continue;
      }
    }
  }

  var startTimer = function(duration, display) {
    var timer = duration,
      minutes, seconds;
    var id = setInterval(function() {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = 0;
        clearInterval(id);
        startGame();

      }
    }, 1000);
  }

  var hideLoader = function() {
    var loader = document.getElementById('loader');
    loader.classList.remove('show');
  }

  var startGame = function() {
    var lis = document.getElementsByTagName('li');
    var cards = $.cards;
    for (var i = 0; i < lis.length; i++) {
      lis[i].classList.remove('clicked');
      cards[i].isRevealed = false;
    }
    setImageToFind();
  }

  handlePlay(3, 3);
  var id;
  if (id) {
    clearInterval(id);
  }
  id = setTimeout(hideLoader, 2000);
  startTimer(20, document.querySelector('#time'));

})(Game);
