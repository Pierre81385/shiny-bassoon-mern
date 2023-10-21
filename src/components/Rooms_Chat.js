import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";

export default function Rooms_Chat({ socket }) {
  const { _roomName } = useParams();
  const [error, setError] = useState([{}]);
  const [update, setUpdate] = useState(0);
  const [message, setMessage] = useState({
    content: "",
  });
  const [display, setDisplay] = useState([]);
  const [members, setMemebers] = useState([]);
  const thisUser = localStorage.getItem("_id");
  const sender = localStorage.getItem("username");
  const navigate = useNavigate();

  const messageSent = () => {
    socket.emit("Message_Sent", {
      message: `${sender} sent a message to the chat.`,
    });
  };

  const leaveRoom = async () => {
    await axios
      .put(`http://localhost:4200/rooms/${_roomName}/leave/${thisUser}`, {
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
      .put(`http://localhost:4200/rooms/${_roomName}/join/${thisUser}`, {
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

  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
    sender: {
      textAlign: "right",
    },
    message: {
      padding: "8px",
      margin: "8px",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
  };

  return (
    <>
      <Card style={style.message}>
        <Button
          variant="dark"
          style={style.button}
          onClick={() => {
            leaveRoom();
          }}
        >
          LEAVE
        </Button>
        {display.map(({ user, username, content }) => {
          return user === thisUser ? (
            <Card style={style.message}>
              <h4 style={style.sender}>
                {content} :{username}
              </h4>
            </Card>
          ) : (
            <Card style={style.message}>
              <h4>
                {username}: {content}
              </h4>
            </Card>
          );
        })}
      </Card>
      <h5>{members.length} Members</h5>
      {update === 0 ? <></> : <h5>Last update: {Date(update).toString()}</h5>}
      {members.includes(localStorage.getItem("_id")) ? (
        <Form onSubmit={handleSubmit} style={style.form}>
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
          >
            BACK
          </Button>
          <Button
            variant="dark"
            style={style.button}
            onClick={() => {
              joinRoom();
            }}
          >
            JOIN
          </Button>
        </>
      )}
    </>
  );
}
