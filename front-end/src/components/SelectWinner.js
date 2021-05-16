import { Card, CardContent, Grid, CardActionArea } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import { Waiting } from "./Waiting";

export function SelectWinner({ choices, playCard, socket, decider, me }) {
  const classes = gameStyle();

  const Task = () => {
    if (decider) {
      return <h1>select best answer</h1>;
    } else {
      return <Waiting text="Wait until Winner is selected"></Waiting>;
    }
  };

  const onSelect = (player) => {
    console.log(`winner selected ${player}`);
    socket.emit("winner", { winnerUsername: player });
  };

  return (
    <Grid container justify="space-evenly" spacing={5}>
      <Task />
      <Grid container item spacing={5}>
        {Object.entries(choices).map((entry) => {
          console.log("Player: ", entry[0]);
          console.log("cards: ", entry[1]);
          return (
            <Grid key={entry[0]} item xs={4}>
              <Card className={classes.cardCombi}>
                {entry[1].map((card) => {
                  return (
                    <Card key={card._id}>
                      <CardActionArea
                        onClick={() => {
                          onSelect(entry[0]);
                        }}
                        disabled={!decider}
                      >
                        <CardContent>{card.content}</CardContent>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Grid item xs={9}>
        <Card className={classes.playCard}>{playCard.content}</Card>
      </Grid>
    </Grid>
  );
}
