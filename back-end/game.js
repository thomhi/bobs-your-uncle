const { RequestHeaderFieldsTooLarge } = require('http-errors');
const AnswerCard = require('./models/answerCard');
const QuestionCard = require('./models/questionCards');

class Game{
    player = [];
    questionCards = [];
    answerCards = [];
    room;
    playerHands = new Map();
    playerChosenHand = new Map();
    wins = new Map();
    receivedCardsNum = 0;
    decider = 0;

    
    constructor(room,answerCards, questionCards) {
        this.room = room;
        this.answerCards = answerCards;  
        this.questionCards = questionCards;
    }
    

    joinRoom(socket){
      console.log('joinRoom');
      this.player.push(socket);
      socket.join(this.room);
      // socket.emit("playersInLobby", [usernames])
      // socket.emit.broadcast("playersInLobby", [usernames])
      socket.emit("message", 'joined room')
    }

    startGame(){
        /*this.player.forEach(socket => {
            socket.broadcast.to(this.room).emit('message', 'game starting');
        });*/
        let questionCard = this.questionCards[Math.floor(Math.random() * this.questionCards.length)];
        this.player.forEach(socket => {
          let playerAnswerCards = [];
          for(let i = 0; i < 10; i++){
              playerAnswerCards.push(this.answerCards[Math.floor(Math.random() * this.answerCards.length)]);
          }
          this.playerHands.set(socket, playerAnswerCards);
          socket.emit("handOutCards", {questionCard, playerAnswerCards});
      });
        this.decider = 0;
        this.startRound();
    }

    startRound(){
      this.receivedCardsNum = 0;
      let questionCard = this.questionCards[Math.floor(Math.random() * this.questionCards.length)];
      this.player.forEach(socket => {
        let currentHand  = this.playerHands.get(socket);
        socket.emit("handOutCards", {questionCard, currentHand});
      });
      this.player[this.decider].emit('message', 'decider');
      // send score socket braoad cast send wins Map
    }

    receivedCards(cards, socket){
        this.receivedCardsNum++;
        let array = [];
        
        if(this.player[this.decider] !== socket){
          for(let j = 0; j < this.playerHands.get(socket).length; j++){
            for(let i = 0; i < cards.length; i++){
                if(this.playerHands.get(socket)[j]._id == cards[i]._id){
                    array.push(this.playerHands.get(socket)[j]);
                    this.playerHands.get(socket)[j] = this.answerCards[Math.floor(Math.random() * this.answerCards.length)];
                    break;
                }
            }

          }
          // Change socket to username
          this.playerChosenHand.set(socket, array);
          console.log(this.playerChosenHand.entries());
        }
        
        if(this.receivedCardsNum == this.player.length-1){
            console.log('true boiii')
            this.sendChoices();
        }
    }

    sendChoices(){
      socket.broadcast.to(this.room).emit('choices', this.playerChosenHand);
    }

    receivedChoice(socket, winnerSocket){
      if (socket === this.player[this.decider]) {
        if (this.wins.get(winnerSocket) >= 1) {
          this.wins.set(winnerSocket, this.wins.get(winnerSocket) + 1);
        } else {
          this.wins.set(winnerSocket, 1);
        }
      }
      //socket. broadcast winnerAnnouncement {username, [cards]}
      this.decider++;
      //this.startRound();
    }

}

module.exports = Game;