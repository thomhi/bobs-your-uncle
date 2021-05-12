import { Card, CardActionArea, CardContent, Grid } from "@material-ui/core";
import { useState } from "react";
import { gameStyle } from "../styles/styles";

export default function HandCard({ onSelect, card, decider }) {
  const classes = gameStyle();
  const [active, setActive] = useState(false);

  return (
    <Grid key={card._id} item xs={2}>
      <Card
        className={`${classes.handCard} ${
          active ? classes.selectedCard : null
        }`}
      >
        <CardActionArea
          className={classes.handCard}
          disabled={active ? false : decider}
          onClick={() => {
            onSelect(card, !active);
            setActive(!active);
          }}
        >
          <CardContent>{card.content}</CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
