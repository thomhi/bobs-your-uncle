import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Paper,
} from "@material-ui/core";
import { apiService } from "../businessLogic/APIService";
//import Card from "../components/Card";
import { Ranking } from "../components/Ranking";
//import PlayCard from "../components/PlayCard";

export default function PlayGame() {
  
  const playCard = apiService.getPlayCard();
  const handCards = apiService.getHandCards();
  const players = apiService.getPlayers();

  return (
    <>
      <Grid container spacing={10}>
        <Grid item xs={3}>
          <Paper elevation={24}>
            <Ranking id="ranking" players={players}></Ranking>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardContent>{playCard.text}</CardContent>
          </Card>
        </Grid>
        <Grid container item spacing={5}>
          {handCards.map((card) => {
            return (
              <Grid key={card} className="hand-card" item xs={3}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      console.log(card);
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
