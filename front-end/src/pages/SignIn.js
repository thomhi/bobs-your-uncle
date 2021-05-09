import { useState } from "react";
import { Redirect } from "react-router";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Container,
  CircularProgress,
} from "@material-ui/core";
import {authenticationFormUseStyles} from '../styles/styles';
import {InputAdornment, IconButton} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import Error from '../components/Error';

export default function SignIn({
  authService,
  localStorageService,
  setIsAuthenticated,
}) {
  const classes = authenticationFormUseStyles();
  const [username, setUsername] = useState("");
  const [usernameTooShort, setUsernameTooShort] = useState(false);
  const [usernameUnchanged, setUsernameUnchanged] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordUnchanged, setPasswordUnchanged] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/bobs-your-uncle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatusCode, setErrorStatusCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const onSignIn = (event) => {
    setIsLoading(true);
    event.preventDefault();
    validateUsername();
    validatePassword();
    if (usernameTooShort || passwordTooShort) {
      return;
    }
    authService
      .signIn(username, password)
      .then(({jwt}) => {
        console.log(`${username} signed In\nwith JWT: ${jwt}`);
        setIsAuthenticated(true);
        localStorageService.setUserId(username);
        localStorageService.setJWT(jwt);
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

  const onSignUp = () => {
    setRedirectPath("/bobs-your-uncle/signUp");
    setRedirect(true);
  };

  const validateUsername = (synchronousUsername) => {
    const usernameToCheck = synchronousUsername ?? username;
    setUsernameTooShort(!(usernameToCheck.length > 0));
  };

  const validatePassword = (synchronousPassword) => {
    const passwordToCheck = synchronousPassword ?? password;
    setPasswordTooShort(!(passwordToCheck.length >= 8));
  };

  const handleClickShowPassword = () => {
    setPasswordShow(!passwordShow);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (redirect) {
    return <Redirect to={redirectPath} />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form id="login-form" className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            onChange={(event) => {
              setUsernameUnchanged(false);
              setUsername(event.target.value);
              validateUsername(event.target.value);
              setError(false);
            }}
            helperText={usernameTooShort?'invalide username':' '}
            error={usernameTooShort}
            value={username}
            autoComplete='on'
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            id="signin-button"
            fullWidth
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={onSignIn}
            type="submit"
            disabled={
              usernameTooShort ||
              passwordTooShort ||
              usernameUnchanged ||
              passwordUnchanged
            }
          >
            {isLoading ? (
              <CircularProgress
                style={{ marginBottom: "-5px", color: "#ffffff" }}
                size={20}
              />
            ) : (
              "Sign In"
            )}
          </Button>
          <Button
            id="login-register-navigation-button"
            variant="contained"
            color="secondary"
            onClick={onSignUp}
          >
            Registrieren
          </Button>
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
