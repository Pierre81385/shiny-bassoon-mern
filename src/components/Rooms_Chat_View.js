import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import USERS_ALL from "./Users_All";
import CHAT from "./Rooms_Chat";
import Container from "react-bootstrap/esm/Container";

export default function Rooms_Chat({ socket }) {
  const { _roomName } = useParams();
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(false);
  const [roomPermissions, setRoomPermissions] = useState(false);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const sender = localStorage.getItem("username");

  const notify_leave = (user) => {
    console.log("socket.emit Leave @Room_Chat_View");
    socket.emit("Leave", { username: user });
  };

  const getRoomPermissions = async () => {
    await axios
      .get(
        `http://localhost:4200/rooms/${_roomName}`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setRoomPermissions(response.data.isPrivate);
          setMembers(response.data.members);
          setUpdate(true);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const leaveRoom = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/leave/${sender}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          notify_leave(sender);
          navigate("/main");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const style = {
    roomName: {
      textAlign: "center",
    },
    card: {
      height: "90vh",
    },
    button: {
      margin: "8px",
    },
    col: {
      padding: "8px",
      margin: "8px",
    },
  };

  useEffect(() => {
    getRoomPermissions();
  }, [update]);

  return error !== null ? (
    <Container style={style.container}>
      <h1 style={style.errorStatus}>ERROR {error.status}</h1>
      <h4 style={style.errorMessage}>{error.message}</h4>
      <Button
        style={style.button}
        variant="dark"
        onClick={() => {
          navigate("/home");
        }}
      >
        HOME
      </Button>
    </Container>
  ) : (
    <Card style={style.card}>
      <h1 style={style.roomName}>{_roomName}</h1>
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
        <Col style={style.col} lg={3}>
          <USERS_ALL
            socket={socket}
            roomName={_roomName}
            roomPermissions={roomPermissions}
            members={members}
          />
        </Col>
        <Col style={style.col} lg={8}>
          <CHAT socket={socket} />
        </Col>
      </Row>
    </Card>
  );
}
