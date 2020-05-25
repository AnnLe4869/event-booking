import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./App.css";

import Auth from "./page/Auth";
import Event from "./page/Event";
import Booking from "./page/Booking";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth></Auth>
        </Route>
        <Route path="/events">
          <Event></Event>
        </Route>
        <Route path="/bookings">
          <Booking></Booking>
        </Route>
        <Redirect from="/" to="/auth" exact></Redirect>
      </Switch>
    </Router>
  );
}

export default App;
