import { useState } from "react";
import { gameStyle } from "../styles/styles";
import { Redirect } from "react-router";
import { Grid,TextField, CssBaseline, Button, InputAdornment, IconButton, CircularProgress,Container, Typography } from "@material-ui/core";
import {Visibility, VisibilityOff} from '@material-ui/icons';
import BackButton from '../components/BackButton';
import Error from '../components/Error';

export default function SignUp({
  authService,
  localStorageService,
  setIsAuthenticated,
}) {
  const classes = gameStyle();
  const [username, setUsername] = useState("");
  const [usernameTooShort, setUsernameTooShort] = useState(false);
  const [usernameUnchanged, setUsernameUnchanged] = useState(true);
  const [email, setEmail] = useState("");
  const [emailNoAt, setEmailNoAt] = useState(false);
  const [emailUnchanged, setEmailUnchanged] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordUnchanged, setPasswordUnchanged] = useState(true);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [
    passwordConfirmationNotMatching,
    setPasswordConfirmationNotMatching,
  ] = useState(false);
  const [
    passwordConfirmationUnchanged,
    setPasswordConfirmationUnchanged,
  ] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorStatusCode, setErrorStatusCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSignUp = (event) => {
    setIsLoading(true);
    event.preventDefault();
    validateUsername();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();
    if (
      usernameTooShort ||
      emailNoAt ||
      passwordTooShort ||
      passwordConfirmationNotMatching
    ) {
      return;
    }
    authService
      .signUp(username, password)
      .then(({ userID }) => {
        console.log(`${userID} signed Up`);
        localStorageService.setUserId(userID);
        setIsAuthenticated(true);
        setIsLoading(false);
        setRedirect(true);
      })
      .catch((error) => {
        if (error.response) {
          error.response.json().then((e) => {
            setErrorStatusCode(error.response.status);
            setErrorMessage(e.errorText);
            setIsLoading(false);
            setError(true);
          });
        } else {
          setErrorStatusCode("-");
          setErrorMessage("failed to fetch");
          setIsLoading(false);
          setError(true);
        }
      });
  };

  const validateUsername = (synchronousUsername) => {
    const usernameToCheck = synchronousUsername ?? username;
    setUsernameTooShort(!(usernameToCheck.length > 0));
  };

  const validateEmail = (synchronousEmail) => {
    const emailToCheck = synchronousEmail ?? email;
    setEmailNoAt(!emailToCheck.includes("@"));
  };

  const validatePassword = (synchronousPassword) => {
    const passwordToCheck = synchronousPassword ?? password;
    setPasswordTooShort(!(passwordToCheck.length >= 8));
  };

  const validatePasswordConfirmation = (synchronousPasswordConfirmation) => {
    const passwordConfirmationToCheck =
      synchronousPasswordConfirmation ?? passwordConfirmation;
    setPasswordConfirmationNotMatching(
      passwordConfirmationToCheck !== password
    );
  };

  const handleClickShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (redirect) {
    return <Redirect to={"/bobs-your-uncle"} />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} action="/bobs-your-uncle">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                onChange={(event) => {
                  setUsernameUnchanged(false);
                  setUsername(event.target.value);
                  validateUsername(event.target.value);
                  setError(false);
                }}
                helperText={usernameTooShort ? "invalide username" : " "}
                error={usernameTooShort}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => {
                  setEmailUnchanged(false);
                  setEmail(event.target.value);
                  validateEmail(event.target.value);
                  setError(false);
                }}
                helperText={emailNoAt ? "invalide email" : " "}
                error={emailNoAt}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type={passwordShow ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(event) => {
                  setPasswordUnchanged(false);
                  setPassword(event.target.value);
                  validatePassword(event.target.value);
                  setError(false);
                }}
                helperText={
                  passwordTooShort
                    ? "password must be at least 8 characters long"
                    : " "
                }
                error={passwordTooShort}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {passwordShow ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="confirm password"
                type={passwordShow ? 'text' : 'password'}
                id="password2"
                autoComplete="current-password"
                onChange={(event) => {
                  setPasswordConfirmationUnchanged(false);
                  setPasswordConfirmation(event.target.value);
                  validatePasswordConfirmation(event.target.value);
                  setError(false);
                }}
                helperText={
                  passwordConfirmationNotMatching
                    ? "passwords must be equal"
                    : " "
                }
                error={passwordConfirmationNotMatching}
              />
            </Grid>
          </Grid>
          <Button
            id="signup-button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={
              usernameTooShort ||
              emailNoAt ||
              passwordTooShort ||
              passwordConfirmationNotMatching ||
              usernameUnchanged ||
              emailUnchanged ||
              passwordUnchanged ||
              passwordConfirmationUnchanged
            }
            onClick={onSignUp}
          >
            {isLoading ? (
              <CircularProgress
                style={{ marginBottom: "-5px", color: "#ffffff" }}
                size={20}
              />
            ) : (
              "Sign Up"
            )}
          </Button>
          <BackButton redirectPath={"/bobs-your-uncle/signIn"} />
        </form>
        {error && (
          <Error
            statusCode={errorStatusCode}
            errorMessage={errorMessage}
            resetError={() => setError(false)}
          />
        )}
      </div>
    </Container>
  );
}
