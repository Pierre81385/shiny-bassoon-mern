import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserRegistration from "./components/UserRegistration";
import AllUsers from "./components/AllUsers";

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
          <Route exact path="/users/all" element={<AllUsers />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
