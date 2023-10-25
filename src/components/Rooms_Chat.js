import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";

export default function Rooms_Chat({ socket }) {
  const { _roomName } = useParams();
  const [error, setError] = useState([{}]);
  const [update, setUpdate] = useState(0);
  const [message, setMessage] = useState({
    content: "",
  });
  const [display, setDisplay] = useState([]);
  const [members, setMemebers] = useState([]);
  const [online, setOnline] = useState([]);
  const thisUser = localStorage.getItem("_id");
  const sender = localStorage.getItem("username");
  const navigate = useNavigate();

  socket.on("Notify_Login", (users) => {
    console.log(users);
    setOnline(users);
  });

  socket.on("Notify_Logout", (users) => {
    console.log(users);
    setOnline(users);
  });

  const messageSent = () => {
    socket.emit("Message_Sent", {
      message: `${sender} sent a message to the chat.`,
    });
  };

  const leaveRoom = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/leave/${sender}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setUpdate(Date.now());
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
          setUpdate(Date.now());
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const getRoomMessages = async () => {
    await axios
      .get(
        `http://localhost:4200/rooms/${_roomName}`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200 && response.data != null) {
          setDisplay(response.data.messages);
          setMemebers(response.data.members);
          console.log(response.data.members);
          setUpdate(response.data.updatedAt);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:4200/rooms/${_roomName}/message/${thisUser}`, {
        username: sender,
        content: message.content,
      })
      .then((response) => {
        setMessage({
          content: "",
        });
        setUpdate(Date.now());
        messageSent();
      })
      .catch((error) => {
        setError(error);
      });
  };

  socket.on("Message_Received", (data) => {
    setUpdate(true);
  });

  useEffect(() => {
    getRoomMessages();
  }, [update]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage({
      content: value,
    });
  };

  const style = {};

  return (
    <Card>
      <Button
        variant="dark"
        onClick={() => {
          leaveRoom();
        }}
      >
        LEAVE
      </Button>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>{members.length} Members</h5>
            </Card.Header>
            {members.map((index) => {
              return index === localStorage.getItem("username") ? (
                <Card>
                  <h2>{index}</h2>
                  <Card.Footer>
                    <Button
                      variant="dark"
                      onClick={() => {
                        navigate("/users/edit");
                      }}
                    >
                      Edit
                    </Button>
                  </Card.Footer>
                </Card>
              ) : (
                <Card>
                  <h2>{index}</h2>
                </Card>
              );
            })}
          </Card>
        </Col>
        <Col>
          <Container>
            <Card>
              {display.map(({ user, username, content }) => {
                return user === thisUser ? (
                  <Card>
                    <h4>{content}</h4>
                    <Card.Footer>{username}</Card.Footer>
                  </Card>
                ) : (
                  <Card>
                    <h4>{content}</h4>
                    <Card.Footer>{username}</Card.Footer>
                  </Card>
                );
              })}
            </Card>
          </Container>
        </Col>
      </Row>
      <Container>
        {update === 0 ? <></> : <h5>Last update: {Date(update).toString()}</h5>}
        {members.includes(localStorage.getItem("username")) ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="content"
                value={message.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button
              variant="dark"
              onClick={() => {
                navigate("/main");
              }}
            >
              BACK
            </Button>
            <Button variant="dark" type="submit">
              SEND
            </Button>
          </Form>
        ) : (
          <>
            <Button
              variant="dark"
              onClick={() => {
                navigate("/main");
              }}
            >
              BACK
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                joinRoom();
              }}
            >
              JOIN
            </Button>
          </>
        )}
      </Container>
    </Card>
  );
}
