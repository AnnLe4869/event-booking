import React, { useContext } from "react";
import AuthContext from "../../../../context/auth-context";
import "./EventItem.css";

export default function EventItem({ item: { _id, title, price, creator } }) {
  const authContext = useContext(AuthContext);
  return (
    <>
      <li className="events__list-item">
        <div>
          <h1>{title}</h1>
          <h2>{`$${price}`}</h2>
        </div>

        <div>
          {authContext.userId === creator._id ? (
            <p>You are the owner of this event</p>
          ) : (
            <button className="btn">View detail</button>
          )}
        </div>
      </li>
    </>
  );
}
