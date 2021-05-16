import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import HandCard from "./HandCard";

export function WinnerCard({ winnerCards, playCard, winner, socket, decider }) {
  const classes = gameStyle();

  const newRound = () => {
    socket.emit("newRound");
  };

  return (
    <Grid container justify="space-evenly" spacing={5}>
      <h2>Winner is: {winner}</h2>
      <Grid container item justify="space-evenly" spacing={5}>
        {winnerCards.map((card) => {
          return (
            <Grid key={card._id} item xs={3}>
              <HandCard className={classes.cardCombi} card={card} decider={true} onSelect={()=>{}}>
                <CardContent>{card.content}</CardContent>
              </HandCard>
            </Grid>
          );
        })}
      </Grid>
      <Grid item xs={9}>
        <Card className={classes.playCard}>{playCard.content}</Card>
      </Grid>
      <Grid container item justify="space-evenly" spacing={5}>
        {decider ? (
          <Grid item xs={4}>
            <Button className={classes.emitButton} onClick={() => newRound()}>
              new Round
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}
