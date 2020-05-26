import React, { useContext, useState } from "react";
import AuthContext from "../context/auth-context";
import "./Event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

export default function Event() {
  const [creating, setCreating] = useState(false);
  const startCreatingEventHandler = () => {
    setCreating(!creating);
  };
  const modalConfirmHandler = () => {};
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
            <p>Modal content</p>
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
