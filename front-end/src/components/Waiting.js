import { Card, CardContent } from "@material-ui/core";
import { useState } from "react";

export function Waiting({ text }) {
  const [onWaitingText, setOnWaitingText] = useState(text);

//   let countDown = 5;
//   function onWaiting(timeOut) {
//     while (countDown > 0) {
//       console.log("onElevation");
//       setTimeout(() => {
//         setOnWaitingText(onWaitingText + " .");
//         countDown--;
//       }, timeOut);
//     }
//   }

  return (
    <Card>
      {/* {onWaiting(1000)} */}
      <CardContent>{onWaitingText}</CardContent>
    </Card>
  );
}
