import { Table, Card, Button, Accordion, Modal, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import API from '../API';

function TicketTable(props) {
    const { tickets, handleErrors, user, update, setUpdate, addBlock, editTicket } = props;

    return (
        <>
            <AddButton />
            {tickets.map((ticket, index) => (
                <TicketRow key={index} ticket={ticket} user={user} handleErrors={handleErrors} update={update} setUpdate={setUpdate} addBlock={addBlock} editTicket={editTicket} />
            ))}
        </>
    )
}

function TicketRow(props) {

    const { ticket, index, handleErrors, user, update, setUpdate, addBlock, editTicket } = props;

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if (update && user) {
            API.getTicketContent(ticket.id)
                .then((blocks) => {
                    setBlocks(blocks);
                    setUpdate(false);
                })
                .catch((err) => {
                    handleErrors(err);
                });
        }
    });




    return (
        <>
            <Accordion alwaysOpen style={{ margin: '1rem' }}>
                <Accordion.Item key={ticket.id} eventKey={String(index)} className='accordion'>
                    {user && ((user.username == ticket.owner && ticket.state == "Open") || user.admin == 1) && (
                        <p><EditTicket user={user} ticket={ticket} update={update} setUpdate={setUpdate} handleErrors={handleErrors} editTicket={editTicket} /></p>)}
                    <Accordion.Header>
                        <Table className='ticket-table'>
                            <tbody>
                                <tr>
                                    <th>Title</th>
                                    <td>{ticket.title}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>{ticket.state}</td>
                                </tr>
                                <tr>
                                    <th>Category</th>
                                    <td>{ticket.category}</td>
                                </tr>
                                <tr>
                                    <th>Owner</th>
                                    <td>{ticket.owner}</td>
                                </tr>
                                <tr>
                                    <th>Creation Date</th>
                                    <td>{ticket.timestamp}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Header>
                    {user && (
                        <Accordion.Body style={{ whiteSpace: "pre-line" }}>
                            <p>{DOMPurify.sanitize(ticket.content)}</p>
                            {blocks.map((block, index) => (
                                <Card key={index} className='ticket-card'>
                                    {user && <BlockRow block={block} />}
                                </Card>
                            ))}
                            {user && ticket.state == "Open" && <AddBlock ticket={ticket} update={update} setUpdate={setUpdate} addBlock={addBlock} handleErrors={handleErrors} />}
                        </Accordion.Body>)}
                </Accordion.Item>
            </Accordion>
        </>
    )
}

function BlockRow(props) {
    const { block } = props;

    return (
        <>
            <Card.Body>
                <Card.Title>{block.username}</Card.Title>
                <Card.Text style={{ whiteSpace: "pre-line" }}>{DOMPurify.sanitize(block.content)}</Card.Text>
                <Card.Text>{block.timestamp}</Card.Text>
            </Card.Body>
        </>

    )
}

function AddButton() {
    const navigate = useNavigate();

    return (
        <Button className="add-button" style={{
            fontSize: "1.5rem", padding: '10px 20px', position: 'fixed', top: 70, right: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#355c7d',
            background: '#355c7d',
        }}
            onClick={() => navigate('/add')}>+</Button>
    )
}

function AddBlock(props) {

    const { ticket, handleErrors, update, setUpdate, addBlock } = props;

    const [modalShow, setModalShow] = useState(false);
    const [content, setContent] = useState('');

    const handleConfirm = () => {
        const block = {
            content: content,
            ticket_id: ticket.id,
        }
        addBlock(block);
        setModalShow(false);
    }

    return (
        <>
            <Button className="add-block-button" onClick={() => setModalShow(true)}>Add Block</Button>

            {modalShow && (
                <Modal show={modalShow} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Block</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Content</Form.Label>
                                <Form.Control as='textarea' placeholder='Enter content' onChange={(e) => setContent(e.target.value)} />
                            </Form.Group>
                            <Button variant='primary' type='submit' style={{ marginRight: '10px' }} onClick={handleConfirm} onError={handleErrors}>Submit</Button>
                            <Button variant='secondary' onClick={() => setModalShow(false)}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
}

function EditTicket(props) {
    const { ticket, handleErrors, update, setUpdate, editTicket, user } = props;

    const [modalShow, setModalShow] = useState(false);
    const [category, setCategory] = useState(ticket.category);
    const [state, setState] = useState(ticket.state);

    const handleConfirm = () => {
        const updatedTicket = {
            category: category,
            state: state,
            id: ticket.id
        }
        editTicket(updatedTicket);
        setModalShow(false);
    }

    return (
        <>
            <Button className="edit-ticket-button" style={{ marginLeft: '30px', marginTop: '10px' }} onClick={() => setModalShow(true)}>Edit Ticket</Button>

            {modalShow && (
                <Modal show={modalShow} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Ticket</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3'>
                                {user.admin ? <Form.Select defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="inquiry">Inquiry</option>
                                    <option value="maintainance">Maintainance</option>
                                    <option value="new feature">New feature</option>
                                    <option value="administrative">Administrative</option>
                                    <option value="payment">Payment</option>
                                </Form.Select> :
                                    <Form.Select disabled defaultValue="placeholder">
                                        <option value="placeholder" disabled>{category}</option>
                                    </Form.Select>}
                                <Form.Check
                                    type='checkbox'
                                    label="Ticket Open"
                                    checked={state === "Open"}
                                    onChange={(e) => setState(e.target.checked ? "Open" : "Closed")}
                                />
                            </Form.Group>
                            <Button variant='primary' type='submit' style={{ marginRight: '10px' }} onClick={handleConfirm} onError={handleErrors}>Submit</Button>
                            <Button variant='secondary' onClick={() => setModalShow(false)}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
}

export { TicketTable }; 