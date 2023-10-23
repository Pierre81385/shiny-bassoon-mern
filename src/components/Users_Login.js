import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

export default function UserLogin({ socket }) {
  const [req, setReq] = useState({
    username: "",
    password: "",
  });
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const loginUser = async () => {
    await axios
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
        if (
          response.status === 200 &&
          response.data.message === "Login Success!"
        ) {
          setResp(response);
          localStorage.setItem("_id", response.data.user._id);
          localStorage.setItem("username", req.username);
          localStorage.setItem("jwt", response.data.jwt);
          //user login successful -> send socket.io user ID
          socket.emit("Login", { username: req.username });
          navigate("/main");
        }
      })
      .catch((error) => {
        setError({
          status: error.status,
          message: error.message,
        });
        setSuccess(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReq({
      ...req,
      [name]: value,
    });
  };

  const style = {
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      justifyContent: "center",
    },
    headline: {},
    errorStatus: {},
    errorMessage: {},
    form: {
      width: "50vw",
      margin: "auto",
    },
    formLabel: {},
    formControl: {},
    button: {
      width: "10vw",
      margin: "10px",
    },
    rowButtons: {
      justifyContent: "center",
    },
  };

  return !success ? (
    <Container style={style.container}>
      <h1 style={style.errorStatus}>ERROR {error.status}</h1>
      <h4 style={style.errorMessage}>{error.message}</h4>
      <Button
        style={style.button}
        variant="dark"
        onClick={() => {
          setSuccess(true);
        }}
      >
        BACK
      </Button>
    </Container>
  ) : (
    <Container style={style.container}>
      <Form onSubmit={handleSubmit} style={style.form}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          fill="currentColor"
          class="bi bi-door-closed-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
        <h1>LOGIN</h1>
        <Form.Group controlId="name">
          <Form.Label style={style.formLabel}>Username</Form.Label>
          <Form.Control
            style={style.formControl}
            type="text"
            placeholder="Username"
            name="username"
            value={req.username}
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
            BACK
          </Button>
          <Button style={style.button} variant="dark" type="submit">
            LOGIN
          </Button>
        </Row>
      </Form>
    </Container>
  );
}
