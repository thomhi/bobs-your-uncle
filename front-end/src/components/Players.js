import { Avatar, Grid } from "@material-ui/core";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import { localStorageService } from "../businessLogic/LocalStroageService";
import loading from "../assets/giphy.gif";

export function Players({ players }) {
  if (!players) {
    console.error('waiting for users in lobby, (empty array): no socket.on(\'usersInLobby\')');
    return <img src={loading} alt="loading..."></img>;
  }
  return (
    <Grid
      key={localStorageService.getRoom()}
      container
      item
      spacing={10}
      alignItems="center"
      justify="space-evenly"
      id="playerTable"
    >
      {players.map((player) => (
        <Grid item xs={3} key={localStorageService.getRoom() + player}>
          <Avatar>
            <FaceTwoToneIcon fontSize="large" />
          </Avatar>
          <p>{player}</p>
        </Grid>
      ))}
    </Grid>
  );
}
