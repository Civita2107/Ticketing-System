import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
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
                console.log(err);
                setErrorMessage(err.error.message);
            });
        }
    }


    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh"}}>
        <Card style={{ width: '22rem', boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Card.Body>
                <h1 className='pb-3 text-center'>Login</h1>

                <Form onSubmit={handleSubmit}>
                    {console.log(errorMessage)}
                    {errorMessage && (
                     <Alert dismissible onClose={() => setErrorMessage('')} variant='danger'>{errorMessage}</Alert> 
                    )}
                    <Form.Group className='mb-3' controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><FaUser style={{ fontSize: '1.5rem', height: '100%' }} /></span>
                            </div>
                            <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon2"><FaLock style={{ fontSize: '1.5rem', height: '100%' }} /></span>
                            </div>
                            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </Form.Group>
                    <Button className='w-100' type='submit' style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>Login</Button>
                </Form>
            </Card.Body>
        </Card>
    </div>
    ) 
}

function LogoutButton(props) {
    return (
        <Button variant='danger' onClick={props.logout}>Logout</Button>
    );
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button variant='primary' style={{backgroundColor: '#f8b195'}} onClick={ () => navigate('/login')}>Login</Button>
    );
}

export { LoginForm, LogoutButton, LoginButton };