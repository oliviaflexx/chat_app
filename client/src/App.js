import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import { SocketProvider } from "./context/socketContext";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Messenger from "./pages/Messenger";
import './App.css';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            {user ? <Home /> : <Register />}
          </Route>
          <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/messenger">
            {!user ? <Redirect to="/" /> : <Messenger />}
          </Route>
          <Route path="/logout">{<Logout />}</Route>
        </Switch>
      </Router>
    </SocketProvider>
  );
}

export default App;
