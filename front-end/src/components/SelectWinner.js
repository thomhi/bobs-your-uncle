import { Card, CardContent, Grid, CardActionArea } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import { Waiting } from "./Waiting";

export function SelectWinner({ choices, playCard, socket, decider }) {
  const classes = gameStyle();
  const selection = [];

  const Task = () => {
    if (decider) {
      return <h1>select best answer</h1>;
    } else {
      return <Waiting text="Wait until Winner is selected"></Waiting>;
    }
  };

  for (let choice of Object.values(choices)) {
    selection.push(choice);
  }

  const onSelect = (player) => {
    socket.emit("winner", player);
  };

  return (
    <Grid container justify="space-evenly" spacing={5}>
      <Task />
      <Grid container item spacing={5}>
        {selection.map((player) => {
          return (
            <Grid key={player} item xs={4}>
              <Card
                className={classes.cardCombi}
                onClick={() => {
                  onSelect(player);
                }}
              >
                <CardActionArea
                  className={classes.selectedCard}
                  onClick={() => {
                    onSelect(player);
                  }}
                  disabled={!decider}
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
      <Grid item xs={9}>
        <Card className={classes.playCard}>{playCard}</Card>
      </Grid>
    </Grid>
  );
}
