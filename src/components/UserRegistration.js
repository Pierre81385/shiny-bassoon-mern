import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

function UserRegistration() {
  // State to hold user input values
  const [reqData, setReqData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [resp, setResp] = React.useState(null);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the formData to your backend API for user registration here
    console.log(reqData);
    axios
      .post(`http://localhost:4200/users/add`, {
        name: reqData.name,
        email: reqData.email,
        password: reqData.password,
      })
      .then((response) => {
        setResp(response.data);
        setReqData({
          name: "",
          email: "",
          password: "",
        });
      });
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReqData({
      ...reqData,
      [name]: value,
    });
  };

  return (
    <div className="user-registration">
      <h2>User Registration</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={reqData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={reqData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={reqData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
        <Form.Text>{resp}</Form.Text>
      </Form>
    </div>
  );
}

export default UserRegistration;
