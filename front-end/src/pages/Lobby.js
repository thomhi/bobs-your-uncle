import { useEffect, useState } from "react";
import { Button, Grid /*TextField*/ } from "@material-ui/core";
import { Players } from "../components/Players";
// import { gameSettings } from "../businessLogic/GameSettingsService";
import { Redirect } from "react-router";
import PlayGame from "../components/PlayGame";
import { gameStyle } from "../styles/styles";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { socket } from "../businessLogic/socket";

const DEFAULT = {
  playCard: {
    _id: 1,
    content: "why is there a _______ in my __________???",
    numberOfFields: 2,
  },
  handcards: [{ _id: 2, content: "fridge" }],
  winnerCards: [
    { content: "apple", _id: 3 },
    { content: "food", _id: 4 },
  ],
  roundWinner: "KingAbi",
  pointsPerPlayer: {
    abi: 12 ,
    thomas: 7,
    JooooeeeEEEEEElllll: 5,
     Jonas: -1532 ,
  },
  choices: new Map([
    [
      "abi",
      [
        { content: "apple", _id: 5 },
        { content: "food", _id: 6 },
      ],
    ],
  ]),
};

export default function Lobby() {
  const classes = gameStyle();
  const room = localStorageService.getRoom();
  const player = localStorageService.getUserId();

  const [exitLobby, setExitLobby] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playState, setPlayState] = useState("selectCard");
  const [playCard, setPlayCard] = useState({});
  const [handCards, setHandCards] = useState([]);
  const [winnerCards, setWinnerCards] = useState("");
  const [roundWinner, setRoundWinner] = useState("");
  const [decider, setDecider] = useState(false);
  const [pointsPerPlayer, setPointsPerPlayer] = useState(
    DEFAULT.pointsPerPlayer
  );
  const [choices, setChoices] = useState(DEFAULT.choices);

  useEffect(() => {
    socket.emit("joinRoom", {
      room: localStorageService.getRoom(),
    });

    socket.on("playersInLobby", ({ users }) => {
      setPlayers(users);
    });

    socket.on("isDecider", (isDecider) => {
      console.log(`socket.on(idecider) isDecider: ${isDecider}`);
      setDecider(isDecider);
    });

    socket.on("handOutCards", ({ questionCard, currentHand }) => {
      if (questionCard && currentHand) {
        setHandCards(currentHand);
        setPlayCard(questionCard);
      } else {
        setHandCards(DEFAULT.handcards);
        setPlayCard(DEFAULT.playCard);
      }
      setPlayState("selectCard");
      setPlaying(true);
    });

    socket.on("choices", (cards) => {
      console.log(`socket.on(choices) as Map: ${cards}`);
      console.log(cards);
      console.table(cards);
      if (cards) {
        setChoices(cards);
      } else {
        setChoices(DEFAULT.choices);
      }
      setPlayState("showSelectedCards");
    });

    socket.on("winnerAnnouncement", ({ winnerUsername, cards }) => {
      console.log(
        `socket.on(winnerAnnouncement) winner: ${winnerUsername}\nwith : ${cards}`
      );
      console.log(winnerUsername);
      console.table(cards);
      if (winnerUsername && cards) {
        console.log(
          `socket.on(winnerAnnouncement) winner: ${winnerUsername}\nwith : ${cards}`
        );
        setWinnerCards(cards);
        setRoundWinner(winnerUsername);
        setPlayState("showWinner");
      } else {
        setWinnerCards(DEFAULT.winnerCards);
        setRoundWinner(DEFAULT.winner);
        setPlayState("showWinner");
      }
    });

    socket.on("score", (score) => {
      console.table(score);
      console.log(score);
      if (score) {
        setPointsPerPlayer(0);
        setPointsPerPlayer(score);
      }
    });

    return () => {
      socket.off("playersInLobby");
      socket.off("isDecider");
      socket.off("handOutCards");
      socket.off("choices");
      socket.off("winnerAnnouncement");
      socket.off("score");
      console.log(
        `${localStorageService.getUserId()} exit room ${localStorageService.getRoom()}`
      );
      localStorageService.exitRoom();
    };
  }, []);

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
      <>
        <h1>{player}</h1>
        <PlayGame
          playState={playState}
          playCard={playCard}
          handCards={handCards}
          winnerCards={winnerCards}
          roundWinner={roundWinner}
          decider={decider}
          pointsPerPlayer={pointsPerPlayer}
          choices={choices}
          me={player}
          socket={socket}
        ></PlayGame>
      </>
    );
  }

  if (exitLobby) {
    socket.emit("exitLobby", localStorageService.getUserId());
    return <Redirect to={"/"}></Redirect>;
  }

  return (
    <Grid
      className={classes.paper}
      container
      justify="space-evenly"
      spacing={5}
    >
      <h1 className={classes.title}>{`Room: ${room}`}</h1>
      <Players players={players} />
      <form className="gameSettings" action="/playGame">
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
              color="primary"
              onClick={onPlayGame}
              disabled={players.length < 2}
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
