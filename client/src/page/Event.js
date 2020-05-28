import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../context/auth-context";
import "./Event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

export default function Event() {
  const [creating, setCreating] = useState(false);
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const [input, setInput] = useState({
    title: "",
    price: "",
    date: "",
    description: "",
  });
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
            title,
            date.
            creator {
              email
            }
          }
        }
      `,
    };
    // Send the request for creating the event
    try {
      const response = await fetch("/graphql", {
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
      const data = await response.json();
      console.log(data);
      setCreating(false);
    } catch (err) {
      console.error(err);
      //throw err;
    }
  };

  const modalCancelHandler = () => setCreating(false);
  return (
    <div className="events-control">
      {creating ? (
        <>
          <Backdrop></Backdrop>
          <Modal
            title="Add event"
            canConfirm={true}
            canCancel={true}
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
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
      <p>Share your own event!</p>
      <button className="btn" onClick={startCreatingEventHandler}>
        Create event
      </button>
    </div>
  );
}
