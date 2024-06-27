import { Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TicketForm = (props) => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [modalShow, setModalShow] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title) {
            setErrorMessage('Title is required');
        } else if (!content) {
           setErrorMessage('Content is required');
        } else if (!category || category === 'Category') {
            setErrorMessage('Category is required');
        } else if (title.length > 40) {
            setErrorMessage('Title is too long');
        } else if (content.length > 400) {
            setErrorMessage('Content is too long');
        } else {
            setModalShow(true);
        }
    }

    const handleConfirm = () => {
        const ticket = {
            title: title,
            content: content,
            category: category
        }
        props.addTicket(ticket);
        setModalShow(false);
        navigate('/');
    }

    const handleCancel = () => {
        setModalShow(false);
    }

    return (
        <>
        {errorMessage ? <Alert variant='danger' onClose={ () => setErrorMessage('')} dismissible>{errorMessage}</Alert> : false}
        <Form onSubmit={handleSubmit} className='form'>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control as="textarea" placeholder="Content" onChange={(e) => setContent(e.target.value)}/>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select onChange={(e) => setCategory(e.target.value)}>
          <option value="Category">Category</option>
          <option value="inquiry">Inquiry</option>
          <option value="maintainance">Maintainance</option>
          <option value="new feature">New feature</option>
          <option value="administrative">Administrative</option>
          <option value="payment">Payment</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit" style={{marginRight: '10px'}}>Submit</Button>
      <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
    </Form>

    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={modalShow} onHide={handleCancel} >
        <Modal.Header closeButton>
          <Modal.Title>Add ticket confirmation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Title: {title}</p>
          <p>Content: {content}</p>
          <p>Category: {category}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>Close</Button>
          <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}

export { TicketForm };