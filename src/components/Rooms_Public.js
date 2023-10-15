import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";

export default function Rooms_Public() {
  const [room, setRoom] = useState({
    name: "",
    isPrivate: false,
    members: [localStorage.getItem("_id")],
  });
  const [resp, setResp] = useState([{}]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState({
    roomCreated: false,
    foundRooms: false,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const navigate = useNavigate();

  const style = {
    form: {
      width: "50vw",
    },
    button: {
      width: "10vw",
      margin: "10px",
    },
  };

  const createRoom = async () => {
    await axios
      .post(
        `http://localhost:4200/rooms/add`,
        {
          name: room.name,
          isPrivate: isEnabled,
          members: room.members,
        },

        {
          responseType: "json",
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          setSuccess((prevState) => ({
            ...prevState,
            roomCreated: true,
          }));
        }
      })
      .catch((error) => {
        setSuccess((prevState) => ({
          ...prevState,
          roomCreated: false,
        }));
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
          setSuccess((prevState) => ({
            ...prevState,
            foundRooms: true,
          }));
        }
      })
      .catch((error) => {
        setSuccess(false);
        setResp(error);
      });
  };

  useEffect(() => {
    getRooms();
  }, [success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom();
    setRoom({
      name: "",
      isPrivate: false,
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

  return (
    <>
      <Form onSubmit={handleSubmit} style={style.form}>
        <Form.Group controlId="name">
          <Form.Label>Room Name</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            name="name"
            value={room.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="isPrivate">
          <Form.Label>Make Private</Form.Label>
          <Form.Switch
            type="switch"
            label="Make Private"
            id="isPrivate"
            name="isPrivate"
            value={isEnabled}
            onChange={toggleSwitch}
          />
        </Form.Group>
        <Button
          variant="dark"
          style={style.button}
          onClick={() => {
            navigate("/users/all");
          }}
        >
          BACK
        </Button>
        <Button variant="dark" type="submit" style={style.button}>
          Create
        </Button>
      </Form>
      {resp.map(({ name, isPrivate, members }) => {
        return (
          <Container>
            <h2>{name}</h2>
            <h3>Members: {members.length}</h3>
            {isPrivate ? <h5>PRIVATE</h5> : <></>}
          </Container>
        );
      })}
    </>
  );
}
