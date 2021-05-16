import { Card, CardContent, Grid, CardActionArea } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import HandCard from "./HandCard";
import { Waiting } from "./Waiting";

export function SelectWinner({ choices, playCard, socket, decider}) {

  const classes = gameStyle();

  const Task = () => {
    if (decider) {
      return <h1>select best answer</h1>;
    } else {
      return <Waiting text="Wait until Winner is selected"></Waiting>;
    }
  };

  const onSelect = (player) => {
    socket.emit("winner", { winnerUsername: player });
  };

  return (
    <Grid container justify="space-evenly" spacing={5}>
      <Task />
      <Grid container justify="space-evenly" item spacing={5}>
        {Object.entries(choices).map((entry) => {
          return (
            <Grid container justify="space-evenly" key={entry[0]} item xs={3}>
              <Card className={classes.cardCombi}>
                <CardActionArea
                  onClick={() => {
                    onSelect(entry[0]);
                  }}
                  disabled={!decider}
                >
                <Grid container item justify="space-evenly" alignContent='space-between'>
                  {entry[1].map((card) => {
                    return (
                        <Grid item xs={10} style={{margin: '10%'}}>
                          <HandCard
                            onSelect={onSelect}
                            card={card}
                            decider={decider}
                          ></HandCard>
                        </Grid>
                    );
                  })}
                  </Grid>
                </CardActionArea>
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
