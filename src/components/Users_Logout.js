import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";

export default function UserLogout() {
  const navigate = useNavigate();

  return (
    <Container>
      <Button
        onClick={() => {
          localStorage.clear();
          navigate("/home");
        }}
      >
        LOGOUT
      </Button>
    </Container>
  );
}
