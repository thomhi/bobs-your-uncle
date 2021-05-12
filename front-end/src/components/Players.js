import { Avatar, Grid } from "@material-ui/core";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import { localStorageService } from "../businessLogic/LocalStroageService";
import loading from "../assets/giphy.gif";
import { gameStyle } from "../styles/styles";

export function Players({ players }) {
  const classes = gameStyle();
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
        <Grid item xs={3} key={localStorageService.getRoom() + player} className={classes.player}>
          <Avatar className={classes.avatar}>
            <FaceTwoToneIcon className={classes.icon} fontSize="large" />
          </Avatar>
          <p>{player}</p>
        </Grid>
      ))}
    </Grid>
  );
}
