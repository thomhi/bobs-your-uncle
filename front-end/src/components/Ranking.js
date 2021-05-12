import { Grid, Paper } from "@material-ui/core";
import React from "react";
import { gameStyle } from "../styles/styles";

export function Ranking({ playerPoints, me }) {
  const classes = gameStyle();

  playerPoints.sort((a, b) => {
    return Object.values(b)[0] - Object.values(a)[0];
  });
  let rank = 1;

  return (
    <Paper elevation={24} className={classes.ranking}>
      {playerPoints.map((player) => {
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
