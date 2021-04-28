import { Button } from "@material-ui/core";

export default function PlayCard({text}) {
  return (
    <Button className="play-card" variant="contained" color="secondary" fullWidth>
      {text}
    </Button>
  );
}
