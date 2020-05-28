import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./Auth.css";
import AuthContext from "../context/auth-context";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const inputHandler = (e) => {
    if (e.target.name === "email") setEmail(e.target.value);
    if (e.target.name === "password") setPassword(e.target.value);
  };
  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query {
            login(email: "${email}", password: "${password}"){
              userId,
              token,
              tokenExpiration
            }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser (userInput: {
              email: "${email}", 
              password: "${password}"
            }){
              _id,
              email
            }
          }
        `,
      };
    }

    try {
      const response = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        setEmail("");
        setPassword("");
        throw new Error("Your credentials are invalid");
      }
      const { data } = await response.json();
      if (data.login.token) {
        const { token, userId, tokenExpiration } = data.login;
        authContext.login(token, userId, tokenExpiration);
        history.push("/events");
      }
    } catch (err) {
      console.error(err);
      //throw err;
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={inputHandler}
            value={email}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={inputHandler}
            value={password}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </form>
    </>
  );
}
