import React from "react";
import "./BookingControl.css";
export default function BookingControl({ onChange, activeOutputType }) {
  return (
    <div className="bookings-control">
      <button
        className={activeOutputType === "list" ? "active" : ""}
        onClick={() => onChange("list")}
      >
        List
      </button>
      <button
        className={activeOutputType === "chart" ? "active" : ""}
        onClick={() => onChange("chart")}
      >
        Chart
      </button>
    </div>
  );
}
