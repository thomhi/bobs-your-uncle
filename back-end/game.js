class Game {
  player = [];
  sockets = new Map();
  questionCards = [];
  answerCards = [];
  usernames = [];
  room;
  playerHands = new Map();
  playerChosenHand = new Map();
  wins = new Map();
  receivedCardsNum = 0;
  decider = 0;
  gameStarted=false;
  roundStarted=false;
  alreadyReceived=false;

  NUMBER_OF_PLAYER_CARDS = 12;

  constructor(room, answerCards, questionCards) {
    this.room = room;
    this.answerCards = answerCards;
    this.questionCards = questionCards;
  }

  getPlayers() {
    return this.player;
  }

  joinRoom(socket, username, callback) {
    this.player.push(username);
    this.sockets.set(username, socket);
    this.wins.set(username, 0);
    socket.join(this.room);
    callback(this.player);
  }

  joinRoomInName(username) {
    this.player.push(username);
    this.wins.set(username, 0);
  }

  leaveRoom(username, closeRoom) {
    this.player = this.player.filter((elem) => !(elem === username));
    this.sockets.delete(username);
    this.sockets.forEach((value) => {
      value.emit("playersInLobby", { users: this.player });
    });
    if (this.player.length === 0) {
      closeRoom();
    }
  }

  startGame(publishQuestionCard) {
    if (this.gameStarted) return;
    this.gameStarted=true;
    this.player.forEach((username) => {
      let playerAnswerCards = [];
      for (let i = 0; i < this.NUMBER_OF_PLAYER_CARDS; i++) {
        playerAnswerCards.push(
          this.answerCards[Math.floor(Math.random() * this.answerCards.length)]
        );
      }
      this.playerHands.set(username, playerAnswerCards);
    });
    this.decider = 0;
    this.startRoundMain(publishQuestionCard);
  }

  startGameWithQuestionCard(questionCard) {
    if (this.gameStarted) return;
    this.gameStarted=true;
    this.player.forEach((username) => {
      let playerAnswerCards = [];
      for (let i = 0; i < this.NUMBER_OF_PLAYER_CARDS; i++) {
        playerAnswerCards.push(
          this.answerCards[Math.floor(Math.random() * this.answerCards.length)]
        );
      }
      this.playerHands.set(username, playerAnswerCards);
    });
    this.decider = 0;
    this.startRoundWithQuestionCard(questionCard);
  }

  startRoundMain(publishQuestionCard) {
    if (this.roundStarted) return;
    this.roundStarted = true;
    this.receivedCardsNum = 0;
    this.alreadyReceived = false;
    this.playerChosenHand=new Map();
    let questionCard = this.questionCards[
      Math.floor(Math.random() * this.questionCards.length)
    ];
    const wins = {};
    for (let [key, values] of this.wins){
      wins[key] = values;
    }
    this.sockets.forEach((value, key) => {
      let currentHand = this.playerHands.get(key);
      value.emit("handOutCards", { questionCard, currentHand });
      value.emit("score", wins);
      if (key === this.player[this.decider]) {
        value.emit("isDecider", true);
      } else {
        value.emit("isDecider", false);
      }
    });
    publishQuestionCard(this.room, questionCard);
  }

  startRoundWithQuestionCard(questionCard) {
    if (this.roundStarted) return;
    this.roundStarted = true;
    this.receivedCardsNum = 0;
    this.alreadyReceived = false;
    this.playerChosenHand=new Map();
    const wins = {};
    for (let [key, values] of this.wins){
      wins[key] = values;
    }
    this.sockets.forEach((value, key) => {
      let currentHand = this.playerHands.get(key);
      value.emit("handOutCards", { questionCard, currentHand });
      value.emit("score", wins);
      if (key === this.player[this.decider]) {
        value.emit("isDecider", true);
      } else {
        value.emit("isDecider", false);
      }
    });
  }

  receivedCards(cards, username) {
    if (cards.length > 0) {
      this.receivedCardsNum++;

      if (this.player[this.decider] !== username) {
        if (this.sockets.get(username)) {
          for (let j = 0; j < this.playerHands.get(username).length; j++) {
            for (let i = 0; i < cards.length; i++) {
              if (this.playerHands.get(username)[j]._id == cards[i]._id) {
                const newPlayerHands = this.playerHands.get(username);
                newPlayerHands[j] = this.answerCards[
                  Math.floor(Math.random() * this.answerCards.length)
                ];
                this.playerHands.set(username, newPlayerHands);
                break;
              }
            }
          }
        }
        this.playerChosenHand.set(username, cards);
      }
      if (this.receivedCardsNum == this.player.length - 1) {
        const res = {};
        for (let [key, values] of this.playerChosenHand){
          res[key] = values;
        }
        this.sockets.forEach((value, key) => {
          value.emit("choices", res);
        });
      }
    }
  }

  receivedChoice(username, winnerUsername) {
    if (!this.alreadyReceived) {
      this.alreadyReceived = true;
    if (username === this.player[this.decider]) {
      if (this.wins.get(winnerUsername) >= 1) {
        this.wins.set(winnerUsername, this.wins.get(winnerUsername) + 1);
      } else {
        this.wins.set(winnerUsername, 1);
      }
    }
    this.sockets.forEach((value, key) => {
      value.emit("winnerAnnouncement", {
        winnerUsername,
        cards: this.playerChosenHand.get(winnerUsername),
      });
    });
    this.roundStarted = false;
    this.decider = (this.decider + 1)%this.player.length;
    }
  }
}

module.exports = Game;
