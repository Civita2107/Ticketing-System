import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm(props) {
    const [username, setUsername] = useState('mario');
    const [password, setPassword] = useState('password');

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        if (!username) {
            setErrorMessage('Username is required');
            return;
        } else if (!password) {
            setErrorMessage('Password is required');
            return;
        } else {
            props.login(credentials).then(() => navigate("/")).catch((err) => {
                setErrorMessage(err.error);
            });
        }
    }


    return (
        <Row>
            <Col xs={4}></Col>
            <Col xs={4}>
                <h1 className='pb-3'>Login</h1>

                <Form onSubmit={handleSubmit}>
                    {errorMessage ? <Alert dismissable onClose={() => setErrorMessage('')} variant='danger'>{errorMessage}</Alert> : null}
                    <Form.Group className='mb-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button className='mb-3' type='submit'>Login</Button>

                </Form>
            </Col>
            <Col xs={4}></Col>
        </Row>
    );
}

function LogoutButton(props) {
    return (
        <Button variant='danger' onClick={props.logout}>Logout</Button>
    );
}

function LoginButton(props) {
    const navigate = useNavigate();
    return (
        <Button variant='primary' onClick={ () => navigate('/login')}>Login</Button>
    );
}

export { LoginForm, LogoutButton, LoginButton };