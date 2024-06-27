import { Table, Card, Button, Accordion } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import API from '../API';

function TicketTable(props) {
    const { tickets, handleErrors } = props;

    return (
        <>
            <AddButton />
            {tickets.map((ticket, index) => (
                <TicketRow key={index} ticket={ticket} handleErrors={handleErrors} />
            ))}
        </>
    )
}

function TicketRow(props) {

    const { ticket, index, handleErrors } = props;

    const [blocks, setBlocks] = useState([]);
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        if (update) {
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
            <Accordion alwaysOpen>
                <Accordion.Item key={ticket.id} eventKey={String(index)} className='accordion mt-3'>
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
                    <Accordion.Body style= {{ whiteSpace: "pre-line"}}>
                        {DOMPurify.sanitize(ticket.content)}
                        {blocks.map((block, index) => (
                            <Card key={index}>
                                <BlockRow block={block} />
                            </Card>
                        ))}
                    </Accordion.Body>

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
        <Button className="login-button" style={{
            fontSize: "1.5rem", padding: '10px 20px', position: 'fixed', top: 70, right: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
            onClick={() => navigate('/add')}>+</Button>
    )
}

export { TicketTable }; 