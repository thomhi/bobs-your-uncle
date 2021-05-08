import { Grid, Paper } from "@material-ui/core";
import React from "react";
import { gameStyle } from "../styles/styles";

export function Ranking({ playerPoints }) {
  const classes = gameStyle();

  const players = [];
  playerPoints.forEach((value, key, map) => {
    players.push({ player: key, points: value });
  });

  players.sort((a, b) => {
    return b.points - a.points;
  });
  let rank = 1;

  return (
    <Paper elevation={24} className={classes.ranking}>
      {players.map((player) => {
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
      })}
    </Paper>
  );
}
