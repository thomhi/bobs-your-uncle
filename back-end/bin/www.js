const express = require('express');
const { disconnect } = require('process');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const Game = require('../game');
const mongoose = require('mongoose');
const AnswerCard = require('../models/answerCard');
const QuestionCard = require('../models/questionCards');
const authRoute = require('../routes/auth');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

mongoose.connect("mongodb://root:password@localhost:7777/bobsDB?authSource=admin",{
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

app.use(allowCrossDomain);

app.use(express.json());

app.use('/user', authRoute);


//const server = app.listen(8080);
const server = app.listen(9999);


/*mongoose.connect("mongodb://root:password@bobsdb:27017/bobsDB?authSource=admin",{
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});*/



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
async function verifyToken(socket,  next){
  let xsrfToken = socket.handshake.headers['x-xsrf-token'];
  let cookie = socket.request.headers.cookie;

  if (cookie && xsrfToken) {
    const token = parseCookie(cookie);
    try {
      socket.request.user = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err){
      next(new Error("invalid"));
      return;
    }
    next();
  } else{
    next(new Error("invalid"));
  }
}

io.use((socket, next) => verifyToken(socket, next));
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

