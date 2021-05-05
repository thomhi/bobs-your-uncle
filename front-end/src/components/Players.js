import { Avatar, Grid } from "@material-ui/core";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";

export function Players({ players, room }) {
  let playerNumber = 0;
  return (
    <Grid key={room} container item spacing={10} justify="space-evenly" id="playerTable">
      {players.map((player) => (
          <Grid item xs={3} key={player + playerNumber++}>
            <Avatar>
              <FaceTwoToneIcon fontSize="large" />
            </Avatar>
            <p>{player}</p>
          </Grid>
      ))}
    </Grid>
  );
}
