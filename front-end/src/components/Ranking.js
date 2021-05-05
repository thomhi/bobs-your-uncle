import { Grid } from "@material-ui/core";
import React from "react";

export function Ranking({ playerPoints }) {

  const players =[];
  playerPoints.forEach((value, key, map) =>  {
    players.push({player: key, points: value});
  });
    
  players.sort((a, b) => {
    return b.points - a.points;
  });
  let rank = 1;

  return (
    <>
      {players.map((player) => {
        return (
          <Grid key={'player'+rank} container item xs={12} spacing={2}>
            <Grid item xs={1}>
              {rank++}.
            </Grid>
            <Grid className="ranking-name" item xs={7}>
              {player.player}
            </Grid>
            <Grid item xs={4}>
              {player.points} points
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
