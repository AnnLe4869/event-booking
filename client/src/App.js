import React from "react";
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

function App() {
  return (
    <Router>
      <>
        <Navigation></Navigation>

        <main className="main-content">
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
            <Redirect to="/auth"></Redirect>
          </Switch>
        </main>
      </>
    </Router>
  );
}

export default App;
