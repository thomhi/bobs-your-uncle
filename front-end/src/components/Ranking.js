import {  Paper } from "@material-ui/core";
import React from "react";
import { gameStyle } from "../styles/styles";

export function Ranking({ playerPoints, me }) {
  const classes = gameStyle();
  let rank = 1;

  const players = [];
  for (let [player, points] of Object.entries(playerPoints)) {
    players.push({ player: player, points: points });
  }

  players.sort((a, b) => {
    return b.points - a.points;
  });

  return (
    <Paper elevation={24} className={classes.ranking}>
      {players.map((player) => {
        return (
          <p key={"player" + rank} className={classes.rank}>
            {me === player.player ? (
              <b>{`${rank++}. ${player.player} ${player.points} points`}</b>
            ) : (
              `${rank++}. ${player.player} ${player.points} points`
            )}
          </p>
        );
      })}
    </Paper>
  );
}
