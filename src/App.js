import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserRegistration from "./components/UserRegistration";
import UserLogin from "./components/UserLogin";
import AllUsers from "./components/AllUsers";
import UserLogout from "./components/UserLogout";
import Container from "react-bootstrap/esm/Container";
import Rooms_DM from "./components/Rooms_DM";

export default function App() {
  const style = {
    container: {},
  };

  return (
    <Container style={style.container}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Home />}></Route>
          <Route
            exact
            path="/users/registration"
            element={<UserRegistration />}
          ></Route>
          <Route exact path="/users/login" element={<UserLogin />}></Route>
          <Route exact path="/users/dm/:_id" element={<Rooms_DM />}></Route>
          <Route exact path="/logout" element={<UserLogout />}></Route>
          <Route exact path="/users/all" element={<AllUsers />}></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
