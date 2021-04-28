import { useState } from "react";
import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import { Players } from "../components/Players";
import { apiService } from "../businessLogic/APIService";
import { gameSettings } from "../businessLogic/GameSettingsService";
import { Redirect } from "react-router";
import PlayGame from "./PlayGame";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Lobby() {
  const [redirect, setRedirect] = useState(false);
  const [playing, setPlaying] = useState(false);

  const classes = useStyles;
  const playerArray = apiService.getPlayers();

  const onPlayGame = () => {
    console.log("onplaygame (button clicked)");
  };
  const onExitLobby = () => {
    console.log("onexitlobby (button clicked)");
    setRedirectPath("/bobs-your-uncle");
    setRedirect(true);
  };
  if (playing){
    return <PlayGame players={players} cards={cards} playCard={playCard}></PlayGame>;
  }

  if (!playing) {
    return (
      <Grid
        className={classes.paper}
        container
        alignItems="center"
        justify="space-evenly"
        spacing={5}
      >
        <Players players={playerArray} />
        <form className="gameSettings" action="/bobs-your-uncle/playGame">
          <Grid
            container
            item
            alignContent="center"
            spacing={5}
            justify="center"
          >
            <Grid item className="gridItem" xs={4}>
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
            </Grid>
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
}
