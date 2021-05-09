import { useEffect, useState } from "react";
import { Button, Grid /*TextField*/ } from "@material-ui/core";
import { Players } from "../components/Players";
// import { gameSettings } from "../businessLogic/GameSettingsService";
import { Redirect } from "react-router";
import PlayGame from "../components/PlayGame";
import { gameStyle } from "../styles/styles";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5555", {
  extraHeaders: { Authorization: `Bearer ${localStorageService.getJWT()}` },
});

const DEFAULT = {
  playCard: 'why is there a _______ in my __________???',
  handcards: ['fridge','tree', 'butt', 'Blubediblubb oihasfabfa iubndfoaisndan kjabscdfkja kjasbdak', 'lorem ipsum', 'dolor sit amet', 'but why?', 'Donald Trump', 'Donald Duck', 'King', 'Queen', 'idk' ],
  winnerCards: ['apple', 'food'],
  roundWinner: 'KingAbi',
  resNumber: 2,
  pointsPerPlayer: new Map([['abi', 12], ['thomas', 7],['JooooeeeEEEEEElllll', 5], ['Tschounes', -1532]]),
  choices: new Map([['apple', 'abi'], ['food', 'abi'],['Truck', 'thomas'], ['Minime', 'thomas'],['a', 'JooooeeeEEEEEElllll'], ['b', 'JooooeeeEEEEEElllll'],['poop', 'Tschounes'], ['toilet', 'Tschounes']]),
}

export default function Lobby() {
  const classes = gameStyle();
  const room = localStorageService.getRoom();
  const player = localStorageService.getUserId();

  const [exitLobby, setExitLobby] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playState, setPlayState] = useState("selectCard");
  const [playCard, setPlayCard] = useState(DEFAULT.playCard);
  const [handCards, setHandCards] = useState(DEFAULT.handcards);
  const [winnerCards, setWinnerCards] = useState("");
  const [roundWinner, setRoundWinner] = useState("");
  const [resNumber, setResNumber] = useState(DEFAULT.resNumber);
  const [decider, setDecider] = useState(false);
  const [pointsPerPlayer, setPointsPerPlayer] = useState(DEFAULT.pointsPerPlayer);
  const [choices, setChoices] = useState(DEFAULT.choices);

  socket.on("playersInLobby", ({ users }) => {
    console.log("players in Lobby: ", users);
    setPlayers(users);
  });

  socket.on("isDecider", (isDecider) => {
    console.log(`socket.on(idecider) isDecider: ${isDecider}`);
    setDecider(isDecider);
  });

  socket.on("handOutCards", ({ questionCard, currentHand }) => {
    console.log(`socket.on(handoutCards) handcards: `);
    console.table(currentHand);
    console.log(`socket.on(handoutCards) playcard: `);
    console.table(questionCard);
    if (questionCard && currentHand) {
      setHandCards(currentHand);
      setPlayCard(questionCard.content);
      setResNumber(questionCard.numberOfFields);
      console.log(`socket.on(handoutCards) handcards: ${handCards}`);
      console.log(`socket.on(handoutCards) playcard: ${playCard}`);
    } else {
      setHandCards(DEFAULT.handcards);
      setPlayCard(DEFAULT.playCard);
      setResNumber(DEFAULT.resNumber);
    }
  });

  socket.on("choices", ({ cards }) => {
    console.log(`socket.on(choices) as Map: ${choices}`);
    if (cards) {
      let tempChoices;
      for (let [key, value] of cards) {
        if (tempChoices[value] === undefined) {
          tempChoices[value] = [key];
        } else {
          tempChoices[value].push(key);
        }
      }
      setChoices(tempChoices);
      console.log(`socket.on(choices) as Object: ${choices}`);
    } else {
      setChoices(DEFAULT.choices);
    }
    setPlayState("showSelectedCards");
  });

  socket.on("winnerAnouncement", ({ player, cards, pointsPerPlayer }) => {
    if (player && cards) {
      console.log(
        `socket.on(winnerAnouncement) winner: ${player}\nwith : ${cards}`
      );
      setWinnerCards(cards);
      setRoundWinner(player);
      setPointsPerPlayer(pointsPerPlayer);
      setPlayState("showWinner");
    } else {
      setWinnerCards(DEFAULT.winnerCards);
      setRoundWinner(DEFAULT.winner);
      setPointsPerPlayer(DEFAULT.pointsPerPlayer);
      setPlayState("showWinner");
    }
  });

  useEffect(() => {
    socket.emit("joinRoom", {
      room: room,
    });
    console.log(
      `${localStorageService.getUserId()} joined room ${localStorageService.getRoom()}`
    );

    // return function cleanup() {
    //   console.log(
    //     `${localStorageService.getUserId()} exit room ${localStorageService.getRoom()}`
    //   );
    //   localStorageService.exitRoom();
    //   setExitLobby(true);
    // };
  });

  const onPlayGame = () => {
    socket.emit("startGame");
    console.log("game started");
    setPlaying(true);
  };
  const onExitLobby = () => {
    setExitLobby(true);
  };

  if (playing) {
    return (
      <PlayGame
        playState={playState}
        playCard={playCard}
        handCards={handCards}
        winnerCards={winnerCards}
        roundWinner={roundWinner}
        resNumber={resNumber}
        decider={decider}
        pointsPerPlayer={pointsPerPlayer}
        choices={choices}
        me={player}
        socket={socket}
      ></PlayGame>
    );
  }

  if (exitLobby) {
    socket.emit("exitLobby", localStorageService.getUserId());
    return <Redirect to={"/bobs-your-uncle"}></Redirect>;
  }

  return (
    <Grid
      className={classes.paper}
      container
      alignItems="center"
      justify="space-evenly"
      spacing={5}
    >
      <h1>{`Room: ${room}`}</h1>
      <Players players={players} />
      <form className="gameSettings" action="/bobs-your-uncle/playGame">
        <Grid container item alignContent="center" spacing={5} justify="center">
          {/* <Grid item className="gridItem" xs={4}>
            <TextField
              fullWidth
              id="rounds"
              label="Number of Rounds"
              name="rounds"
              variant="outlined"
              defaultValue={gameSettings.rounds}
            />
          </Grid>
          <Grid item className="gridItem" xs={4}>
            <TextField
              fullWidth
              id="timeTP"
              label="Time to Play"
              name="timeTP"
              variant="outlined"
              defaultValue={gameSettings.playTimePerRound}
            />
          </Grid> */}
          <Grid item className="gridItem" xs={11}>
            <Button
              fullWidth
              id="play-game-button"
              variant="contained"
              color="secondary"
              onClick={onPlayGame}
            >
              Start Game
            </Button>
          </Grid>
          <Grid item className="gridItem" xs={11}>
            <Button
              fullWidth
              id="exit-lobby-button"
              variant="contained"
              color="secondary"
              onClick={onExitLobby}
            >
              Exit Lobby and Group
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}
