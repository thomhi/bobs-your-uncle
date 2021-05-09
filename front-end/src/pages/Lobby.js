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

export default function Lobby() {
  const classes = gameStyle();
  const room = localStorageService.getRoom();
  const player = localStorageService.getUserId();

  const [exitLobby, setExitLobby] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [players, setPlayers] = useState([]);

  socket.on("playersInLobby", ({ users }) => {
    console.log("players in Lobby: ", users);
    setPlayers(users);
  });

  useEffect(() => {
    socket.emit("joinRoom", {
      room: room,
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
    return <PlayGame me={player} socket={socket}></PlayGame>;
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
