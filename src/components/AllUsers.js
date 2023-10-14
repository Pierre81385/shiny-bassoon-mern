import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:4200/users`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        setResp(response.data);
        if (response.status === 200) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setResp(error);
      });
  }, []);

  return !success ? (
    <>
      <Container>
        <h3>{resp.message}</h3>
        <Button
          onClick={() => {
            navigate("/users/login");
          }}
        >
          back to Login
        </Button>
      </Container>
    </>
  ) : (
    <>
      <Row>
        <Col>
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/home");
            }}
          >
            LOGOUT
          </Button>
        </Col>
        <Col>
          <Button>NEW CHAT ROOM</Button>
        </Col>
      </Row>
      {resp.map(({ _id, username, email }) => {
        return (
          <Container>
            <Row>
              <Col>
                <h2>{username}</h2>
              </Col>
              {username === localStorage.getItem("username") ? (
                <Col>
                  <Button
                    variant="dark"
                    onClick={() => {
                      navigate("/users/edit");
                    }}
                  >
                    Edit
                  </Button>
                </Col>
              ) : (
                <Col>
                  <Button
                    variant="dark"
                    onClick={() => {
                      navigate(`/users/dm/${_id}`);
                    }}
                  >
                    Chat
                  </Button>
                </Col>
              )}
            </Row>
          </Container>
        );
      })}
    </>
  );
}
