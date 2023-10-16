import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Users_All from "./Users_All";
import Rooms_All from "./Rooms_All";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  const style = {
    mainContainer: {
      display: "flex",
    },
    headerRow: {
      padding: "8px",
    },
    logoutButton: {
      textAlign: "end",
    },
  };
  return (
    <>
      <Row style={style.header}>
        <Col>
          <h1>anonymous open live | chat rooms</h1>
          <h5>
            Find a bunch of fucking weirdos saying weird fucking things to one
            another. Welcome back to the 90's!
          </h5>
        </Col>
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
      <Row style={style.mainContainer}>
        <Col>
          <h2>Users</h2>
          <Users_All />
        </Col>
        <Col>
          <h2>Chatrooms</h2>
          <Rooms_All />
        </Col>
      </Row>
    </>
  );
}
