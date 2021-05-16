import { Container, Step, StepLabel, Stepper } from "@material-ui/core";
import { gameStyle } from "../styles/styles";

const getSteps = (decider) => {
  if (decider) {
    return [
      "wait until all players choose their cards",
      "select best cardcombination",
      "start new round",
    ];
  } else {
    return [
      "select your card(s)",
      "wait for roundmaster",
      "roundmaster must start new round",
    ];
  }
};

const roundInfo = {
  selectCard: 0,
  showSelectedCards: 1,
  showWinner: 2,
};

export function RoundState({ decider, roundState }) {
  const classes = gameStyle();
  const steps = getSteps(decider);
  return (
    <Container className={classes.roundState}>
      <h2 style={{textAlign: 'center'}}>{decider ? 'you are the roundmaster' : '' }</h2>
      <Stepper activeStep={roundInfo[roundState]}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Container>
  );
}
