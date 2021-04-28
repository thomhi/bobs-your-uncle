import ChangePageButton from "../components/ChangePageButton";
import { TextField, Button, Grid, Paper, makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";
import { useState } from "react";
import { localStorageService } from "../businessLogic/LocalStroageService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Home({ isAuthenticated }) {
  const classes = useStyles;
  const [redirect, setRedirect] = useState(false);

  const socket = io.connect("http://localhost:9999", {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    socket
      .emit("authenticate", { token: localStorageService.getJWT() }) //send the jwt
      .on("authenticated", () => {
        socket.on("message", (message) => {
          console.log(message);
        });
        socket.emit("joinRoom", { player: "thomas", room: "1" });
      })
      .on("unauthorized", (msg) => {
        console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
        throw new Error(msg.data.type);
      });
  });

  return (
    <Grid container className={classes.paper}>
      <Grid item xs={12}>
        <ChangePageButton name="Login" goToPath="/bobs-your-uncle/signIn" />
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid container item xs={8} spacing={5}>
        <Grid item xs={6}>
          <Paper>
            <form className="enterName" action="/bobs-your-uncle/lobby">
              <TextField
                required
                id="playerName"
                label="your Name"
                name="playerName"
                autoFocus
                fullWidth
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
              >
                Create Table
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={2}>
            <form className="enterTableCode" action="/bobs-your-uncle/lobby">
              <TextField
                required
                id="enterTableCode"
                label="enter Table Code..."
                name="tableCode"
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
              >
                Enter Table
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
