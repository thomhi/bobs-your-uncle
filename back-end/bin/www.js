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
require("dotenv").config();

const app = express();

mongoose.connect(
  "mongodb://root:password@localhost:7777/bobsDB?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

//io.adapter(redisAdapter({ host: 'redis', port: 6379 }));
getCards();
io.use(socketioJwt.authorize({
  secret: process.env.TOKEN_SECRET,
  handshake: true
}));

io.on('connection', (socket) => {
  console.log('hello!', socket.decoded_token._id);
  socket.on("joinRoom", ({ _id, username, room }) => {
    
    if (!games.has(room)) {
      console.log('joinRoom2');
      game = new Game(room, answerCards, questionCards);
      games.set(room, game);
      game.joinRoom(socket);
    } else {
      games.get(room).joinRoom(socket);
    }
    socket.on("startGame", () => {
      game.startGame();
    });
    socket.on("answer", (cards) => {
      game.receivedCards(cards, socket);
    });
    // socket on winner receivedChoice
    // socket newRound startRound
  });
});