import React from "react";
import "./Auth.css";

export default function Auth() {
  return (
    <>
      <form action="/graphql" method="post" className="auth-form">
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="form-actions">
          <button type="submit">Sign in</button>
          <button type="button">Switch to sign up</button>
        </div>
      </form>
    </>
  );
}
