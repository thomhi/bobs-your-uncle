import { Card, Grid } from "@material-ui/core";
import { gameStyle } from "../styles/styles";

export function WinnerCard({ winnerCards, playCard }) {
  const classes = gameStyle();
  return (
    <Grid container justify="space-evenly" spacing={5}>
    <Grid container item spacing={5}>
      {winnerCards.map((player) => {
        return (
          <Grid key={player} item xs={4}>
            <Card
              className={classes.cardCombi}>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    <Grid item xs={9}>
      <Card className={classes.playCard}>{playCard}</Card>
    </Grid>
  </Grid>
  );
}
