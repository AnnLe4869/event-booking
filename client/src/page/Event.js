import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./Event.css";

import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Event/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

export default function Event() {
  const [creating, setCreating] = useState(false);
  const [input, setInput] = useState({
    title: "",
    price: "",
    date: "",
    description: "",
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const authContext = useContext(AuthContext);
  const history = useHistory();

  async function fetchData() {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
              events {
                _id,
                title,
                description,
                date,
                price,
                creator {
                  _id
                  email
                }
              }
          }
      `,
    };
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something is wrong while fetching data");
      }
      const {
        data: { events },
      } = await response.json();
      setItems([...events]);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      history.go("/auth");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const startCreatingEventHandler = () => {
    if (!authContext.token) {
      return history.push("/auth");
    }
    setCreating(!creating);
  };

  const modalInputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const modalConfirmHandler = async () => {
    // Check the input if null input reject
    const { title, price, description, date } = input;
    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      description.trim().length === 0 ||
      date.trim().length === 0
    ) {
      return;
    }
    // Check authentication
    const { token } = authContext;
    if (!token) {
      history.push("/auth");
    }
    // If user already authenticate, process to build the request body
    const requestBody = {
      query: `
        mutation {
          createEvent (eventInput: {
            title: "${title}",
            price: ${parseFloat(price)},
            date: "${date}",
            description: "${description}"
          }){
            _id,
            title,
            date,
            price, 
            description
          }
        }
      `,
    };
    setIsLoading(true);

    try {
      // Send the request for creating the event
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something is wrong with the process");
      }
      // If request success get the data from that and add to list of current items without another fetch
      const { data } = await response.json();
      setItems([
        ...items,
        { ...data.createEvent, creator: { _id: authContext.userId } },
      ]);
      setIsLoading(false);
      setCreating(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      //throw err;
    }
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const showItemDetailHandler = (eventId) => {
    const event = items.find((item) => item._id === eventId);
    setSelectedEvent(event);
  };

  const bookEventHandler = async () => {
    const requestBody = {
      query: `
          mutation {
              bookEvent (eventId: "${selectedEvent._id}") {
                _id,
                createdAt,
                updatedAt
              }
          }
      `,
    };
    // Check authentication
    const { token } = authContext;
    if (!token) {
      setSelectedEvent(null);
      history.push("/auth");
    }
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
        throw new Error("Something is wrong while booking event");
      }
      const {
        data: { bookEvent },
      } = await response.json();
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      history.go("/auth");
    }
  };

  return (
    <>
      {/* Form for creating new event */}
      {creating ? (
        <>
          <Backdrop></Backdrop>
          <Modal
            title="Add new event"
            canConfirm={true}
            canCancel={true}
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
            confirmText="Add"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={input.title}
                  onChange={modalInputHandler}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={input.price}
                  onChange={modalInputHandler}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  id="date"
                  value={input.date}
                  onChange={modalInputHandler}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  required="required"
                  value={input.description}
                  onChange={modalInputHandler}
                ></textarea>
              </div>
            </form>
          </Modal>
        </>
      ) : null}

      {/* Form for view detail of an event and booking an event */}
      {selectedEvent && (
        <>
          <Backdrop></Backdrop>
          <Modal
            title={selectedEvent.title}
            canConfirm
            canCancel
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText={authContext.token ? "Book" : "Confirm"}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        </>
      )}

      {/* Only when user log in can they create new event */}
      {authContext.token ? (
        <div className="events-control">
          <p>Share your own event!</p>
          <button className="btn" onClick={startCreatingEventHandler}>
            Create event
          </button>
        </div>
      ) : null}
      {/* Spinner when user submit an event */}
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <EventList
          items={items}
          onViewDetail={showItemDetailHandler}
        ></EventList>
      )}
    </>
  );
}
