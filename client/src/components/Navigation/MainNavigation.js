import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";

export default function MainNavigation() {
  const authContext = useContext(AuthContext);
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Easy event</h1>
      </div>

      <nav className="main-navigation__items">
        <ul>
          {authContext.token ? null : (
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {authContext.token ? (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={authContext.logout}>Log out</button>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
