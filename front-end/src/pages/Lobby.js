import { useEffect, useState } from "react";
import { Button, Container, Grid /*TextField*/ } from "@material-ui/core";
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
    abi: 12,
    thomas: 7,
    JooooeeeEEEEEElllll: 5,
    Jonas: -1532,
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
      setChoices([]);
    });

    socket.on("choices", (cards) => {
      if (cards) {
        setChoices(cards);
      } else {
        setChoices(DEFAULT.choices);
      }
      setPlayState("showSelectedCards");
    });

    socket.on("winnerAnnouncement", ({ winnerUsername, cards }) => {
      if (winnerUsername && cards) {
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
      localStorageService.exitRoom();
    };
  }, []);

  const onPlayGame = () => {
    socket.emit("startGame");
    setPlaying(true);
  };
  
  if (exitLobby) {
    socket.emit("exitLobby", localStorageService.getUserId());
    return <Redirect to={"/"}></Redirect>;
  }

  if (playing) {
    return (
      <Container className={classes.container}>
        <h1 className={classes.menu}>{player}</h1>
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
          setPlayState={setPlayState}
        ></PlayGame>
        <Grid item xs={4}>
          <Button
            className={`${classes.exitLobby}`}
            onClick={() => {
              setExitLobby(true);
            }}
          >
            Exit Lobby
          </Button>
        </Grid>
      </Container>
    );
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
              onClick={() => {setExitLobby(true)}}
            >
              Exit Lobby and Group
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}
