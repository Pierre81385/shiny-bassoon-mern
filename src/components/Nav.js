import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function SiteNav() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            React Bootstrap
          </Navbar.Brand>
        </Container>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="/users/registration">
            Register
          </NavDropdown.Item>
          <NavDropdown.Item href="/users/all">Users</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/home">HOME</NavDropdown.Item>
        </NavDropdown>
      </Navbar>
    </>
  );
}
