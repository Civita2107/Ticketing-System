import dayjs from 'dayjs';
import { Table, Card, Button, Accordion } from 'react-bootstrap';
import React from 'react';

function TicketTable(props) {
    const { tickets } = props;

    return (
        
        <Accordion alwaysOpen>
            {tickets.map((ticket, index) => (
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
                    <Accordion.Body>
                        {ticket.content}
                    </Accordion.Body>
                    
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
    

    function TicketRow(props) {



        return (
            <tr>
                <td>





                </td>
            </tr>
        )
    }


export { TicketTable };