import { Grid, Card, CardContent, Paper, CardActionArea } from "@material-ui/core";
import { useState } from "react";
import { gameStyle } from "../styles/styles";
import { Ranking } from "./Ranking";
import { SelectWinner } from "./SelectWinner";
import { Waiting } from "./Waiting";

export default function PlayGame({ STATE, socket }) {
  const classes = gameStyle();
  let number = 0;

  const [onEvaluation, setOnEvaluation] = useState(false);
  const [hasWinner, setHasWinner] = useState(false);

  const selectedCards = [];

  function onSelect(card) {
    console.log(`clicked:\n${card}`);
    for (let selectedCard of selectedCards){
      if (selectedCard === card) {return;}
    }
    selectedCards.push(card);
    if (selectedCards.length === STATE.resNumber) {
      socket.emit("answer", selectedCards);
      setOnEvaluation(true);
    }
  }


  if (onEvaluation) {
    if (STATE.myTurn){
      return <SelectWinner choices={STATE.choices} playCard={STATE.playCard} socket={socket}></SelectWinner>
    }
    return <Waiting text="Wait until Winner is specified"></Waiting>;
  }
  if (hasWinner) {
    return (
      <Card color="secondary" className={classes.playCard}>
      <CardContent>{STATE.roundWinner}</CardContent>
        <CardContent>{STATE.winnerCard}</CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={10}>
      <Grid item xs={3}>
        <Paper elevation={24} className={classes.paper}>
          <Ranking id="ranking" playerPoints={STATE.playerPoints}></Ranking>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Card color="secondary" className={classes.playCard}>
          <CardContent>{STATE.playCard}</CardContent>
        </Card>
      </Grid>
      <Grid container item spacing={5}>
        {STATE.handCards.map((card) => {
          return (
            <Grid key={card + number++} className="hand-card" item xs={3}>
              <Card>
                <CardActionArea
                  className={classes.selectedCard}
                  onClick={() => {onSelect(card)}}
                >
                  <CardContent>{card}</CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}
