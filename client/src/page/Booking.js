import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Booking/BookingList/BookingList";
import BookingChart from "../components/Booking/BookingChart/BookingChart";
import BookingControl from "../components/Booking/BookingControl/BookingControl";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [outputType, setOutputType] = useState("list");
  const history = useHistory();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
    return () => {
      setIsActive(false);
    };
  }, []);

  const fetchData = async () => {
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
                  date,
                  price
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
  };

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
      await response.json();
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

  const changeOutputTypeHandler = (outputType) => {
    setOutputType(outputType);
  };

  let content = <Spinner></Spinner>;
  if (!isLoading) {
    content = (
      <React.Fragment>
        <BookingControl
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        ></BookingControl>
        <div>
          {outputType === "list" ? (
            <BookingList
              bookings={bookings}
              onDelete={deleteBookingHandler}
            ></BookingList>
          ) : (
            <BookingChart bookings={bookings}></BookingChart>
          )}
        </div>
      </React.Fragment>
    );
  }
  return <>{content}</>;
}
