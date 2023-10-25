import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Badge from "react-bootstrap/esm/Badge";

export default function AllUsers({ socket }) {
  const [users, setUsers] = useState([{}]);
  const [online, setOnline] = useState([]);
  const navigate = useNavigate();

  socket.on("Notify_Login", (active) => {
    setOnline(active);
  });

  socket.on("Notify_Logout", (active) => {
    setOnline(active);
  });

  socket.on("DM_Received", (data) => {
    if (localStorage.getItem(data.from) === null) {
      localStorage.setItem(data.from, 1);
    } else {
      let num = localStorage.getItem(data.from);
      num++;
      localStorage.setItem(data.from, num);
    }
  });

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
        if (error != null) {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
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
              <Badge pill bg="dark">
                {localStorage.getItem(username) === null
                  ? 0
                  : localStorage.getItem(username)}
              </Badge>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </>
  );
}
