import { useContext, useRef } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const { dispatch, error } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { username: username.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="main">
      <div>{error ? "Error while logging in" : ""}</div>
      <div className="row">
        <div className="col-12 auth">
          {/* <h1>Login</h1> */}
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
            <button className="loginButton" type="submit">
              Log in
            </button>
            <Link to="register">No account? Create one here!</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
