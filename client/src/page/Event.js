import React, { useContext } from "react";
import AuthContext from "../context/auth-context";

export default function Event() {
  const context = useContext(AuthContext);
  return <h1>Event</h1>;
}
