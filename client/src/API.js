import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          response.json()
            .then(obj => 
              reject(obj)
              ) 
            .catch(err => reject({ error: "Cannot parse server response" })) 
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) 
  });
}

const getUserById = async (userId) => {
  return getJson(fetch(SERVER_URL + 'users/' + userId, {
    method: 'GET',
    credentials: 'include'
  })).then(user => {
    return {
      id: user.id,
      username: user.username,
      admin: user.admin
    };
  });
}

const getTickets = async () => {
   const tickets = await getJson(fetch(SERVER_URL + 'tickets', {
    method: 'GET',
    credentials: 'include'
  }));

  const ticketsWithOwner = await Promise.all(tickets.map(async (ticket) => {
    const state = ticket.state === 1 ? 'Open' : 'Closed';
    
    const ticketWithOwner = {
      id: ticket.id,
      title: ticket.title,
      state: state,
      category: ticket.category,
      owner: ticket.username, 
      timestamp: ticket.timestamp,
    };

    if (ticket.content) {
      ticketWithOwner.content = ticket.content;
    }
    return ticketWithOwner;
  }));
  console.log(ticketsWithOwner);
  return ticketsWithOwner;
}

const getTicketContent = async (ticketId) => {
  return getJson(fetch(SERVER_URL + 'blocks/' + ticketId, {
    method: 'GET',
    credentials: 'include'
  })).then(blocks => {
    return {
      content: blocks.content,
    }});
  }

function addTicket(ticket) {
  return getJson(fetch(SERVER_URL + 'tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(ticket)
  }));
}

function addBlock(block) {
  return getJson(fetch(SERVER_URL + 'tickets/:id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(block)
  }));
}

const logIn = async (credentials) => {
    return getJson(fetch(SERVER_URL + 'sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    })); 
}

const logOut = async () => {
    return getJson(fetch(SERVER_URL + 'sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    }));
}

const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'GET',
    credentials: 'include'
  }));
}

const API = { logIn, logOut, getUserInfo, getTickets, addTicket, addBlock, getTicketContent };
export default API;