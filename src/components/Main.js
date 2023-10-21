import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import USERS_ALL from "./Users_All";
import ROOMS_ALL from "./Rooms_All";
import { useNavigate } from "react-router-dom";

export default function Main({ socket }) {
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
          <USERS_ALL />
        </Col>
        <Col>
          <h2>Chatrooms</h2>
          <ROOMS_ALL />
        </Col>
      </Row>
    </>
  );
}
