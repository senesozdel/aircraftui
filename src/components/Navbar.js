// components/NavBar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  
  const getLoggedUser = () => {
    try {
      const user = localStorage.getItem("loggedUser");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("JSON parse hatası:", error);
      return null;
    }
  };

  const loggedUser = getLoggedUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">RASINMINA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedUser && (
              <>
                <Nav.Link as={Link} to="/aircraft">Uçaklar</Nav.Link>
                <Nav.Link as={Link} to="/team">Takım</Nav.Link>
                <Nav.Link as={Link} to="/parts">Parçalar</Nav.Link>
                <Nav.Link as={Link} to="/produced-aircraft">Üretilen Uçaklar</Nav.Link>
              </>
            )}
          </Nav>
          {loggedUser ? (
            <Nav>
              <Nav.Link onClick={handleLogout}>Çıkış</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login">Giriş</Nav.Link>
              <Nav.Link as={Link} to="/register">Kayıt Ol</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
