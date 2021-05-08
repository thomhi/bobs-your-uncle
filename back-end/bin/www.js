const express = require("express");
const { disconnect } = require("process");
const socketio = require("socket.io");
const redisAdapter = require("socket.io-redis");
const Game = require("../game");
const mongoose = require("mongoose");
const AnswerCard = require("../models/answerCard");
const QuestionCard = require("../models/questionCards");
const authRoute = require("../routes/auth");
const jwt = require("jsonwebtoken");
const socketioJwt = require('socketio-jwt');
var redis = require("redis");
require("dotenv").config();

const app = express();

/*mongoose.connect(
  "mongodb://root:password@localhost:7777/bobsDB?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);*/

mongoose.connect(
  "mongodb://root:password@bobsdb:27017/bobsDB?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};

app.use(allowCrossDomain);

app.use(express.json());

app.use("/user", authRoute);

const server = app.listen(8080);
//const server = app.listen(9999);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let games = new Map();

let answerCards = [];
let questionCards = [];

async function getCards() {
  answerCards = await AnswerCard.find({}).exec();
  questionCards = await QuestionCard.find({}).exec();
}

io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

io.use(socketioJwt.authorize({
  secret: process.env.TOKEN_SECRET,
  handshake: true
}));

var pub = redis.createClient({
  port: 6379,
  host: 'redis',
});
var sub = redis.createClient({
  port: 6379,
  host: 'redis',
});

sub.subscribe('joinRoom');
sub.subscribe('startGame');
sub.subscribe('answer');
sub.subscribe('winner');
sub.subscribe('newRound');
sub.subscribe('disconnect');

sub.on('message', function (channel, message) {
  const obj = JSON.parse(message);
  switch(channel){
    case "joinRoom":
      if (!games.has(obj.room)) {
        game = new Game(obj.room, answerCards, questionCards);
        games.set(obj.room, game);
        game.joinRoomInName(obj.username);
      } else {
        if (!games.get(obj.room).getPlayers().includes(obj.username)) {
          games.get(obj.room).joinRoomInName(obj.username);
        }
      }
      break;
    case "startGame":
      games.get(message).startGame();
      break;
    case "answer":
      games.get(obj.room).receivedCards(obj.cards, obj.username);
      break;
    case "winner":
      games.get(obj.room).receivedChoice(obj.username, obj.winnerUsername);
      break;
    case "newRound":
      games.get(message).startRound();
      break;
    case "disconnect":
      console.log('disc');
      games.get(obj.room).leaveRoom(obj.username, () => {
        games.delete(obj.room);
      });
  }
});

getCards();

io.on('connection', (socket) => {
  console.log(socket.decoded_token.username);
  let username = socket.decoded_token.username;
  socket.on("joinRoom", ({ room }) => {
    pub.publish("joinRoom", JSON.stringify({ username, room }));
    if (!games.has(room)) {
      game = new Game(room, answerCards, questionCards);
      games.set(room, game);
      game.joinRoom(socket, username, (users) =>{
        io.to(room).emit("playersInLobby", { users });
      });
    } else {
      if (!games.get(room).getPlayers().includes(username)) {
        games.get(room).joinRoom(socket, username, (users) =>{
          io.to(room).emit("playersInLobby", { users });
        });
      }
    }
    socket.on("startGame", () => {
      pub.publish("startGame", room);
    });
    socket.on("answer", (cards) => {
      pub.publish("answer", JSON.stringify({ username, cards, room }));
    });
    socket.on("winner", (username, winnerUsername) => {
      pub.publish("winner", JSON.stringify({ username, winnerUsername, room }));
    });
    socket.on("newRound", () => {
      pub.publish("newRound", room);
    });
    socket.on("disconnect", () => {
      pub.publish("disconnect", JSON.stringify({room, username}));
    });
  });
});