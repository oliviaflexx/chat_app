import { useContext, useRef } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/authContext";
// import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const { isFetching, dispatch, error } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    console.log(dispatch)
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
          {/* {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )} */}
          Log in
        </button>
        <span className="loginForgot">Forgot Password?</span>
        <button className="loginRegisterButton">
          {/* {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )} */}
          Create a new account
        </button>
      </form>
    </>
  );
}
