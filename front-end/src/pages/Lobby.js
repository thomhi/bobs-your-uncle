import { useEffect, useState } from "react";
import { Button, Grid /*TextField*/ } from "@material-ui/core";
import { Players } from "../components/Players";
// import { gameSettings } from "../businessLogic/GameSettingsService";
import { Redirect } from "react-router";
import PlayGame from "../components/PlayGame";
import { gameStyle } from "../styles/styles";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { io } from "socket.io-client";

const STATE = {
  room: "",
  players: "",
  playCard: "",
  handCards: ['aaaaaaaaaaaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaaaa aaaaaaaaaaaa aaaaaaaa aaaaaaaaaaaaaaa aaaaaa aaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa'],
  winnerCard: "",
  roundWinner: "",
  resNumber: 2,
  decider: false,
  playerPoints: new Map([
    ["abi", 12],
    ["thom", 7],
    ["Jonas", -5],
    ["JoeEEEEEEEEEeeeeeeeeeeeeeeeel", 4],
  ]),
  choices: {
    abi: ["lorem ipsum dolor", "sit amet"],
    thom: ["f", "e"],
    joel: ["d", "c"],
  },
};

const socket = io.connect("http://localhost:5555", {
  extraHeaders: { Authorization: `Bearer ${localStorageService.getJWT()}` },
});

export default function Lobby() {
  const classes = gameStyle();

  const [exitLobby, setExitLobby] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [state, setState] = useState(STATE);

  socket.on("joinRoom", ({ users }) => {
    console.log("players in Lobby on joinRoom: ", users);
    for (let player of users) {
      STATE.players[player] = player;
    }
    setState({ ...state, STATE });
  });

  socket.on("playersInLobby", ({ users }) => {
    console.log("players in Lobby: ", users);
    STATE.players = users;
    setState({ ...state, STATE });
  });

  useEffect(() => {
    socket.emit("joinRoom", {
      username: localStorageService.getUserId(),
      room: localStorageService.getRoom(),
    });
    console.log(
      `${localStorageService.getUserId()} joined room ${localStorageService.getRoom()}`
    );

    return function cleanup() {
      console.log(
        `${localStorageService.getUserId()} exit room ${localStorageService.getRoom()}`
      );
      localStorageService.exitRoom();
    };
  }, []);

  const onPlayGame = () => {
    socket.emit("startGame");
    console.log("game started");
    setPlaying(!playing);
  };
  const onExitLobby = () => {
    setExitLobby(!exitLobby);
  };

  if (playing) {
    return <PlayGame STATE={state} socket={socket}></PlayGame>;
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
      <h1>{`Room: ${localStorageService.getRoom()}`}</h1>
      <Players players={state.players} />
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
