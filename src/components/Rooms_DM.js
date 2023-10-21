import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4200/");

export default function Rooms_DM({ socket }) {
  const { _id } = useParams();
  const thisUser = localStorage.getItem("_id");
  const navigate = useNavigate();
  const [error, setError] = useState([{}]);
  const [user1, setUser1] = useState({});
  const [user2, setUser2] = useState({});
  const [update, setUpdate] = useState(0);
  const dmRoomName = _id + thisUser;
  const dmRoomNameAlt = thisUser + _id;
  const [success, setSuccess] = useState({
    dmRoomNameFound: false,
    dmRoomNameAltFound: false,
    user1Found: false,
    user2Found: false,
    dmRoomCreated: false,
  });
  const [message, setMessage] = useState({
    content: "",
  });
  const [display, setDisplay] = useState([]);

  const dmSent = () => {
    socket.emit("DM_Sent", {
      message: `${user1.username} sent a direct message to ${user2.username}`,
    });
  };

  //check for existing DM room with their userID + your userID
  const checkDmRoomName = async () => {
    await axios
      .get(
        `http://localhost:4200/rooms/${dmRoomName}`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200 && response.data != null) {
          setDisplay(response.data.messages);
          setUpdate(response.data.updatedAt);
          setSuccess((prevState) => ({
            ...prevState,
            dmRoomNameFound: true,
            dmRoomCreated: true,
          }));
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          dmRoomNameFound: false,
        }));
        setError(error);
      });
  };

  //check for existing DM room with your userID + their userID
  const checkDmRoomNameAlt = async () => {
    await axios
      .get(
        `http://localhost:4200/rooms/${dmRoomNameAlt}`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setDisplay(response.data.messages);
          setUpdate(response.data.updatedAt);
          setSuccess((prevState) => ({
            ...prevState,
            dmRoomNameAltFound: true,
            dmRoomCreated: true,
          }));
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          dmRoomNameAltFound: false,
        }));
        setError(error);
      });
  };

  //get their user object by ID
  const getTheirUserObject = async () => {
    await axios
      .get(
        `http://localhost:4200/users/${_id}`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSuccess((prevState) => ({
            ...prevState,
            user1Found: true,
          }));
          setUser1(response.data);
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          user1Found: false,
        }));
        setError(error);
      });
  };

  //get your user object
  const getYourUserObject = async () => {
    await axios
      .get(
        `http://localhost:4200/users/${thisUser}`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSuccess((prevState) => ({
            ...prevState,
            user2Found: true,
          }));
          setUser2(response.data);
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          user2Found: false,
        }));
        setError(error);
      });
  };

  //create room
  const createRoom = async () => {
    await axios
      .post(
        `http://localhost:4200/rooms/add`,
        {
          name: success.dmRoomNameAltFound ? thisUser + _id : _id + thisUser,
          isPrivate: true,
          createdBy: thisUser,
          members: [_id, thisUser],
        },

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSuccess((prevState) => ({
            ...prevState,
            dmRoomCreated: true,
          }));
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          dmRoomCreated: false,
        }));
        setError(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        success.dmRoomNameAltFound
          ? `http://localhost:4200/rooms/${dmRoomNameAlt}/message/${thisUser}`
          : `http://localhost:4200/rooms/${dmRoomName}/message/${thisUser}`,
        {
          username: user2.username,
          content: message.content,
        }
      )
      .then((response) => {
        setMessage({
          content: "",
        });
        setUpdate(Date.now());
        dmSent();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage({
      content: value,
    });
  };

  socket.on("DM_Received", (data) => {
    setUpdate(true);
  });

  useEffect(() => {
    getTheirUserObject();
    getYourUserObject();
    checkDmRoomName();
    checkDmRoomNameAlt();
    console.log({
      FoundUser1: success.user1Found,
      FoundUser2: success.user2Found,
      RoomName1InUse: success.dmRoomNameFound,
      RoomName2InUse: success.dmRoomNameAltFound,
      RoomCreatedSuccessfully: success.dmRoomCreated,
    });
    console.log({
      errors: error.message,
    });
  }, [update]);

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
    <Container>
      <h1 style={{ textAlign: "center" }}>Direct Chat</h1>

      <h4 style={{ textAlign: "center" }}>Between you and {user1.username}</h4>

      {success.dmRoomCreated ? (
        <>
          <Card style={style.message}>
            {display.map(({ user, content, timestamp }) => {
              return user === thisUser ? (
                <Card style={style.message}>
                  <h4 style={style.sender}>
                    {content} :{user2.username}
                  </h4>
                </Card>
              ) : (
                <Card style={style.message}>
                  <h4>
                    {user1.username}: {content}
                  </h4>
                </Card>
              );
            })}
          </Card>
          {update === 0 ? (
            <></>
          ) : (
            <h5>Last update: {Date(update).toString()}</h5>
          )}

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
        </>
      ) : (
        <>
          <Button
            variant="dark"
            style={style.button}
            onClick={() => {
              createRoom();
            }}
          >
            START A DIRECT MESSAGE
          </Button>
        </>
      )}
    </Container>
  );
}
