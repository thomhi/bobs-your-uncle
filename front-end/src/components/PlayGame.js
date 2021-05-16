import { Grid, Card, CardContent, Container, Button } from "@material-ui/core";
import { gameStyle } from "../styles/styles";
import { SelectWinner } from "./SelectWinner";
import { Waiting } from "./Waiting";
import { Ranking } from "./Ranking";
import { WinnerCard } from "../components/WinnerCard";
import { RoundState } from "./RoundState";
import { localStorageService } from "../businessLogic/LocalStroageService";
import { Redirect } from "react-router";
import HandCard from "./HandCard";
import { useState } from "react";

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
  setPlayState,
}) {
  const classes = gameStyle();
  const [emitable, setEmitable] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [note, setNote] = useState(
    `you must select ${playCard.numberOfFields}`
  );

  const onSelect = (card, active) => {
    console.log("clicked:", card);
    console.log("active:", active);
    let tempSelectedCards = selectedCards;
    if (active) {
      tempSelectedCards.push(card);
    } else {
      for (let i = 0; i < tempSelectedCards.length; i++) {
        if (tempSelectedCards[i]._id === card._id) {
          tempSelectedCards.splice(i, 1);
        }
      }
    }
    console.log("selecteCards ", tempSelectedCards);
    if (tempSelectedCards.length === playCard.numberOfFields) {
      setEmitable(true);
      setNote("handover selected cards ➡️");
    } else {
      setEmitable(false);
      setNote(
        playCard.numberOfFields > tempSelectedCards.length
          ? `you must select ${
              playCard.numberOfFields - tempSelectedCards.length
            }`
          : `you must deselect ${
              tempSelectedCards.length - playCard.numberOfFields
            }`
      );
    }
    setSelectedCards(tempSelectedCards);
  };

  const onEmitCards = () => {
    console.log("emit answers", selectedCards);
    socket.emit("answer", selectedCards);
    setPlayState("showSelectedCards");
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

  if (playState === "showWinner") {
    return (
      <Container>
        <WinnerCard
          playCard={playCard}
          winnerCards={winnerCards}
          winner={roundWinner}
          socket={socket}
          decider={decider}
        ></WinnerCard>
        <RoundState decider={decider} roundState={playState}></RoundState>
      </Container>
    );
  }

  if (playState === "showSelectedCards") {
    return (
      <Container>
        <SelectWinner
          choices={choices}
          playCard={playCard}
          socket={socket}
          decider={decider}
        ></SelectWinner>
        <RoundState decider={decider} roundState={playState}></RoundState>
      </Container>
    );
  }

  if (playState === "selectCard") {
    return (
      <Container>
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
                <HandCard
                  decider={decider}
                  card={card}
                  onSelect={onSelect}
                ></HandCard>
              );
            })}
          </Grid>
          <Grid item xs={4}>
            <Button
              className={`${classes.exitLobby}`}
              onClick={() => {
                socket.emit("exitLobby", localStorageService.getUserId());
                return <Redirect to={"/"}></Redirect>;
              }}
            >
              Exit Lobby
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              className={emitable ? classes.emitButton : null}
              disabled={!emitable}
              onClick={() => {
                onEmitCards();
              }}
            >
              {note}
            </Button>
          </Grid>
        </Grid>
        <RoundState decider={decider} roundState={playState}></RoundState>
      </Container>
    );
  }
}
