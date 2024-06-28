import { React, useEffect, useState } from 'react'
import './App.css'
import Container from 'react-bootstrap/esm/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, BrowserRouter, Navigate, useNavigate } from 'react-router-dom'
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
  const [update, setUpdate] = useState(true);

  const [authToken, setAuthToken] = useState(undefined);
  const [stats, setStats] = useState({});

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setDirty(true);
      setUpdate(true);
      renewToken();
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

  const renewToken = () => {
    API.getAuthToken().then((resp) => {
      setAuthToken(resp.token);
    }).catch((err) => {
      console.log("Error in renewing the token", err);
    });
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
        const authToken = await API.getAuthToken();
        setAuthToken(authToken.token);
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

  useEffect(() => {
    if (tickets) {
      if (authToken) {
        if (Array.isArray(tickets)) {
          for (const ticket of tickets) {
            API.getStats(authToken, ticket)
              .then(stats => setStats(previousStats => ({ ...previousStats, [ticket.id]: stats })))
              .catch((err) => { // if error reset stats and renew token
                setStats({});
                API.getAuthToken().then((resp) => {
                  setAuthToken(resp.token);
                });
              }
              );
          }
        }
      }
    }
  }, [tickets, authToken]); // occurs when tickets or authToken changes

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setDirty(true);
    setUpdate(true);
    setAuthToken(undefined);
    setStats({});
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

  function editTicket(ticket) {
    API.editTicket(ticket)
      .then(() => {
        setDirty(true);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<GenericLayout loggedIn={loggedIn} user={user} logout={handleLogout} message={message} setMessage={setMessage} />} >
          <Route index element={<TableLayout tickets={tickets} user={user} update={update} setUpdate={setUpdate} addBlock={addBlock} editTicket={editTicket} stats={stats} setStats={setStats} authToken={authToken} setAuthToken={setAuthToken} handleErrors={handleErrors} />} />
          <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
          <Route path="/add" element={loggedIn ? <AddLayout addTicket={addTicket} authToken={authToken} setAuthToken={setAuthToken} user={user} /> : <Navigate replace to='/login' />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>
      </Routes>
    </Container>
  )
}

export default App;
