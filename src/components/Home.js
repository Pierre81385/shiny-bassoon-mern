import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const style = {
    container: {
      textAlign: "center",
    },
    row: {},
    colL: {
      textAlign: "right",
    },
    colR: {
      textAlign: "left",
    },
    button: {},
  };

  return (
    <Container style={style.container}>
      <Row>
        <h1>Create a new account or sign in.</h1>
      </Row>
      <Row>
        <Col style={style.colL}>
          <Button
            variant="dark"
            onClick={() => {
              navigate("/users/registration");
            }}
          >
            NEW USER
          </Button>
        </Col>
        <Col style={style.colR}>
          <Button
            variant="dark"
            onClick={() => {
              navigate("/users/login");
            }}
          >
            LOGIN
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
