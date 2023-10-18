import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";

export default function UserRegistration() {
  const [req, setReq] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState({
    status: 0,
    message: "",
  });
  const navigate = useNavigate();

  const registerUser = async () => {
    await axios
      .post(`http://localhost:4200/users/registration`, {
        username: req.username,
        email: req.email,
        password: req.password,
      })
      .then((response) => {
        setReq({
          username: "",
          email: "",
          password: "",
        });
        setResp(response.data);
        setSuccess(true);
        navigate("/users/login");
      })
      .catch((error) => {
        console.log("caught!!!");
        setError({
          status: error.response.status,
          message: error.response.data.message,
        });
        setSuccess(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReq({
      ...req,
      [name]: value,
    });
  };

  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  return !success ? (
    <>
      <h1>ERROR {error.status}</h1>
      <h4>{error.message}</h4>
      <Button
        variant="dark"
        onClick={() => {
          setSuccess(true);
        }}
        style={style.button}
      >
        BACK
      </Button>
    </>
  ) : (
    <>
      <h2>User Registration</h2>

      <Form onSubmit={handleSubmit} style={style.form}>
        <Form.Group controlId="name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a username."
            name="username"
            value={req.username}
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
        <Row>
          <Button
            variant="dark"
            onClick={() => {
              navigate("/");
            }}
            style={style.button}
          >
            HOME
          </Button>

          <Button variant="dark" type="submit" style={style.button}>
            REGISTER
          </Button>
        </Row>
      </Form>
    </>
  );
}
