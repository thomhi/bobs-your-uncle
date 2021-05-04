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

const socket = io.connect("http://localhost:9999", {
    extraHeaders: { Authorization: `Bearer ${localStorageService.getJWT()}` },
  });

  socket.on("message", (message) => {
    console.log(message);
  });

export default function Home({ isAuthenticated }) {
  const classes = useStyles;
  const [redirect, setRedirect] = useState(false);
  
  const onEnterLobby = () => {
    socket.emit("joinRoom", { username: "thom", room: "1" });
    setRedirect(true);
  };
  
  if (redirect) {
    return <Redirect to={"/bobs-your-uncle/lobby"}></Redirect>;
  }

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
            <form className="enterTableCode">
              <TextField
                required
                id="enterTableCode"
                label="enter Table Code..."
                name="tableCode"
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={onEnterLobby}
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
