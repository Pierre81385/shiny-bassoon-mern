import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
          <Button
            onClick={() => {
              navigate("/users/registration");
            }}
          >
            NEW USER
          </Button>
        </Col>
        <Col>
          <Button
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
