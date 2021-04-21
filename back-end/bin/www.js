const express = require('express');
const { disconnect } = require('process');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const Game = require('../game');
const mongoose = require('mongoose');
const AnswerCard = require('../models/answerCard');
const QuestionCard = require('../models/questionCards');

import authRouter from '../src/authentication-controller/authRouter';

const app = express();
app.use('/auth', authRouter);
//const server = app.listen(8080);
const server = app.listen(9999);

/*mongoose.connect("mongodb://root:password@bobsdb:27017/bobsDB?authSource=admin",{
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});*/

mongoose.connect("mongodb://root:password@localhost:7777/bobsDB?authSource=admin",{
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

let games = new Map();

let answerCards = [];
let questionCards = [];

async function getCards(){
  answerCards = await AnswerCard.find({}).exec();
  questionCards = await QuestionCard.find({}).exec();
}

//io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

getCards();
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    if(!games.has(room)){
      game = new Game(room, answerCards, questionCards);
      games.set(room, game);
      game.joinRoom(socket);
    }else{
      games.get(room).joinRoom(socket);
    }   
    socket.on('startGame',() =>{
      game.startGame();
    })
    socket.on('answer',(cards) =>{
      game.receivedCards(cards, socket);
    })
  });
});

