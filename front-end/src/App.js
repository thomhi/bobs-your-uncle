import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "./businessLogic/AuthService";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import { Container } from "@material-ui/core";
import { localStorageService } from "./businessLogic/LocalStroageService";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true" ? true : false
  );
  const [userID, setUserID] = useState(localStorageService.getUserId());

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
    setUserID(localStorageService.getUserId());
  }, [isAuthenticated]);

  return (
    <Router>
      <Container>
        <Switch>
          <Route
            path="/signIn"
            render={() => (
              <SignIn
                authService={authService}
                localStorageService={localStorageService}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          />
          <PrivateRoute
            exact
            path="/"
            component={Home}
            userID={userID}
            isAuthenticated={isAuthenticated}
          />
          <Route
            path="/signUp"
            render={() => (
              <SignUp
                authService={authService}
                localStorageService={localStorageService}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          />
          <PrivateRoute
            path="/lobby"
            component={Lobby}
            userID={userID}
            isAuthenticated={isAuthenticated}
          />
        </Switch>
      </Container>
    </Router>
  );
}
