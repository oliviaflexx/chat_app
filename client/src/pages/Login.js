import { useContext, useRef } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/authContext";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const { isFetching, dispatch, error } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { username: username.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <>
      <div>{error ? "Error while logging in" : ""}</div>
      <form className="loginBox" onSubmit={handleClick}>
        <input
          placeholder="Username"
          type="text"
          required
          className="loginInput"
          ref={username}
        />
        <input
          placeholder="Password"
          type="password"
          required
          minLength="6"
          className="loginInput"
          ref={password}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
   
          Log in
        </button>
        <span className="loginForgot">Forgot Password?</span>
        <button className="loginRegisterButton">
          Create a new account
        </button>
      </form>
    </>
  );
}
