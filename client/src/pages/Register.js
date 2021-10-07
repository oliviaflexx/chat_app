import axios from "axios";
import { useRef, useState } from "react";
import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [error, setError] = useState("");

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
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
    <div>{error}</div>
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
        <button className="loginRegisterButton">Log into Account</button>
      </form>
    </>
  );
}
