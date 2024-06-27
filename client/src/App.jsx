import { React, useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import './App.css'
import Container from 'react-bootstrap/esm/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, BrowserRouter, Navigate, useNavigate, useParams } from 'react-router-dom'
import { NavBar } from './components/Navbar'
import { LoginLayout, GenericLayout, NotFoundLayout, TableLayout, AddLayout } from './components/Layout'
import API from './API'

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

function AppWithRouter() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);
  const [ticketContent, setTicketContent] = useState([]);
  const [update, setUpdate] = useState(true);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setDirty(true);
      setUpdate(true);
    } catch (err) {
      throw err;
    }
  };

  const handleErrors = (err) => {
    let msg = '';
    if (err.error) {
      msg = err.error;
    } else if (err.errors) {
      if (err.errors[0].msg) {
        msg = err.errors[0].msg + " : " + err.errors[0].path;
      } else if (Array.isArray(err)) {
        msg = err[0].msg + " : " + err[0].path;
      } else if (typeof err === "string") {
        msg = String(err);
      } else {
        msg = "Unknown error";
      }
      setMessage(msg);
      console.log(err);

      setTimeout(() => setDirty(true), 2000);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        handleErrors(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (dirty) {
      getTickets();
    }
  });

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setDirty(true);
    setUpdate(true);
  };

  function getTickets() {
    API.getTickets()
      .then((tickets) => {
        setTickets(tickets);
        setDirty(false);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  function addTicket(ticket) {
    API.addTicket(ticket)
      .then(() => {
        setDirty(true);
        // navigate('/');
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  function addBlock(block) {
    API.addBlock(block)
      .then(() => {
        setUpdate(true);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<GenericLayout loggedIn={loggedIn} user={user} logout={handleLogout} message={message} setMessage={setMessage} />} >
          <Route index element={<TableLayout tickets={tickets} user={user} update={update} setUpdate={setUpdate} addBlock={addBlock} handleErrors={handleErrors} />} />
          <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
          <Route path="/add" element={loggedIn ? <AddLayout addTicket={addTicket} /> : <Navigate replace to='/login' />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>
      </Routes>
    </Container>
  )
}

export default App;
