import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./Auth.css";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query LoginEmail ($email: String!, $password: String!) {
            login(email: $email, password: $password){
              userId,
              token,
              tokenExpiration
            }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser ($email: String!, $password: String!) {
            createUser (userInput: {
              email: $email, 
              password: $password
            }){
              _id,
              email
            }
          }
        `,
        variables: {
          email,
          password,
        },
      };
    }

    try {
      const response = await fetch("http://localhost:8000/graphql", {
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
      setIsLoading(false);
      setEmail("");
      setPassword("");
      if (!data.hasOwnProperty("login")) setIsLogin(true);

      if (data.hasOwnProperty("login") && data.login.token) {
        const { token, userId, tokenExpiration } = data.login;
        authContext.login(token, userId, tokenExpiration);
        history.push("/events");
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      //throw err;
    }
  };

  return (
    <>
      {isLoading ? <Spinner></Spinner> : null}
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
