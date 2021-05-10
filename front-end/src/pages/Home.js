import { TextField, Button, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { Redirect } from "react-router";

export default function Home({ isAuthenticated }) {
  const [redirect, setRedirect] = useState(false);
  const [room, setRoom] = useState("");

  useEffect(()=> {
    return function setRoomInLocalStorage(){
      localStorageService.setRoom(room);
    };
  })

  const onEnterLobby = () => {
    setRedirect(true);
  };

  const onChangeHandler = (event) => {
    setRoom(event.target.value);
  };

  if (redirect) {
    return <Redirect to={"/bobs-your-uncle/lobby"}></Redirect>;
  }

  return (
    <Grid container justify="center">
      <Grid item xs={2}></Grid>
      <Grid container item xs={8} spacing={5}>
        <Grid item alignContent="center" alignItems="center" xs={7}>
          <TextField
            required
            value={room}
            id="enterRoomName"
            label="enter Room Name..."
            name="roomName"
            onChange={onChangeHandler}
            fullWidth
          />
        </Grid>
        <Grid item alignContent="center" alignItems="center" xs={7}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!room}
            onClick={onEnterLobby}
          >
            Enter Room
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
