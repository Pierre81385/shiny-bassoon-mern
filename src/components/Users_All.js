import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

export default function USERS_ALL({
  socket,
  roomName,
  roomPermissions,
  members,
}) {
  const [users, setUsers] = useState([{}]);
  const [online, setOnline] = useState([]);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  socket.on("DM_Received", (data) => {
    console.log("socket.on DM_Received @Users_All");
    if (localStorage.getItem(data.from) === null) {
      localStorage.setItem(data.from, 1);
    } else {
      let num = localStorage.getItem(data.from);
      num++;
      localStorage.setItem(data.from, num);
    }
  });

  socket.on("Notify_Login", (data) => {
    console.log("socket.on Notify_Login @Users_All");
    setOnline(data);
  });

  socket.on("Notify_Logout", (data) => {
    console.log("socket.on Notify_Logout @Users_All");
    setOnline(data);
  });

  const notify_join = (user) => {
    console.log("socket.emit Join @Users_All");
    socket.emit("Join", { username: user });
  };

  const getUsers = async () => {
    await axios
      .get(
        `http://localhost:4200/users`,
        { headers: { Authorization: localStorage.getItem("jwt") } },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const joinRoom = async (user) => {
    await axios
      .put(`http://localhost:4200/rooms/${roomName}/join/${user}`, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200 && response.data != null) {
          notify_join(user);
          setUpdate(true);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    getUsers();
  }, [roomName, roomPermissions, members, online, update]);

  const style = {
    button: {
      margin: "8px",
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
      <ListGroup>
        {users.map(({ _id, username }) => {
          return username === localStorage.getItem("username") ? (
            <></>
          ) : (
            <ListGroupItem
              key={_id}
              className="d-flex justify-content-between align-items-start"
              onClick={() => {
                localStorage.setItem(username, 0);
                navigate(`/users/dm/${_id}`);
              }}
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{username}</div>
                {online.includes(username) ? "Online" : "Offline"}
              </div>
              {roomPermissions === true && !members.includes(username) ? (
                <Button
                  variant="dark"
                  onClick={() => {
                    joinRoom(username);
                  }}
                  style={style.button}
                >
                  Add User
                </Button>
              ) : (
                <Badge pill bg="dark">
                  {localStorage.getItem(username) === null
                    ? 0
                    : localStorage.getItem(username)}
                </Badge>
              )}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </>
  );
}
