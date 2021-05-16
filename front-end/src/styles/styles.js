import { makeStyles, createStyles } from "@material-ui/core/styles";

export const gameStyle = makeStyles((theme) => ({
  
  container: {
    paddingTop: '50px',
  },
  menu: {
    position: 'absolute',
    top: '10px',
    right: '50px',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ranking: {
    padding: "1%",
    backgroundColor: "#f3f7dd",
  },
  rank: {
    overflow: "hidden",
    display: 'block',
    padding: "1%",
    backgroundColor: "#f3f7bb",
    whiteSpace: 'nowrap',
  },
  title: {
    marginBottom: "5%",
    backgroundColor: "#123456",
    fontFamily: "Gill Sans Extrabold, monospace",
    color: "#FFFFFF",
    padding: "2%",
    borderRadius: "20px",
  },
  avatar: {
    margin: "0 auto",
    alignItems: "center",
  },
  player: {
    marginBottom: "5%",
    textAlign: "center",
  },
  selectedCard: {
    border: "2px solid #a0a500",
    backgroundColor: "#FEFB62",
    zIndex: 3,
  },
  playCard: {
    padding: "5%",
    color: "#FFFFFF",
    backgroundColor: "#000000",
    border: "2px solid #edeee2",
    borderRadius: "20px",
    fontSize: "150%",
    fontFamily: "inherit",
    zIndex: 1,
    verticalAlign: "center",
  },
  handCard: {
    overflow: "hidden",
    textAlign: "start",
    height: '150px',
    width: '120px',
  },
  emitButton: {
    border: "2px solid blue",
    color: "white",
    backgroundColor: "blue",
    width: '100%',
    "&:hover": {
      color: "blue",
    },
  },
  cardCombi: {
    border: "3px solid black",
    borderRadius: "20px",
  },
  roundState: {
    textAlign: "center",
    marginTop: "10vh",
    background: 'transparent',
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  exitLobby: {
    border: `2px dotted ${theme.palette.secondary.main}`,
    borderRadius: "10px",
    color: theme.palette.secondary.main,
    maxWidth: "64px",
    maxHeight: "64px",
    position: "absolute",
    top: "10px",
    left: "10px",
  },
}));

export const appUseStylesLessThan480 = makeStyles({
  root: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "auto",
    position: "relative",
    overflow: "hidden",
  },
});

export const appUseStylesGreaterThan480 = makeStyles({
  root: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "clamp(480px, 100%, 1000px)",
    position: "relative",
    overflow: "hidden",
  },
});

export const tabsContainerUseStyles = makeStyles(() => ({
  tabContainer: {
    display: "contents",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  sticky: {
    position: "fixed",
    backgroundColor: "#000000",
    width: "clamp(0px, 100%, 1000px)",
    top: 0,
  },
  nonSticky: {},
  margin: {
    marginTop: "48px",
  },
}));

// Used in Login.tsx and Register.tsx
export const authenticationFormUseStyles = makeStyles((theme) => ({
  darkLayer: {
    margin: "auto",
    width: "min-content",
    textAlign: "center",
    fontSize: "1.5em",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "0 20px",
  },
  container: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    overflowY: "auto",
    left: 0,
    top: 0,
  },
  form: {
    "& > *": {
      margin: theme.spacing(0),
      width: "calc(100% - 16px)",
    },
    "& > Button": {
      margin: theme.spacing(1),
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& > Button:nth-of-type(1)": {
      width: "200px",
    },
    "& > Button:nth-of-type(2)": {
      width: "150px",
    },
    "&": {
      margin: "0 auto",
      width: "clamp(200px, 100%, 400px)",
    },
    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
      {
        transition: "background-color 5000s ease-in-out 0s",
      },
    "& .MuiFilledInput-input:-webkit-autofill": {
      "-webkit-box-shadow": "inherit",
    },
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

export const backButtonUseStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      fontSize: "2em",
      color: theme.palette.primary.main,
      maxWidth: "64px",
      maxHeight: "64px",
      position: "absolute",
      top: "10px",
      left: "10px",
    },
  })
);

export const errorUseStyles = makeStyles({
  root: {
    minWidth: 275,
    textAlign: "left",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    color: "#ff6565",
  },
  backdrop: {
    color: "#fff",
  },
});

export const hintStyle = makeStyles({
  root: {
    minWidth: 275,
    textAlign: "left",
  },
  backdrop: {
    color: "#fff",
  },
});
