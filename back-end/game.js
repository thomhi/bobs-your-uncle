const AnswerCard = require('./models/answerCard');
const QuestionCard = require('./models/questionCards');

class Game{
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
    

    joinRoom(socket, username){
      this.player.push(username);
      this.sockets.set(username, socket);
      socket.join(this.room);
      socket.emit("message", 'joined room');
      socket.emit("playersInLobby", {users: this.player});
      socket.to(this.room).emit("playersInLobby", {users: this.player});
      console.log('joinRoom');
      console.log('user: ' + username);
      console.log('players: ' + this.player);
    }

    startGame(){
        let questionCard = this.questionCards[Math.floor(Math.random() * this.questionCards.length)];
        this.player.forEach(username => {
          const socket = this.sockets.get(username);
          let playerAnswerCards = [];
          for(let i = 0; i < 10; i++){
              playerAnswerCards.push(this.answerCards[Math.floor(Math.random() * this.answerCards.length)]);
          }
          this.playerHands.set(username, playerAnswerCards);
          socket.emit("handOutCards", {questionCard, playerAnswerCards});
      });
        this.decider = 0;
        this.startRound();
    }

    startRound(){
      this.receivedCardsNum = 0;
      let questionCard = this.questionCards[Math.floor(Math.random() * this.questionCards.length)];
      this.player.forEach(username => {
        const socket = this.sockets.get(username);
        let currentHand  = this.playerHands.get(username);
        socket.emit("handOutCards", {questionCard, currentHand});
        socket.emit("score", this.wins);
      });
      const deciderSocket = this.sockets.get(this.player[this.decider]);
      deciderSocket.emit('isDecider', true);
    }

    receivedCards(cards, socket, username){
        this.receivedCardsNum++;
        let array = [];
        
        if(this.player[this.decider] !== username){
          for(let j = 0; j < this.playerHands.get(username).length; j++){
            for(let i = 0; i < cards.length; i++){
                if(this.playerHands.get(username)[j]._id == cards[i]._id){
                    array.push(this.playerHands.get(username)[j]);
                    this.playerHands.get(username)[j] = this.answerCards[Math.floor(Math.random() * this.answerCards.length)];
                    break;
                }
            }

          }
          this.playerChosenHand.set(username, array);
          console.log(this.playerChosenHand.entries());
        }
        
        if(this.receivedCardsNum == this.player.length-1){
            this.sendChoices(socket);
        }
    }

    sendChoices(socket){
      socket.emit('choices', this.playerChosenHand);
      socket.to(this.room).emit('choices', this.playerChosenHand);
    }

    receivedChoice(socket, username, winnerUsername){
      if (username === this.player[this.decider]) {
        if (this.wins.get(winnerUsername) >= 1) {
          this.wins.set(winnerUsername, this.wins.get(winnerUsername) + 1);
        } else {
          this.wins.set(winnerUsername, 1);
        }
      }
      socket.emit("winnerAnnouncement", {winnerUsername, cards: this.playerChosenHand.get(winnerUsername)});
      this.decider++;
    }

}

module.exports = Game;