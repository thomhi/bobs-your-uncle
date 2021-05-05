import {
  Paper,
  Card,
  CardContent,
  Grid,
  CardActionArea,
} from "@material-ui/core";
import { gameStyle } from "../styles/styles";

export function SelectWinner({ choices, playCard, socket }) {
  const classes = gameStyle();

  const numOfPlayers = choices.length;

  const onSelect = (player) => {
    socket.emit("winner", player);
  };

  return (
    <>
      <Grid item spacing={5}>
        {choices.map((player) => {
          return (
            <Grid item xs={12 / numOfPlayers}>
              <Card
                className={classes.cardCombi}
                key={player}
                onClick={() => {
                  onSelect(player);
                }}
              >
                <CardActionArea
                className={classes.selectedCard}
                  onClick={() => {
                    onSelect(player);
                  }}
                >
                  {player.map((card) => {
                    return (
                      <Card key={card}>
                        <CardContent>{card}</CardContent>
                      </Card>
                    );
                  })}
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Grid item>{playCard}</Grid>
    </>
  );
}
