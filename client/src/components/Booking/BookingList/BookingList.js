import React from "react";
import "./BookingList.css";

export default function BookingList({ bookings, onDelete }) {
  return (
    <div>
      <ul className="bookings__list">
        {bookings.map((booking) => (
          <li key={booking._id} className="bookings__item">
            <div className="bookings__item-data">
              {booking.event.title}-
              {new Date(booking.event.date).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
              <button
                className="btn"
                onClick={onDelete.bind(this, booking._id)}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
