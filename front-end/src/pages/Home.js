import ChangePageButton from "../components/ChangePageButton";
import { TextField, Button, Grid, Paper, makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";
import { useState } from "react";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const socket = io.connect("http://localhost:5555", {
  extraHeaders: { Authorization: `Bearer ${localStorageService.getJWT()}` },
});

socket.on("message", (message) => {
  console.log(message);
});

export default function Home({ isAuthenticated }) {
  const classes = useStyles;
  const [redirect, setRedirect] = useState(false);
  const [room, setRoom] = useState("");

  const onEnterLobby = () => {
    console.log('onenterLobby: ' + room)
    socket.emit("joinRoom", {
      username: localStorageService.getUserId(),
      room: room,
    });
    setRedirect(true);
  };

  const onChangeHandler = (event) => {
    setRoom(event.target.value);
  };

  if (redirect) {
    return <Redirect to={"/bobs-your-uncle/lobby"}></Redirect>;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <ChangePageButton name="Login" goToPath="/bobs-your-uncle/signIn" />
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid container item xs={8} spacing={5}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <TextField
              required
              id="playerName"
              label="your Name"
              name="playerName"
              autoFocus
              fullWidth
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} elevation={2}>
            <TextField
              required
              value={room}
              id="enterRoomName"
              label="enter Room Name..."
              name="roomName"
              onChange={onChangeHandler}
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={onEnterLobby}
            >
              Enter Room
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
