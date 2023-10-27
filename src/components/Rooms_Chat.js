import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import USERS_ALL from "./Users_All";
import CHAT from "./test";

export default function Rooms_Chat({ socket }) {
  const { _roomName } = useParams();
  const sender = localStorage.getItem("username");

  // const leaveRoom = async () => {
  //   await axios
  //     .put(`http://localhost:4200/rooms/${_roomName}/leave/${sender}`, {
  //       responseType: "json",
  //     })
  //     .then((response) => {
  //       if (response.status === 200 && response.data != null) {
  //         setUpdate(Date.now());
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     });
  // };

  // const joinRoom = async () => {
  //   await axios
  //     .put(`http://localhost:4200/rooms/${_roomName}/join/${sender}`, {
  //       responseType: "json",
  //     })
  //     .then((response) => {
  //       if (response.status === 200 && response.data != null) {
  //         setUpdate(Date.now());
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     });
  // };

  const style = {};

  return (
    <Card>
      {/* <Button
        variant="dark"
        onClick={() => {
          leaveRoom();
        }}
      >
        LEAVE
      </Button> */}
      <Row>
        <Col>
          <USERS_ALL socket={socket} />
        </Col>
        <Col>
          <CHAT socket={socket} />
        </Col>
      </Row>
    </Card>
  );
}
