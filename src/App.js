import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserRegistration from "./components/UserRegistration";
import UserLogin from "./components/UserLogin";
import AllUsers from "./components/AllUsers";
import SiteNav from "./components/Nav";
import UserLogout from "./components/UserLogout";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Home />}></Route>
          <Route
            exact
            path="/users/registration"
            element={<UserRegistration />}
          ></Route>
          <Route exact path="/users/login" element={<UserLogin />}></Route>
          <Route exact path="/logout" element={<UserLogout />}></Route>
          <Route exact path="/users/all" element={<AllUsers />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
