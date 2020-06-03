import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Booking/BookingList/BookingList";

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

  const deleteBookingHandler = async (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
              cancelBooking (bookingId: $id) {
                _id,
                title
              }
          }
      `,
      variables: {
        id: bookingId,
      },
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
        throw new Error("Something is wrong while deleting bookings");
      }
      const {
        data: { cancelBooking },
      } = await response.json();
      setBookings([...bookings.filter((booking) => booking._id !== bookingId)]);
      if (isActive) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (isActive) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <BookingList
          bookings={bookings}
          onDelete={deleteBookingHandler}
        ></BookingList>
      )}
    </>
  );
}
