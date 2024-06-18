import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001';

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

const getTickets = async () => {
  return getJson(fetch(SERVER_URL + 'tickets', {
    method: 'GET',
    credentials: 'include'
  })).then(tickets => {
    return tickets.map(ticket => {
      const ticketJson = {
        id : ticket.id,
        title : ticket.title,
        state : ticket.state,
        category : ticket.category,
        owner : ticket.owner,
        timestamp : ticket.timestamp,
      }
      return ticketJson;
    });
  });
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

const API = { logIn, logOut, getUserInfo, getTickets };
export default API;