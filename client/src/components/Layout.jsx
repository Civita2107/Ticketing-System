import { Row, Col, Button, Form, Alert, Container } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from './Authentication';
import { NavBar } from './Navbar';
import { TicketTable } from './Ticket';
import { TicketForm } from './AddTicket';
import { useEffect } from 'react';
import API from '../API';

function NotFoundLayout() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Row>
                <Col className='text-center'>
                    <h1>404 Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <Link to='/'>Go back to home</Link>
                </Col>
            </Row>
        </Container>
    );
}

function LoginLayout(props) {
    return (
        <Row>
            <Col>
                <LoginForm login={props.login} />
            </Col>
        </Row>
    );
}

function TableLayout(props) {

    return (
        <>
            <Row>
                <Col xs={2} />
                <Col>
                    <TicketTable tickets={props.tickets} user={props.user} handleErrors={props.handleErrors} update={props.update} setUpdate={props.setUpdate} addBlock={props.addBlock} editTicket={props.editTicket} authToken={props.authToken} setAuthToken={props.setAuthToken} stats={props.stats} setStats={props.setStats} />
                </Col>
                <Col xs={2} />
            </Row>
        </>
    );
}

function AddLayout(props) {
    return (
        <TicketForm addTicket={props.addTicket} authToken={props.authToken} setAuthToken={props.setAuthToken} user={props.user} />
    );
}

function GenericLayout(props) {

    return (
        <>
            <Row>
                <Col>
                    <NavBar loggedIn={props.loggedIn} user={props.user} logout={props.logout} />
                </Col>
            </Row>

            <div className='mt-5'>
                <Container>
                    <Row>
                        <Col>
                            <Outlet />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export { NotFoundLayout, LoginLayout, GenericLayout, TableLayout, AddLayout };