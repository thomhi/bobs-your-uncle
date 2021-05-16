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
const socketioJwt = require("socketio-jwt");
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
    useUnifiedTopology: true,
  }
);

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
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
    origin: "http://localhost",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

let games = new Map();
let mapSocketToRoom = new Map();

let answerCards = [];
let questionCards = [];

async function getCards() {
  answerCards = await AnswerCard.find({}).exec();
  questionCards = await QuestionCard.find({}).exec();
}

io.adapter(redisAdapter({ host: "redis", port: 6379 }));

io.use(
  socketioJwt.authorize({
    secret: process.env.TOKEN_SECRET,
    handshake: true,
  })
);

var pub = redis.createClient({
  port: 6379,
  host: "redis",
});
var sub = redis.createClient({
  port: 6379,
  host: "redis",
});

sub.subscribe("joinRoom");
sub.subscribe("startGame");
sub.subscribe("answer");
sub.subscribe("winner");
sub.subscribe("newRound");
sub.subscribe("disconnect");

sub.on("message", function (channel, message) {
  const obj = JSON.parse(message);
  switch (channel) {
    case "joinRoom":
      mapSocketToRoom.set(obj.username, obj.room);
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
      console.log(obj.room);
      games.get(obj.room) && games.get(obj.room).startGameWithQuestionCard(obj.questionCard);
      break;
    case "answer":
      console.log(obj.room);
      games.get(obj.room) && games.get(obj.room).receivedCards(obj.cards, obj.username);
      break;
    case "winner":
      console.log(obj.room);
      games.get(obj.room) && games.get(obj.room).receivedChoice(obj.username, obj.winnerUsername);
      break;
    case "newRound":
      console.log(obj.room);
      games.get(obj.room) && games.get(obj.room).startRoundWithQuestionCard(obj.questionCard);
      break;
    case "disconnect":
      console.log("disc");
      if (games.get(obj.room) !== undefined) {
        games.get(obj.room).leaveRoom(obj.username, () => {
          games.delete(obj.room);
        });
      }
  }
});

getCards();

io.on("connection", (socket) => {
  console.log(socket.decoded_token.username);
  let username = socket.decoded_token.username;
  socket.on("joinRoom", ({ room }) => {
    pub.publish("joinRoom", JSON.stringify({ username, room }));
    if (!games.has(room)) {
      game = new Game(room, answerCards, questionCards);
      games.set(room, game);
      game.joinRoom(socket, username, (users) => {
        io.to(room).emit("playersInLobby", { users });
      });
    } else {
      if (!games.get(room).getPlayers().includes(username)) {
        games.get(room).joinRoom(socket, username, (users) => {
          io.to(room).emit("playersInLobby", { users });
        });
      }
    }
    socket.on("startGame", () => {
      game.startGame((room, questionCard) => {
        let room1 = mapSocketToRoom.get(username);
        pub.publish("startGame", JSON.stringify({room: room1, questionCard}));
      })
      
    });
    socket.on("answer", (cards) => {
      let room1 = mapSocketToRoom.get(username);
      pub.publish("answer", JSON.stringify({ username, cards, room: room1 }));
    });
    socket.on("winner", ({winnerUsername}) => {
      console.log('winnerUsername', winnerUsername);
      let room1 = mapSocketToRoom.get(username);
      pub.publish("winner", JSON.stringify({ username, winnerUsername, room: room1 }));
    });
    socket.on("newRound", () => {
      game.startRoundMain((room, questionCard) => {
        let room1 = mapSocketToRoom.get(username);
        pub.publish("newRound", JSON.stringify({room: room1, questionCard}));
      })
    });
    socket.on("disconnect", () => {
      let room1 = mapSocketToRoom.get(username);
      pub.publish("disconnect", JSON.stringify({ room: room1, username }));
    });
    socket.on("exitLobby", () => {
      let room1 = mapSocketToRoom.get(username);
      pub.publish("disconnect", JSON.stringify({ room: room1, username }));
    });
  });
});
