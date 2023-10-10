import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
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
      <Container>
        <Button
          onClick={() => {
            navigate("/logout");
          }}
        >
          LOGOUT
        </Button>
      </Container>
      {resp.map(({ _id, name, email }) => {
        return (
          <Container>
            <h1>{_id}</h1>
            <h2>{name}</h2>
            <h3>{email}</h3>
          </Container>
        );
      })}
    </>
  );
}
