import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";

export default function Rooms_All() {
  const [room, setRoom] = useState({
    name: "",
    isPrivate: false,
    createdBy: localStorage.getItem("_id"),
    members: [localStorage.getItem("_id")],
  });
  const [resp, setResp] = useState([
    { name: "", isPrivate: false, members: [""] },
  ]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState({
    roomCreated: false,
    foundRooms: false,
    roomDeleted: false,
  });
  const [isEnabled, setIsEnabled] = useState(false);

  const navigate = useNavigate();

  const createRoom = async () => {
    await axios
      .post(
        `http://localhost:4200/rooms/add`,
        {
          name: room.name,
          isPrivate: isEnabled,
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
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          roomCreated: false,
        });
        setError(error);
        console.log(error);
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
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          foundRooms: false,
        });
        setResp(error);
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
        }
      })
      .catch((error) => {
        setSuccess({
          ...success,
          roomDeleted: false,
        });
        setError(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom();
    setRoom({
      name: "",
      isPrivate: false,
      createdBy: localStorage.getItem("_id"),
      members: [localStorage.getItem("_id")],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: value,
    });
    console.log(room.isPrivate);
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    getRooms();
  }, [success.roomCreated, success.roomDeleted]);

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

  return !success.foundRooms ? (
    <>
      <Container>
        <h3>{resp.message}</h3>
        <Button
          onClick={() => {
            navigate("/users/login");
          }}
        >
          back to Login
        </Button>
      </Container>
    </>
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
      {resp.map(({ _id, name, isPrivate, members, updatedAt, createdBy }) => {
        return (
          <Card style={style.card}>
            {!isPrivate ? (
              <Container>
                <h2>{name}</h2>
                <h4>Members: {members.length}</h4>
                <h4>Last active {updatedAt}</h4>
                <Button
                  variant="dark"
                  style={style.button}
                  onClick={() => {
                    navigate(`/rooms/${name}`);
                  }}
                >
                  Enter
                </Button>
                {createdBy === localStorage.getItem("_id") ? (
                  <Button
                    variant="dark"
                    style={style.button}
                    onClick={() => {
                      deleteRoom(name);
                    }}
                  >
                    DELETE
                  </Button>
                ) : (
                  <></>
                )}
              </Container>
            ) : isPrivate && members.includes(localStorage.getItem("_id")) ? (
              <Container>
                <h2>{name}</h2>
                <h4>Members: {members.length}</h4>
                <h4>Last active {updatedAt}</h4>
                <Button
                  variant="dark"
                  style={style.button}
                  onClick={() => {
                    navigate(`/rooms/${name}`);
                  }}
                >
                  Enter
                </Button>
                {createdBy === localStorage.getItem("_id") ? (
                  <Button
                    variant="dark"
                    style={style.button}
                    onClick={() => {
                      deleteRoom(name);
                    }}
                  >
                    DELETE
                  </Button>
                ) : (
                  <></>
                )}
              </Container>
            ) : (
              <></>
            )}
          </Card>
        );
      })}
    </>
  );
}
