import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import {Link} from "react-router-dom";

export default function Logout() {
  const { dispatch } = useContext(AuthContext);
  
  useEffect(() => {
    dispatch({ type: "LOGOUT" });
  },)

  return (
  <div>Successfully logged out
      <Link to="/login">Login</Link>
  </div>
  );
}
