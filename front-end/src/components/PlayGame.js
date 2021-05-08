import {
  Grid,
  Card,
  CardContent,
  Paper,
  CardActionArea,
} from "@material-ui/core";
import { useState } from "react";
import { gameStyle } from "../styles/styles";
import { SelectWinner } from "./SelectWinner";
import { Waiting } from "./Waiting";
import { Ranking } from "./Ranking";
import { WinnerCard } from "../components/WinnerCard";

export default function PlayGame({ STATE, socket }) {
  const classes = gameStyle();
  let number = 0;
  const selectedCards = [];

  const [playState, setPlayState] = useState("selectCard");
  const [state, setState] = useState(STATE);

  function mapToObject(value, key, map) {
    console.log(`m[${key}] = ${value}`);
    if (STATE.choices[value] === undefined) {
      STATE.choices[value] = [key];
    } else {
      STATE.choices[value].push(key);
    }
  }

  socket.on("isDecider", ({ isDecider }) => {
    STATE.decider = isDecider;
    setState({ ...state, STATE });
  });

  socket.on("handOutCards", ({ questionCard, playerAnswerCards }) => {
    // change while db is not empty
    STATE.handCards = [
      "hello",
      "me",
      "myself",
      "and",
      "I",
      "why you",
      "why me",
      "and so on",
      "blubbedi",
      "blubb blubb",
    ];
    STATE.playCard = "why is there a __________ in my __________???";
    console.log(`socket.on(handoutCards): ${STATE.handCards}`);
    console.log(`socket.on(handoutCards): ${STATE.handCards}`);
    setState({ ...state, STATE });
  });

  socket.on("choices", ({ cards }) => {
    if (!cards) {
      return;
    }
    cards.forEach(mapToObject);
    setState({ ...state, STATE });
    console.log(`socket.on(choices): ${STATE.choices}`);
  });

  socket.on("winnerAnouncement", ({ player, card }) => {
    STATE.roundWinner = player;
    setPlayState("showWinner");
    setState({ ...state, STATE });
  });

  if (playState === "showSelectedCards") {
    return (
      <SelectWinner
        choices={state.choices}
        playCard={state.playCard}
        socket={socket}
        decider={state.decider}
      ></SelectWinner>
    );
  }

  if (playState === "showWinner") {
    return <WinnerCard text={state.winnerCard}></WinnerCard>;
  }

  const onSelect = (card) => {
    console.log(`clicked:\n${card}`);
    for (let selectedCard of selectedCards) {
      if (selectedCard === card) {
        return;
      }
    }
    selectedCards.push(card);
    if (selectedCards.length === STATE.resNumber) {
      socket.emit("answer", selectedCards);
      setPlayState("showSelectedCards");
    }
  };

  function IsDecider() {
    if (STATE.decider) {
      return (
        <Waiting
          text={
            "This is your Turn to select the winner . . .  Wait until all players choose their cards"
          }
        />
      );
    } else {
      return null;
    }
  }
  if (playState === "selectCard") {
    return (
      <>
        <IsDecider className={classes.note} />
        <Grid container spacing={10}>
          <Grid item xs={3}>
            <Ranking id="ranking" playerPoints={STATE.playerPoints}></Ranking>
          </Grid>
          <Grid item xs={8}>
            <Card color="secondary" className={classes.playCard}>
              <CardContent>{STATE.playCard}</CardContent>
            </Card>
          </Grid>
          <Grid container item spacing={5}>
            {STATE.handCards.map((card) => {
              return (
                <Grid
                  key={card + number++}
                  className={classes.handCard}
                  item
                  xs={2}
                >
                  <Card style={{ zIndex: 0 }}>
                    <CardActionArea
                      className={classes.selectedCard}
                      disabled={state.decider}
                      onClick={() => {
                        onSelect(card);
                      }}
                    >
                      <CardContent>{card}</CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </>
    );
  }
}
