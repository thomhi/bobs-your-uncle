import { Grid, Card, CardContent, CardActionArea } from "@material-ui/core";
import { useState } from "react";
import { gameStyle } from "../styles/styles";
import { SelectWinner } from "./SelectWinner";
import { Waiting } from "./Waiting";
import { Ranking } from "./Ranking";
import { WinnerCard } from "../components/WinnerCard";

const DEFAULT = {
  playCard: 'why is there a _______ in my __________???',
  handcards: ['fridge','tree', 'butt', 'Blubediblubb oihasfabfa iubndfoaisndan kjabscdfkja kjasbdak', 'lorem ipsum', 'dolor sit amet', 'but why?', 'Donald Trump', 'Donald Duck', 'King', 'Queen', 'idk' ],
  winnerCards: ['apple', 'food'],
  roundWinner: 'KingAbi',
  resNumber: 2,
  pointsPerPlayer: new Map([['abi', 12], ['thomas', 7],['JooooeeeEEEEEElllll', 5], ['Tschounes', -1532]]),
  choices: new Map([['apple', 'abi'], ['food', 'abi'],['Truck', 'thomas'], ['Minime', 'thomas'],['a', 'JooooeeeEEEEEElllll'], ['b', 'JooooeeeEEEEEElllll'],['poop', 'Tschounes'], ['toilet', 'Tschounes']]),
}

export default function PlayGame({ me, socket }) {
  const classes = gameStyle();
  let number = 0;
  const selectedCards = [];

  const [playState, setPlayState] = useState("selectCard");
  const [playCard, setPlayCard] = useState(DEFAULT.playCard);
  const [handCards, setHandCards] = useState(DEFAULT.handcards);
  const [winnerCards, setWinnerCards] = useState("");
  const [roundWinner, setRoundWinner] = useState("");
  const [resNumber, setResNumber] = useState(DEFAULT.resNumber);
  const [decider, setDecider] = useState(false);
  const [pointsPerPlayer, setPointsPerPlayer] = useState(DEFAULT.pointsPerPlayer);
  const [choices, setChoices] = useState(DEFAULT.choices);

  socket.on("isDecider", ({ isDecider }) => {
    if (isDecider) {
      setDecider(isDecider);
      console.log(`socket.on(idecider) isDecider: ${decider}`);
    }
  });

  socket.on("handOutCards", ({ questionCard, playerAnswerCards, resNumber }) => {
    if (questionCard && playerAnswerCards && resNumber) {
      setHandCards(playerAnswerCards);
      setPlayCard(questionCard);
      setResNumber(resNumber);
      console.log(`socket.on(handoutCards) handcards: ${handCards}`);
      console.log(`socket.on(handoutCards) playcard: ${playCard}`);
    } else {
      setHandCards(DEFAULT.handcards);
      setPlayCard(DEFAULT.playCard);
      setResNumber(DEFAULT.resNumber);
    }
  });

  socket.on("choices", ({ cards }) => {
    console.log(`socket.on(choices) as Map: ${choices}`);
    if (cards) {
      let tempChoices;
      for (let [key, value] of cards) {
        if (tempChoices[value] === undefined) {
          tempChoices[value] = [key];
        } else {
          tempChoices[value].push(key);
        }
      }
      setChoices(tempChoices);
      console.log(`socket.on(choices) as Object: ${choices}`);
    } else {
      setChoices(DEFAULT.choices);
    }
    setPlayState('showSelectedCards');
  });

  socket.on("winnerAnouncement", ({ player, cards, pointsPerPlayer }) => {
    if (player && cards) {
      console.log(`socket.on(winnerAnouncement) winner: ${player}\nwith : ${cards}`);
      setWinnerCards(cards);
      setRoundWinner(player);
      setPointsPerPlayer(pointsPerPlayer);
      setPlayState("showWinner");
    } else {
      setWinnerCards(DEFAULT.winnerCards);
      setRoundWinner(DEFAULT.winner);
      setPointsPerPlayer(DEFAULT.pointsPerPlayer);
      setPlayState('showWinner');
    }
  });

  const onSelect = (card) => {
    console.log(`clicked:\n${card}`);
    for (let selectedCard of selectedCards) {
      if (selectedCard === card) {
        return;
      }
    }
    selectedCards.push(card);
    if (selectedCards.length === resNumber) {
      socket.emit("answer", selectedCards);
      setPlayState("showSelectedCards");
    }
  };

  function IsDecider({ decider }) {
    if (decider) {
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
      <WinnerCard playCard={playCard} winnerCards={winnerCards} winner={roundWinner}></WinnerCard>
    );
  }

  if (playState === "selectCard") {
    return (
      <>
        <Grid container spacing={10}>
          <IsDecider className={classes.note} decider={decider} />
          <Grid item xs={3}>
            <Ranking
              id="ranking"
              me={me}
              playerPoints={pointsPerPlayer}
            ></Ranking>
          </Grid>
          <Grid item xs={8}>
            <Card color="secondary" className={classes.playCard}>
              <CardContent>{playCard}</CardContent>
            </Card>
          </Grid>
          <Grid container item spacing={5}>
            {handCards.map((card) => {
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
                      disabled={decider}
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
