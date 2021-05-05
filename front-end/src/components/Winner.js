import { Card, CardContent, Paper } from "@material-ui/core";

export function Winner({ text }) {
  return (
    <Paper color="secondary">
      <Card>
        <CardContent>{text}</CardContent>
      </Card>
    </Paper>
  );
}
