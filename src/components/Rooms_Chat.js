import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";

export default function Chat({ socket }) {
  const [chat, setChat] = useState([]);
  const [members, setMemebers] = useState([]);
  const [update, setUpdate] = useState(0);
  const [error, setError] = useState([{}]);
  const [message, setMessage] = useState("");
  const { _roomName } = useParams();
  const thisUser = localStorage.getItem("_id");
  const sender = localStorage.getItem("username");
  const navigate = useNavigate();

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
          setChat(response.data.messages);
          setMemebers(response.data.members);
          setUpdate(response.data.updatedAt);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const sendMessage = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/message/${thisUser}`, {
        username: sender,
        content: message,
      })
      .then((response) => {
        setMessage("");
        setUpdate(Date.now());
        messageSent();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const messageSent = () => {
    socket.emit("Message_Sent", {
      message: `${sender} sent a message to the chat.`,
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

  useEffect(() => {
    getRoomMessages();
  }, [update]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const style = {
    listGroupItem: {
      display: "flex",
      borderStyle: "none",
    },
    listGroupItemSender: {
      display: "flex",
      textAlign: "end",
      borderStyle: "none",
    },
    listGroupHeading: {
      width: "100%",
    },
    chatCard: {
      height: "70%",
      overflow: "auto",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  return (
    <>
      <Card style={style.chatCard}>
        <ListGroup>
          {chat.map(({ user, username, content, _id, index }) => {
            return user === thisUser ? (
              <ListGroupItem key={_id} style={style.listGroupItemSender}>
                <div style={style.listGroupHeading}>
                  <div className="fw-bold">YOU</div>
                  {content}
                </div>
              </ListGroupItem>
            ) : (
              <ListGroupItem key={_id} style={style.listGroupItem}>
                <div style={style.listGroupHeading}>
                  <div className="fw-bold">{username}</div>
                  {content}
                </div>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Card>
      {update === 0 ? <></> : <h5>Last update: {Date(update).toString()}</h5>}

      {members.includes(localStorage.getItem("username")) ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              type="text"
              placeholder="Message..."
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
            style={style.button}
          >
            BACK
          </Button>
          <Button variant="dark" type="submit" style={style.button}>
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
            style={style.button}
          >
            BACK
          </Button>
          <Button
            variant="dark"
            onClick={() => {
              joinRoom();
            }}
            style={style.button}
          >
            JOIN
          </Button>
        </>
      )}
    </>
  );
}
