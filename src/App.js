import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Users_Registration from "./components/Users_Registration";
import Users_Login from "./components/Users_Login";
import Users_All from "./components/Users_All";
import Container from "react-bootstrap/esm/Container";
import Rooms_DM from "./components/Rooms_DM";
import Rooms_All from "./components/Rooms_All";
import Main from "./components/Main";
import Rooms_Chat from "./components/Rooms_Chat";

export default function App() {
  const style = {
    container: {},
  };

  return (
    <Container style={style.container}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/main" element={<Main />}></Route>
          <Route
            exact
            path="/users/registration"
            element={<Users_Registration />}
          ></Route>
          <Route exact path="/users/login" element={<Users_Login />}></Route>
          <Route exact path="/users/dm/:_id" element={<Rooms_DM />}></Route>
          <Route
            exact
            path="/rooms/:_roomName"
            element={<Rooms_Chat />}
          ></Route>
          <Route exact path="/rooms/all" element={<Rooms_All />}></Route>
          <Route exact path="/users/all" element={<Users_All />}></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
