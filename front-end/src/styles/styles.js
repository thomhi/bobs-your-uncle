import { makeStyles, createStyles } from "@material-ui/core/styles";
import loginBackgroundImage from "../assets/loginBackgroundImage.jpg";
import registerBackgroundImage from "../assets/registerBackgroundImage.jpg";

export const gameStyle = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ranking: {
    overflow: "hidden",
    padding: "1%",
    backgroundColor: "#eafac5",
  },
  rank: {
    overflow: "hidden",
  },
  selectedCard: {
    backgroundColor: "#DDDDDD",
    zIndex: 1,
  },
  playCard: {
    padding: "5%",
    backgroundColor: "#f16054",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "150%",
    fontFamily: "inherit",
    zIndex: 1,
  },
  handCard: {
    overflow: 'auto',
    textAlign: 'start',
    vh: "10%"
  },
  cardCombi: {
    border: "3px solid black",
    borderRadius: "20px",
  },
  note: {},
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
  image1: {
    backgroundImage: `url(${loginBackgroundImage})` /*`url("https://www.themoviedb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg")`,*/,
    backgroundRepeat: "no-repeat",
    backgroundSize: "max(100vw, 100vh)",
    backgroundPositionX: "center",
  },
  image2: {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${registerBackgroundImage})` /*`url("https://www.themoviedb.org/t/p/original/xRWht48C2V8XNfzvPehyClOvDni.jpg")`,*/,
    backgroundRepeat: "no-repeat",
    backgroundSize: "max(100vw, 100vh)",
    backgroundPositionX: "center",
  },
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
    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
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

export const searchUseStylesLessThan480 = makeStyles((theme) =>
  createStyles({
    root: {
      width: "auto",
      padding: "0px 10px",
    },
    paper: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    icon: {
      margin: 10,
    },
  })
);

export const searchUseStylesGreaterThan480 = makeStyles((theme) =>
  createStyles({
    root: {
      width: "clamp(480px, 100%, 1000px)",
      padding: "0px 10px",
    },
    paper: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    icon: {
      margin: 10,
    },
  })
);

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

export const profileUseStyles = makeStyles((theme) => ({
  usernameContainer: {
    height: "50px",
    width: "clamp(0px, 100% - 100px, 880px)",
  },
  username: {
    lineHeight: "50px",
    marginTop: "0",
    marginLeft: "20px",
    marginRight: "20px",
    fontSize: "2.5em",
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  backgroundImage: {
    height: "200px",
    backgroundImage:
      "linear-gradient(to top right, rgba(0,0,0,1), rgba(0,0,0,0)), url(https://img.luzernerzeitung.ch/2018/4/13/1ccb8633-0f8b-4a08-ae12-9c70e9220fd3.jpeg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  userContainer: {
    display: "flex",
    position: "absolute",
    bottom: "20px",
    left: "20px",
    right: "0",
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    zIndex: 1,
  },
  settingsButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  backButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
  },
  followChip: {
    position: "absolute",
    bottom: "0",
    left: "116px",
  },
}));

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
