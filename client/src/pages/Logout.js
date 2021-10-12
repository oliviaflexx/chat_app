import {Link} from "react-router-dom";

export default function Logout() {

  return (
    <div className="main">
      <h1 id="logout">Sorry to see you go!</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}
