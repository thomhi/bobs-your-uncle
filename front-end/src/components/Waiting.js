import { Backdrop, Card, CardContent } from "@material-ui/core";
import { useEffect, useState } from "react";
import { hintStyle } from "../styles/styles";

export function Waiting({ text }) {
  const classes = hintStyle();
  const [onWaitingText, setOnWaitingText] = useState(text);
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setOnWaitingText(onWaitingText.length < text.length + 10 ? onWaitingText + " ." : text);
    }, 1000);
  });

  return (
    <Backdrop
      className={classes.backdrop}
      open={open}
      onClick={handleClose}
      style={{ zIndex: 3 }}
    >
      <Card className={classes.root}>
        <CardContent>{onWaitingText}</CardContent>
      </Card>
    </Backdrop>
  );
}
