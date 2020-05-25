import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

export default function MainNavigation() {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Easy event</h1>
      </div>

      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/auth">Authentication</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
