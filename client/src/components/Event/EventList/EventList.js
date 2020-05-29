import React from "react";
import EventItem from "./EventItem/EventItem";
import "./EventList.css";

export default function EventList({ items }) {
  return (
    <ul className="event__list">
      {items.map((item) => (
        <EventItem key={item._id} item={item}></EventItem>
      ))}
    </ul>
  );
}
