import { Row, Col, Button, Form, Alert, Container } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from './Authentication';
import { NavBar } from './Navbar';
import { TicketTable } from './Ticket';
import { useEffect } from 'react';
import API from '../API';

function NotFoundLayout() {
    return (
        <Row>
            <Col xs={2}></Col>
            <Col xs={8}>
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to='/'>Go back to home</Link>
            </Col>
            <Col xs={2}></Col>
        </Row>
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

    useEffect(() => {
        if (!props.dirty) { //remember to change it
            API.getTickets()
                .then((tickets) => {
                    props.setTickets(tickets);
                    props.setDirty(false);
                })
                .catch((err) => {
                    props.handleErrors(err);
                });
        }
    }, [props.dirty]);
    return (
        <>
            <Row>
                <Col xs={2}/>
                <Col>
                    <TicketTable tickets={props.tickets} />
                </Col>
                <Col xs={2}/>
            </Row>
        </>
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
                <p></p>
                    <Outlet />
                </Col>
            </Row>
            </Container>
            </div>
        </>
    )
}

export { NotFoundLayout, LoginLayout, GenericLayout, TableLayout };