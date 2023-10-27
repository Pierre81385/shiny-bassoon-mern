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
import CHAT from "./Rooms_Chat";

export default function Rooms_Chat({ socket }) {
  const { _roomName } = useParams();
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const sender = localStorage.getItem("username");

  const leaveRoom = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/leave/${sender}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          navigate("/main");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const joinRoom = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/join/${sender}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setUpdate(true);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const style = {
    button: {
      margin: "8px",
    },
    col: {
      padding: "8px",
      margin: "8px",
    },
  };

  return (
    <Card>
      <Button
        variant="dark"
        onClick={() => {
          leaveRoom();
        }}
        style={style.button}
      >
        LEAVE
      </Button>
      <Row>
        <Col style={style.col}>
          <USERS_ALL socket={socket} />
        </Col>
        <Col style={style.col}>
          <CHAT socket={socket} />
        </Col>
      </Row>
    </Card>
  );
}
