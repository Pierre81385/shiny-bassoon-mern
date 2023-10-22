import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import USERS_ALL from "./Users_All";
import ROOMS_ALL from "./Rooms_All";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

export default function Main({ socket }) {
  const navigate = useNavigate();
  const style = {
    mainContainer: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    container: {
      display: "flex",
      flexDirection: "row",
    },
    header: {
      padding: "8px",
      textAlign: "center",
    },
    logoutButton: {
      textAlign: "center",
    },
  };
  return (
    <Container style={style.mainContainer}>
      <Row style={style.header}>
        <Col>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="160"
            fill="currentColor"
            class="bi bi-door-open-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
          </svg>
          <h1>anonymous open live | chat rooms</h1>
        </Col>
      </Row>
      <Row>
        <Col style={style.logoutButton}>
          <Button
            variant="dark"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            LOGOUT
          </Button>
        </Col>
      </Row>
      <Row style={style.container}>
        <Col>
          <h2 style={style.header}>Users</h2>
          <USERS_ALL socket={socket} />
        </Col>
        <Col>
          <h2 style={style.header}>Chatrooms</h2>
          <ROOMS_ALL socket={socket} />
        </Col>
      </Row>
    </Container>
  );
}
