import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          localStorage.setItem("_id", response.data._id);
          localStorage.setItem("username", req.username);
          localStorage.setItem("jwt", response.data.jwt);
          setSuccess(true);
          navigate("/main");
        }
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
    headline: {},
    errorStatus: {},
    errorMessage: {},
    form: {
      width: "50vw",
    },
    formLabel: {},
    formControl: {},
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
      <h2 style={style.headline}>User Login</h2>

      <Form onSubmit={handleSubmit} style={style.form}>
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
            HOME
          </Button>
          <Button style={style.button} variant="dark" type="submit">
            LOGIN
          </Button>
        </Row>
      </Form>
    </>
  );
}
