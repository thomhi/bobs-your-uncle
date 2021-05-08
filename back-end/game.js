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
    socket.join(this.room);
    socket.emit("message", 'joined room');
    callback(this.player);
    console.log(this.room);
    console.log(this.player);
    //io.to(this.room).emit("playersInLobby", { users: this.player });
    //socket.emit("playersInLobby", { users: this.player });
    //socket.to(this.room).emit("playersInLobby", { users: this.player });
  }

  joinRoomInName(username) {
    console.log(this.room);
    this.player.push(username);
  }

  leaveRoom(username, closeRoom) {
    this.player = this.player.filter((elem) => !(elem === username));
    this.sockets.delete(username);
    this.sockets.forEach((value)=>{
      value.emit("playersInLobby", { users: this.player });
    });
    console.log(this.player);
    if (this.player.length === 0) {
      closeRoom();
    }
  }

  startGame() {
    this.player.forEach(username => {
      let playerAnswerCards = [];
      for (let i = 0; i < 10; i++) {
        playerAnswerCards.push(this.answerCards[Math.floor(Math.random() * this.answerCards.length)]);
      }
      this.playerHands.set(username, playerAnswerCards);
    });
    this.decider = 0;
    this.startRound();
  }

  startRound() {
    this.receivedCardsNum = 0;
    let questionCard = this.questionCards[Math.floor(Math.random() * this.questionCards.length)];
    this.sockets.forEach((value, key) => {
      const socket = value;
      let currentHand = this.playerHands.get(key);
      socket.emit("handOutCards", { questionCard, currentHand });
      socket.emit("score", this.wins);
      if(key === this.player[this.decider]){
        socket.emit('isDecider', true);
      }
    });
  }

  receivedCards(cards, username) {
    this.receivedCardsNum++;
    let array = [];

    if (this.player[this.decider] !== username && this.sockets.get(username) !== undefined) {
      for (let j = 0; j < this.playerHands.get(username).length; j++) {
        for (let i = 0; i < cards.length; i++) {
          if (this.playerHands.get(username)[j]._id == cards[i]._id) {
            array.push(this.playerHands.get(username)[j]);
            this.playerHands.get(username)[j] = this.answerCards[Math.floor(Math.random() * this.answerCards.length)];
            break;
          }
        }
      }
      this.playerChosenHand.set(username, array);
      console.log(this.playerChosenHand.entries());
    }

    if (this.receivedCardsNum == this.player.length - 1) {
      this.sockets.forEach((value)=>{
        value.emit('choices', this.playerChosenHand)
      });
    }
  }

  sendChoices(socket) {
    socket.emit('choices', this.playerChosenHand);
    socket.to(this.room).emit('choices', this.playerChosenHand);
  }

  receivedChoice(username, winnerUsername) {
    if (username === this.player[this.decider]) {
      if (this.wins.get(winnerUsername) >= 1) {
        this.wins.set(winnerUsername, this.wins.get(winnerUsername) + 1);
      } else {
        this.wins.set(winnerUsername, 1);
      }
    }
    this.sockets.forEach((value)=>{
      value.emit("winnerAnnouncement", { winnerUsername, cards: this.playerChosenHand.get(winnerUsername) });
    });
    this.decider++;
  }

}

module.exports = Game;