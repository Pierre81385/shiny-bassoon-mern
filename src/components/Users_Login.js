import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

export default function UserLogin() {
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
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the formData to your backend API for user registration here
    console.log(req);
    axios
      .post(
        `http://localhost:4200/users/login`,
        {
          username: req.username,
          password: req.password,
        },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        localStorage.setItem("username", req.username);
        setReq({
          username: "",
          password: "",
        });
        if (response.status === 200) {
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("_id", response.data._id);
          setSuccess(true);
        } else {
          localStorage.setItem("user", null);
          console.log(response.status + " " + response.statusText);
        }
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
      <Navigate to="/main" />;
    </>
  ) : (
    <>
      <h2>User Login</h2>

      <Form onSubmit={handleSubmit} style={style.form}>
        <Form.Group controlId="name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={req.username}
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
            LOGIN
          </Button>
        </Row>
      </Form>
    </>
  );
}
