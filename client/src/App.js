import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";

import Auth from "./page/Auth";
import Event from "./page/Event";
import Booking from "./page/Booking";
import Navigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const login = (token, userId, _) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };
  return (
    <Router>
      <>
        <AuthContext.Provider
          value={{
            token,
            userId,
            login,
            logout,
          }}
        >
          <Navigation></Navigation>

          <main className="main-content">
            <Switch>
              {!token && (
                <Route path="/auth">
                  <Auth></Auth>
                </Route>
              )}
              <Route path="/events">
                <Event></Event>
              </Route>
              {token && (
                <Route path="/bookings">
                  <Booking></Booking>
                </Route>
              )}
              {!token && <Redirect to="/auth"></Redirect>}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </Router>
  );
}

export default App;
