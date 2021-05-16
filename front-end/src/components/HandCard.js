import { Card, CardActionArea, CardContent } from "@material-ui/core";
import { useState } from "react";
import { gameStyle } from "../styles/styles";

export default function HandCard({ onSelect, card, decider }) {
  const classes = gameStyle();
  const [active, setActive] = useState(false);

  return (
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
  );
}
