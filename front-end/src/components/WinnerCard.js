import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { gameStyle } from "../styles/styles";

export function WinnerCard({ winnerCards, playCard, winner, socket, decider }) {
  const classes = gameStyle();

  const newRound = () => {
    socket.emit("newRound");
  };

  return (
    <Grid container justify="space-evenly" spacing={5}>
      <h2>Winner is: {winner}</h2>
      <Grid container item spacing={5}>
        {winnerCards.map((card) => {
          return (
            <Grid key={card._id} item xs={4}>
              <Card className={classes.cardCombi}>
                <CardContent>{card.content}</CardContent>
              </Card>
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
