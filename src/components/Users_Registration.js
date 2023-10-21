import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";

export default function UserRegistration({ socket }) {
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
        setResp(response);
        setSuccess(true);
        navigate("/users/login");
      })
      .catch((error) => {
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
    errorStatus: {},
    errorMessage: {},
    form: {
      width: "50vw",
    },
    formLabel: {},
    formControl: {},
    rowButtons: {},
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  return !success ? (
    <>
      <h1 style={style.errorStatus}>ERROR {error.status}</h1>
      <h4 style={style.errorMessage}>{error.message}</h4>
      <p>{resp}</p>
      <Button
        style={style.button}
        variant="dark"
        onClick={() => {
          setSuccess(true);
        }}
      >
        BACK
      </Button>
    </>
  ) : (
    <>
      <h2>User Registration</h2>

      <Form style={style.form} onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label style={style.formLabel}>Username</Form.Label>
          <Form.Control
            style={style.formControl}
            type="text"
            placeholder="Enter a username."
            name="username"
            value={req.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label style={style.formLabel}>Email</Form.Label>
          <Form.Control
            style={style.formControl}
            type="email"
            placeholder="Enter your email"
            name="email"
            value={req.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label style={style.formLabel}>Password</Form.Label>
          <Form.Control
            style={style.formControl}
            type="password"
            placeholder="Enter your password"
            name="password"
            value={req.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Row style={style.rowButtons}>
          <Button
            style={style.button}
            variant="dark"
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </Button>

          <Button style={style.button} variant="dark" type="submit">
            REGISTER
          </Button>
        </Row>
      </Form>
    </>
  );
}
