import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";

export default function UserRegistration() {
  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  // State to hold user input values
  const [req, setReq] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [resp, setResp] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the formData to your backend API for user registration here
    console.log(req);
    axios
      .post(`http://localhost:4200/users/registration`, {
        username: req.username,
        email: req.email,
        password: req.password,
      })
      .catch((error) => {
        return (
          <Container>
            <h3>{error}</h3>
            <Button
              onClick={() => {
                navigate("/home");
              }}
            >
              HOME
            </Button>
          </Container>
        );
      })
      .then((response) => {
        console.log(response);
        setResp(response.data);
        setReq({
          username: "",
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
      <Navigate to="/users/login" />;
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
              navigate("/home");
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
