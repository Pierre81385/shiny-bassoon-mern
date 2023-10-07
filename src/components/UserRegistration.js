import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Navigate } from "react-router-dom";
import SiteNav from "./Nav";

export default function UserRegistration() {
  // State to hold user input values
  const [req, setReq] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [resp, setResp] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the formData to your backend API for user registration here
    console.log(req);
    axios
      .post(`http://localhost:4200/users/add`, {
        name: req.name,
        email: req.email,
        password: req.password,
      })
      .catch((error) => {
        return (
          <Container>
            <h3>{error}</h3>
            <Button
              onClick={() => {
                <Navigate to="/users/registration" />;
              }}
            ></Button>
          </Container>
        );
      })
      .then((response) => {
        setResp(response.data);
        localStorage.setItem("email", resp.email);
        setReq({
          name: "",
          email: "",
          password: "",
        });
        setSuccess(true);
      });
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReq({
      ...req,
      [name]: value,
    });
  };

  return success ? (
    <>
      <Navigate to="/users/all" />;
    </>
  ) : (
    <>
      <SiteNav />
      <h2>User Registration</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={req.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={req.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={req.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
}
