import { style } from './style.js'
import { deck, player } from './class.js'
import { design } from './design.js'

// this is my off brand node readline() that works in browsers
Object.defineProperty(window, 'Start', {
  get: function() {
    console.clear()
    console.log(`%c${design.shuffle}`,style.shuffle);
    startGame();
  }
});
Object.defineProperty(window, 'Reset', {
  get: function() {
    if (typeof newGame === typeof undefined || newGame === null) {
      console.error(`The game hasn't started!`)
    } else {
      console.clear()
      console.log('%cResetting', style.reset)
      wait(500)
      console.clear()
      console.log('%cResetting.', style.reset);
      wait(500)
      console.clear()
      console.log('%cResetting..', style.reset);
      wait(500)
      console.clear()
      console.log('%cResetting...', style.reset);
      wait(500)
      window.newGame = null
      console.clear()
      isReady();
    }
  }
});
Object.defineProperty(window, 'autoplay', {
  get: function() {
    console.clear()
    window.newGame = new game();
    newGame.deal();
    while (newGame.active === true) {
      newGame.checkCards()
      if (newGame.active === true) {
      newGame.battle();
      newGame.battleNum++
    } else {
      gameEnd(newGame.winner)
    }
    }
  }
})
// yes I really like ascii
isReady();
function isReady() {
console.log(`%c${design.title}`, style.isReady);
console.log(`%c⬇Enter Start to start the game⬇`, style.isReady2,)
}
function startGame(){
    window.newGame = new game();
    newGame.deal();
    //here is where I want the pause to happen until the user presses "enter" key
    function after(){
      newGame.checkCards()
      if (newGame.active === true) {
      newGame.battle();
      newGame.battleNum++
    } else {
      gameEnd(newGame.winner)
    }
      //wait(500);
        //Below is what I want to happen after the "enter" key has been pressed.
    }
    let keydownHandler = function(e) {
        if (e.keyCode === 13 && newGame.active) {  // 13 is the enter key
            after();
        }
    }
    // register your handler method for the keydown event
      document.addEventListener('keydown', keydownHandler);

}

function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

function gameEnd(winner) {
  console.log(`congrats, ${winner.name}. Play again?`);
}

class game {
  constructor() {
    this.active = true;
    this.newDeck = new deck()
    this.newDeck.shuffle(this.newDeck.cards)
    this.battleNum = 1;
    this.player1 = new player(prompt('Enter the name of player one:'))
    this.player2 = new player(prompt('Enter the name of player two:'))
  }
//I really wanted to make this dependent on the deck length but I couldn't make it work
  deal() {
    for (let i = 0; i < 26; i++) {
      let card1 = this.newDeck.cards.shift()
      let card2 = this.newDeck.cards.shift()
      this.player1.hand.push(card1)
      this.player2.hand.push(card2)
    }
  }
  endGame(player) {
    console.log(`woah ${player.name} won
      and now we done`);
    this.winner = player
    this.active = false;
  }
  checkCards() {
    this.player1.hand = this.player1.hand.filter(x=>x!=null)
    this.player2.hand = this.player2.hand.filter(x=>x!=null)
    this.player1.discard = this.player1.discard.filter(x=>x!=null)
    this.player2.discard = this.player2.discard.filter(x=>x!=null)
    if (this.player1.hand === undefined || this.player1.hand.length == 0) {
      if (this.player1.discard.length > 0 ) {
        this.player1.hand = this.newDeck.shuffle(this.player1.discard)
        this.player1.discard = []
        console.log(`${this.player1.name} just had to refill`);
    } else {
      //if both the discard and the hand are empty, end the game
        this.endGame(this.player2)
    }
  } if (this.player2.hand === undefined || this.player2.hand.length == 0) {
      if (this.player2.discard.length > 0) {
        this.player2.hand = this.newDeck.shuffle(this.player2.discard)
        this.player2.discard = []
        console.log(`${this.player2.name} just had to refill`);
      } else {
      this.endGame(this.player1)
    }
    } else {
      console.log('we good');
    }
  }
  war() {
    console.log(`oh you're both fucked now`);
    this.checkCards()
    this.player1.warDraw()
    this.player2.warDraw()
    //this filters out any undefined items created during the loops
    //there are definitley better ways to do this
    this.player1.warCards = this.player1.warCards.filter(x=>x!=null)
    this.player2.warCards = this.player2.warCards.filter(x=>x!=null)
    if (this.player1.warCards[this.player1.warCards.length-1].score > this.player2.warCards[this.player2.warCards.length-1].score) {
      console.log(`You may have won the battle, ${this.player1.name}, but not the war- ...oh wait`);
      for (var i of this.player1.warCards) {
        this.player1.discard.push(this.player1.warCards[i])
      } for (var i of this.player2.warCards) {
        this.player1.discard.push(this.player2.warCards[i])
      }
    } else if (this.player1.warCards[this.player1.warCards.length-1].score < this.player2.warCards[this.player2.warCards.length-1].score) {
      console.log(`You may have won the battle, ${this.player2.name}, but not the war- ...oh wait`);
      for (var i of this.player1.warCards) {
        this.player2.discard.push(this.player1.warCards[i])
      } for (var i of this.player2.warCards) {
        this.player2.discard.push(this.player2.warCards[i])
      }
    }
    this.player1.warCards = []
    this.player2.warCards = []
  }
  battle() {
      console.log(`%cBattle ${this.battleNum}`,style.battleNum)
      this.player1.draw()
      this.player2.draw()
      wait(500)
      console.log(`%c${this.player1.card.display} %c${this.player2.card.display}`, this.player1.card.redOrBlack(), this.player2.card.redOrBlack());
      if (this.player1.card.score > this.player2.card.score) {
        console.log(`${this.player1.name} wins lol`)
        this.player1.discard.push(this.player1.card, this.player2.card)
      } else if (this.player1.card.score < this.player2.card.score) {
        console.log(`${this.player2.name} wins lol`);
        this.player2.discard.push(this.player1.card, this.player2.card)
      } else if (this.player1.card.score === this.player2.card.score) {
        this.war(); //oooo scary
      }
  }
}
