import React from "react";
import "./EventItem.css";

export default function EventItem({ item: { _id, title } }) {
  return (
    <>
      <li className="events__list-item">{title}</li>
    </>
  );
}
