import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import { useNavigate } from "react-router-dom";

export default function Users_All() {
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const style = {
    card: {
      padding: "8px",
      margin: "8px",
    },
  };

  const getUsers = async () => {
    await axios
      .get(
        `http://localhost:4200/users`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        setResp(response.data);
        if (response.status === 200 && response.data != null) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setResp(error);
      });
  };

  useEffect(() => {
    getUsers();
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
    <Card style={style.card}>
      {resp.map(({ _id, username, email }) => {
        return username === localStorage.getItem("username") ? (
          <Card style={style.card}>
            <Col>
              <h2>{username}</h2>
            </Col>
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
          </Card>
        ) : (
          <>
            <Col>
              <h2>{username}</h2>
            </Col>
            <Col>
              <Button
                variant="dark"
                onClick={() => {
                  navigate(`/users/dm/${_id}`);
                }}
              >
                DM
              </Button>
            </Col>
          </>
        );
      })}
    </Card>
  );
}
