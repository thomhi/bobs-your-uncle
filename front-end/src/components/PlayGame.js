import { Grid, Card, CardContent, CardActionArea } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import { SelectWinner } from "./SelectWinner";
import { Waiting } from "./Waiting";
import { Ranking } from "./Ranking";
import { WinnerCard } from "../components/WinnerCard";

export default function PlayGame({
  me,
  socket,
  playState,
  playCard,
  handCards,
  winnerCards,
  roundWinner,
  decider,
  pointsPerPlayer,
  choices,
}) {
  const classes = gameStyle();
  const selectedCards = [];

  const onSelect = (card) => {
    console.log(`clicked:\n${card}`);
    for (let selectedCard of selectedCards) {
      if (selectedCard._id === card._id) {
        return;
      }
    }
    selectedCards.push(card);
    if (selectedCards.length === playCard.numberOfFields) {
      console.log("emit answers", selectedCards);
      socket.emit("answer", selectedCards);
    }
  };

  function IsDecider({ decider }) {
    if (decider) {
      return (
        <Waiting
          text={
            "This is your turn to select the winner. Wait until all players choose their cards"
          }
        />
      );
    } else {
      return null;
    }
  }

  if (playState === "showSelectedCards") {
    return (
      <SelectWinner
        choices={choices}
        playCard={playCard}
        socket={socket}
        decider={decider}
      ></SelectWinner>
    );
  }

  if (playState === "showWinner") {
    return (
      <WinnerCard
        playCard={playCard}
        winnerCards={winnerCards}
        winner={roundWinner}
        socket={socket}
        decider={decider}
      ></WinnerCard>
    );
  }

  if (playState === "selectCard") {
    return (
      <Grid container spacing={10} justify="center">
        <IsDecider className={classes.note} decider={decider} />
        <Grid item xs={3}>
          <Ranking
            id="ranking"
            me={me}
            playerPoints={pointsPerPlayer}
          ></Ranking>
        </Grid>
        <Grid item xs={8}>
          <Card className={classes.playCard}>
            <CardContent>{playCard.content}</CardContent>
          </Card>
        </Grid>
        <Grid container item spacing={5}>
          {handCards.map((card) => {
            return (
              <Grid key={card._id} item xs={2}>
                <Card className={classes.handCard} style={{ zIndex: 0 }}>
                  <CardActionArea
                    style={{ minHeight: "150px", minWidth: "100%" }}
                    // className={classes.selectedCard}
                    disabled={decider}
                    onClick={() => {
                      onSelect(card);
                    }}
                  >
                    <CardContent>{card.content}</CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  }
}
