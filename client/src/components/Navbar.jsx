import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { LoginButton, LogoutButton } from './Authentication'
import { FaSignInAlt, FaTicketAlt, FaUserCircle } from 'react-icons/fa';
import { BsTicketDetailed } from 'react-icons/bs';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar(props) {
  return (
    <>
      <Navbar fixed="top" className='ticket-navbar'>
        <Container fluid>
          <BsTicketDetailed style={{ paddingRight: '10px', color: '#ffffff' }} size={35} />
          
          <div className="d-flex justify-content-center text-center">
            <Link to="/" style={{ color: '#ffffff', fontSize: '22px', textDecoration: 'none' }} >TICKETING SYSTEM </Link>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {props.loggedIn ? (
                <>
                  <FaUserCircle style={{ marginTop: '6px', marginRight: '1rem' }} />
                  <span style={{ marginRight: '1rem', fontSize: '22px' }}>{props.user.username}</span>
                  <LogoutButton logout={props.logout} />
                </>
              ) : (
                <>
                  <FaSignInAlt style={{ marginRight: '8px', color: '#ffffff', textAlign: '', marginTop: '8px' }} />
                  <LoginButton />
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