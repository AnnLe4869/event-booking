import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const history = useHistory();
  const authContext = useContext(AuthContext);

  async function fetchData() {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
              bookings {
                _id,
                createdAt,
                event {
                  _id, 
                  title,
                  date
                }
              }
          }
      `,
    };
    const { token } = authContext;
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something is wrong while fetching bookings");
      }
      const {
        data: { bookings },
      } = await response.json();
      if (isActive) {
        setBookings([...bookings]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (isActive) {
        setIsLoading(false);
      }
      history.go("/auth");
    }
  }
  useEffect(() => {
    fetchData();
    return () => {
      setIsActive(false);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.event.title}-
              {new Date(booking.event.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
