import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HOME from "./components/Home";
import USERS_REGISTRATION from "./components/Users_Registration";
import USERS_LOGIN from "./components/Users_Login";
import USERS_ALL from "./components/Users_All";
import Container from "react-bootstrap/esm/Container";
import ROOMS_DM from "./components/Rooms_DM";
import ROOMS_ALL from "./components/Rooms_All";
import MAIN from "./components/Main";
import ROOMS_CHAT from "./components/Rooms_Chat";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4200/");

export default function App() {
  const style = {
    container: {},
  };

  return (
    <Container style={style.container}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HOME socket={socket} />}></Route>
          <Route exact path="/main" element={<MAIN socket={socket} />}></Route>
          <Route
            exact
            path="/users/registration"
            element={<USERS_REGISTRATION socket={socket} />}
          ></Route>
          <Route
            exact
            path="/users/login"
            element={<USERS_LOGIN socket={socket} />}
          ></Route>
          <Route
            exact
            path="/users/dm/:_id"
            element={<ROOMS_DM socket={socket} />}
          ></Route>
          <Route
            exact
            path="/rooms/:_roomName"
            element={<ROOMS_CHAT socket={socket} />}
          ></Route>
          <Route
            exact
            path="/rooms/all"
            element={<ROOMS_ALL socket={socket} />}
          ></Route>
          <Route
            exact
            path="/users/all"
            element={<USERS_ALL socket={socket} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
