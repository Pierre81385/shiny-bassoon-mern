import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import { useParams } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/esm/Row";
import ChatComponent from "../models/chat";

export default function Rooms_DM() {
  const { _id } = useParams();
  const thisUser = localStorage.getItem("_id");
  const [resp, setResp] = useState([
    {
      _id: "",
      name: "",
      members: [],
      messages: [
        {
          user: "",
          content: "",
          _id: "",
        },
      ],
    },
  ]);
  const [user1, setUser1] = useState({});
  const [user2, setUser2] = useState({});
  const [success, setSuccess] = useState(false);
  const [update, setUpdate] = useState(false);
  const dmRoomName = _id + thisUser;

  const [message, setMessage] = useState({
    content: "",
  });

  const [display, setDisplay] = useState([]);

  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:4200/rooms/${dmRoomName}`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        setResp(response.data);
        setDisplay(response.data.messages);
        if (response.status === 200) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setResp(error);
      });

    axios
      .get(
        `http://localhost:4200/users/${_id}`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        setUser1(response.data);
        if (response.status === 200) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setUser1(error);
      });

    axios
      .get(
        `http://localhost:4200/users/${thisUser}`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        setUser2(response.data);
        if (response.status === 200) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setUser2(error);
      });

    //create room with id _id+thisUser
    axios
      .post(
        `http://localhost:4200/rooms/add`,
        {
          name: _id + thisUser,
          members: [_id, thisUser],
        },

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
          console.log("DM chat room created");
        }
      })
      .catch((error) => {
        setSuccess(false);
        console.log(error);
      });

    setUpdate(false);
  }, [update]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:4200/rooms/${dmRoomName}/message/${thisUser}`, {
        content: message.content,
      })
      .catch((error) => {
        return (
          <Container>
            <h3>{error}</h3>
          </Container>
        );
      })
      .then((response) => {
        console.log(response);
        setMessage({
          content: "",
        });
        setSuccess(true);
        setUpdate(true);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessage({
      ...message,
      [name]: value,
    });
  };

  return (
    <Container>
      <h1>Direct Chat</h1>
      {/* <h2>{_id} &</h2>
      <h4>{user1.username}</h4>
      <h2>{thisUser}</h2>
      <h4>{user2.username}</h4> */}
      {display.map(({ user, content }) => {
        return user === thisUser ? (
          <Container>
            <h4>
              {user2.username}: {content}
            </h4>
          </Container>
        ) : (
          <Container>
            <h4>
              {user1.username}: {content}
            </h4>
          </Container>
        );
      })}
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
        <Button variant="dark" type="submit" style={style.button}>
          SEND
        </Button>
      </Form>
    </Container>
  );
}
