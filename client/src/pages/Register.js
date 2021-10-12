import axios from "axios";
import { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/authContext";

export default function Register() {
  const username = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(passwordAgain.current.value);
    console.log(password.current.value);
    if (passwordAgain.current.value !== password.current.value) {
      setError("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("api/auth/register", user);
        loginCall(
          {
            username: username.current.value,
            password: password.current.value,
          },
          dispatch
        );
      } catch (err) {
        console.log(err);
        setError(true)
      }
    }
  };

  return (
    <div className="main">
      <div>{error ? "Username already taken": ""}</div>
      <div className="row">
        <div className="col-12 auth">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="login">Already have an account?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
