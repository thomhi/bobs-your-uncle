import { Grid, Paper } from "@material-ui/core";
import React from "react";
import { gameStyle } from "../styles/styles";

export function Ranking({ playerPoints, me }) {

  if (!playerPoints){
    return null;
  }

  const classes = gameStyle();

  const players = [];
  for (let [key, value] of playerPoints) {
    players.push({ player: key, points: value });
  }

  players.sort((a, b) => {
    return b.points - a.points;
  });
  let rank = 1;

  function IsMe({ player, me }) {
    if (player === me) {
      return (
        <Grid key={"player" + rank} container item xs={12} spacing={2}>
          <b>
            <Grid item xs={1}>
              <strong>{rank++}.</strong>
            </Grid>
            <Grid className={classes.rank} item xs={6}>
              <strong>{player.player}</strong>
            </Grid>
            <Grid item xs={5}>
              <strong>{player.points} points</strong>
            </Grid>
          </b>
        </Grid>
      );
    } else {
      return (
        <Grid key={"player" + rank} container item xs={12} spacing={2}>
          <Grid item xs={1}>
            {rank++}.
          </Grid>
          <Grid className={classes.rank} item xs={7}>
            {player.player}
          </Grid>
          <Grid item xs={4}>
            {player.points} points
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <Paper elevation={24} className={classes.ranking}>
      {players.map((player) => {
        return <IsMe player={player} me={me} />;
      })}
    </Paper>
  );
}
