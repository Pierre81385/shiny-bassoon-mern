import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

export default function ROOMS_ALL({ socket }) {
  const [room, setRoom] = useState({
    name: "",
    isPrivate: false,
    isDM: false,
    createdBy: localStorage.getItem("_id"),
    members: [localStorage.getItem("username")],
  });
  const [resp, setResp] = useState([
    { name: "", isPrivate: false, isDM: false, members: [""] },
  ]);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState({
    roomCreated: false,
    foundRooms: false,
    roomDeleted: false,
  });
  const [isEnabled, setIsEnabled] = useState(false);

  const navigate = useNavigate();

  socket.on("Update Members", (data) => {
    console.log(`${data.username} joined this room`);
    getRooms();
  });

  const createRoom = async () => {
    await axios
      .post(
        `http://localhost:4200/rooms/add`,
        {
          name: room.name,
          isPrivate: isEnabled,
          isDM: false,
          createdBy: room.createdBy,
          members: room.members,
        },

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setSuccess({
            ...success,
            roomCreated: true,
          });
          setUpdate(true);
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          roomCreated: false,
        });
        setError(error);
        setUpdate(true);
      });
  };

  const getRooms = async () => {
    await axios
      .get(
        `http://localhost:4200/rooms/`,

        {
          responseType: "json",
        }
      )
      .then((response) => {
        setResp(response.data);
        if (response.status === 200 && response.data != null) {
          setSuccess({
            ...success,
            foundRooms: true,
          });
          setUpdate(true);
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          foundRooms: false,
        });
        setResp(error);
        setUpdate(true);
      });
  };

  const deleteRoom = async (name) => {
    await axios
      .delete(`http://localhost:4200/rooms/${name}}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setSuccess({
            ...success,
            roomDeleted: true,
          });
          setUpdate(true);
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          roomDeleted: false,
        });
        setError(error);
        setUpdate(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom();
    setRoom({
      name: "",
      isPrivate: false,
      isDM: false,
      createdBy: localStorage.getItem("_id"),
      members: [localStorage.getItem("username")],
    });
    setUpdate(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: value,
    });
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    getRooms();
  }, [update]);

  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
    card: {
      margin: "8px",
      padding: "8px",
    },
  };

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
    <>
      <Form onSubmit={handleSubmit} style={style.form}>
        <Form.Group controlId="name">
          <Form.Control
            type="text"
            placeholder="Room Name..."
            name="name"
            value={room.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="isPrivate">
          <Form.Switch
            type="switch"
            label="Make Private"
            id="isPrivate"
            name="isPrivate"
            value={isEnabled}
            onChange={toggleSwitch}
          />
        </Form.Group>

        <Button variant="dark" type="submit" style={style.button}>
          Create
        </Button>
      </Form>
      <ListGroup>
        {resp.map(
          ({ _id, name, isPrivate, isDM, members, updatedAt, createdBy }) => {
            return isDM ? (
              <></>
            ) : (
              <ListGroupItem
                key={_id}
                className="d-flex justify-content-between align-items-start"
                onClick={() => {
                  if (
                    isPrivate &&
                    members.includes(localStorage.getItem("username"))
                  ) {
                    navigate(`/rooms/${name}`);
                  } else if (
                    isPrivate &&
                    !members.includes(localStorage.getItem("username"))
                  ) {
                    alert(
                      "This is a private room.  Reach out to the room admin to join!"
                    );
                  } else {
                    navigate(`/rooms/${name}`);
                  }
                }}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {name}{" "}
                    {isPrivate ? (
                      <>
                        -{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-file-lock2-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7 6a1 1 0 0 1 2 0v1H7V6z" />
                          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-2 6v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V8.3c0-.627.46-1.058 1-1.224V6a2 2 0 1 1 4 0z" />
                        </svg>
                      </>
                    ) : (
                      <></>
                    )}
                    - admin: {members[0]}
                  </div>
                  {members.includes(localStorage.getItem("username"))
                    ? `${members.length} members, including you.`
                    : `${members.length} members`}
                </div>
              </ListGroupItem>
            );
          }
        )}
      </ListGroup>
    </>
  );
}
