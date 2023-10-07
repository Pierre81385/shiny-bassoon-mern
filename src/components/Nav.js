import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";

export default function SiteNav() {
  const [key, setKey] = useState("/home");

  return (
    <div>
      <Nav activeKey={key}>
        <Nav.Item>
          <Nav.Link
            href="/home"
            eventKey="/home"
            onClick={() => {
              setKey("/home");
            }}
          >
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="/users/registration"
            eventKey="/users/registration"
            onClick={() => {
              setKey("/users/registration");
            }}
          >
            New Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="/users/all"
            eventKey="/users/all"
            onClick={() => {
              setKey("/users/all");
            }}
          >
            All Users
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
