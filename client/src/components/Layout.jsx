import { Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { Outlet, Link, useParams } from 'react-router-dom';
import { LoginForm } from './Authentication';
import { NavBar } from './Navbar';
import { TicketTable } from './Ticket';
import { useEffect } from 'react';
import API from '../API';
import 'bootstrap/dist/css/bootstrap.min.css';

function NotFoundLayout(props) {
    return (
        <Row>
            <Col xs={4}></Col>
            <Col xs={4}>
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to='/'>Go back to home</Link>
            </Col>
            <Col xs={4}></Col>
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
        if (props.dirty) {
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
                <Col>
                    <TicketTable tickets={props.tickets} />
                </Col>
            </Row>
        </>
    );
}

function GenericLayout(props) {

    return (
        <>
        
        
                    <NavBar loggedIn={props.loggedIn} user={props.user} logout={props.logout} />
              <div className='mt-5'>  
            <Row>
                <Col>
                    <Outlet />
                </Col>
            </Row>
            </div>
        </>
    )
}

export { NotFoundLayout, LoginLayout, GenericLayout, TableLayout };