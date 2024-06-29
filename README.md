[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Y8bW3OQP)
# Exam #1: "Ticketing System"
## Student: s323440   CIVITAREALE FEDERICO 

## React Client Application Routes

- Route `/`: homepage showing list of tickets
- Route `/login`: shows the login form
- Route `/add`: shows a form that allows to create a new ticket

## API Server

- GET `/tickets`
  - response body content: list of tickets with their content if admin, without content if not admin
- GET `/tickets/:id`
  - request parameters: id of the ticket
  - response body content: retrieve the single ticket information
- POST `/tickets`
  - request body content: ticket title, category and content
  - response body content: the created ticket
- POST `/tickets/:id`
  - request parameters: id of the ticket
  - request body content: new block of text to be added to the ticket
  - response body content: id of the newly created block
- PUT `/tickets/:id`
  - request parameters: id of the ticket
  - request body content: id, state and cateogry of the ticket to be modified
  - response body content: message of ticket succesfully modified
- POST `/sessions`
  - request body content: username and password of the user
  - response body content: id, username and admin boolean
- GET `/sessions/current`
  - response body content: id, username and admin boolean
- DELETE `/sessions/current`
  - response body content: message of succesful logout
- GET `/auth-token`
  - response body content: token (in a JSON object)

## API Server2

- POST `/stats`
  - request body content: title and category of a ticket
  - response body content: estimation (based on if the user is admin or not)

## Database Tables

- Table `users` - contains id, username, password, salt, admin
- Table `tickets` - contains id, state, category, owner, title, timestamp, content
- Table `blocks` - contains id, ticket_id, author, timestamp, content

## Main React Components

- `TicketTable` (in `Ticket.jsx`): it starts the map for every ticket of the list
- `GreatButton` (in `.jsx`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- username, password (plus any other requested info which depends on the text)
- username, password (plus any other requested info which depends on the text)

