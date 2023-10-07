import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import SiteNav from "./Nav";

export default function AllUsers() {
  const [resp, setResp] = useState([{}]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4200/users`)
      .then((response) => {
        setResp(response.data);
        if (response.data) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        return (
          <Container>
            <h3>{error}</h3>
            <Button
              onClick={() => {
                <Navigate to="/users/registration" />;
              }}
            ></Button>
          </Container>
        );
      });
  }, []);

  return !success ? (
    <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  ) : (
    <>
      {resp.map(({ name, email }) => {
        return (
          <Container>
            <h2>{name}</h2>
            <h3>{email}</h3>
          </Container>
        );
      })}
    </>
  );
}
