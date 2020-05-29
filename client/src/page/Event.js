import React, { useContext, useState, useEffect } from "react";
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
  const [items, setItems] = useState([]);

  async function fetchData() {
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
    } catch (err) {
      console.error(err);
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
            title,
            date,
            creator {
              email
            }
          }
        }
      `,
    };
    // Send the request for creating the event
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
        throw new Error("Something is wrong with the process");
      }
      await response.json();
      await fetchData();
      setCreating(false);
    } catch (err) {
      console.error(err);
      //throw err;
    }
  };

  const modalCancelHandler = () => setCreating(false);
  return (
    <>
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
      {authContext.token ? (
        <div className="events-control">
          <p>Share your own event!</p>
          <button className="btn" onClick={startCreatingEventHandler}>
            Create event
          </button>
        </div>
      ) : null}
      <ul className="events__list">
        {items.map(({ _id, title, date, description, price }) => (
          <li key={_id} className="events__list-item">
            {title}
          </li>
        ))}
      </ul>
    </>
  );
}
