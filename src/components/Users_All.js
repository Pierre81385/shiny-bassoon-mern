import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card";
import { useNavigate } from "react-router-dom";

export default function Users_All({ socket }) {
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(false);
  const [online, setOnline] = useState([]);
  const navigate = useNavigate();

  const style = {
    card: {
      padding: "8px",
      margin: "8px",
    },
  };

  socket.on("Notify_Login", (users) => {
    console.log(users);
    setOnline(users);
  });

  socket.on("Notify_Logout", (users) => {
    console.log(users);
    setOnline(users);
  });

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
  }, [online]);

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
      {resp.map(({ _id, username }) => {
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
              {online.includes(username) ? (
                <Row>
                  <Col style={{ textAlign: "end" }}>
                    <h2>{username}</h2>
                  </Col>
                  <Col
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="green"
                      class="bi bi-broadcast"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                    </svg>
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
                </Row>
              ) : (
                <h2>{username}</h2>
              )}
            </Col>
          </>
        );
      })}
    </Card>
  );
}
