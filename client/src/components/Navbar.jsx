import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LoginButton, LogoutButton } from './Authentication'
import { FaSignInAlt, FaTicketAlt, FaUserCircle } from 'react-icons/fa';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar (props) {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" style={{marginBottom: '20px'}}>
        <Container fluid>
          <Navbar.Brand href="/"><FaTicketAlt style={{ marginTop: '-4px', paddingRight: '4px'}} />TICKETING SYSTEM</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {props.loggedIn ? (
                <>
                  console.log(props.user);
                  <FaUserCircle /> {props.user.username}
                  <LogoutButton logout={props.logout} />
                </>
              ) : (
                <>
                  <FaSignInAlt style={{ marginRight: '8px', color: '#ffffff', textAlign: '', marginTop: '12px' }} />
                  <LoginButton  />
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export { NavBar };