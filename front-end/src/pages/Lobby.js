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
  I: "",
  players: ["Abi", "thom", "xXXJonas42069XxKillerBoy", "Tschoel"],
  playCard: "hello, there _________",
  handCards: ["a", 'b', 'c'],
  winnerCard: "",
  roundWinner: "",
  resNumber: 2,
  decider: false,
  playerPoints: new Map([['abi', 12], ['thom', 7], ['xXXJonas42069XxKillerBoy', -5], ['Tschoel', 4]]),
  choices: [['hallo', 'bello'], ['ciao', 'how'], ['ciao', 'how']],
};

function mapToObject(value, key, map) {
  // console.log(`m[${key}] = ${value}`);
  // if (STATE.choices[value] === undefined) {
  //   STATE.choices[value] = [key];
  // } else {
  //   STATE.choices[value].push(key);
  // } überarbeiten!!!
}

const socket = io.connect("http://localhost:5555", {
  extraHeaders: { Authorization: `Bearer ${localStorageService.getJWT()}` },
});

// socket.on("joinRoom", (players) => {
//   for (let player of players) {
//     STATE.players[player].name = player;
//     STATE.players[player].points = 0;
//   }
// });
// socket.on("playersInLobby", (players) => {
//   for (let player of players) {
//     STATE.players[player].name = player;
//     STATE.players[player].points = 0;
//   }
// });
// socket.on("handoutCards", (playCard, handCards) => {
//   STATE.handCards = handCards;
//   STATE.playCard = playCard;
// });
// socket.on("choices", (cards) => {
//   cards.forEach(mapToObject);
// });
// socket.on("winnerAnouncement", (player, card) => {
//   for (let p in STATE.players) {
//     if (player === p) {
//       STATE.players[p].points += 1;
//     }
//   }
//   STATE.roundWinner = player;
//   STATE.winnerCard = card;
// });

socket.on("playersInLobby", ({users}) => {
  console.log(`Users: ${users}`);
});

export default function Lobby() {
  const classes = gameStyle();

  const [exitLobby, setExitLobby] = useState(false);
  const [playing, setPlaying] = useState(false);

  const usersArr =[];

  useEffect(() => {
    console.log('useEffect:');
    socket.on("playersInLobby", (users) => {
      console.log(`Users: ${users}`);
      usersArr = users;
    });
  }, []);

  const onPlayGame = () => {
    console.log("onplaygame (button clicked)");
    socket.emit("startGame", {});
    setPlaying(!playing);
  };
  const onExitLobby = () => {
    console.log("onexitlobby (button clicked)");
    socket.emit("exitLobby", { handCards: STATE.handCards });
    setExitLobby(!exitLobby);
  };

  if (playing) {
    return <PlayGame STATE={STATE} socket={socket}></PlayGame>;
  }

  if (exitLobby) {
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
      <Players players={STATE.players} room={STATE.room} />
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
          <Grid item className="gridItem" xs={4}>
            <Button
              fullWidth
              id="play-game-button"
              type="submit"
              variant="contained"
              color="secondary"
              onClick={onPlayGame}
            >
              Start Game
            </Button>
          </Grid>
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
      </form>
    </Grid>
  );
}
