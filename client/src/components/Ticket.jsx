import dayjs from 'dayjs';
import { Table, Card, Button, Accordion } from 'react-bootstrap';
import React from 'react';

const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
}



function TicketTable(props) {
    const { tickets } = props;

    return (
        
        <Accordion alwaysOpen>
            {tickets.map((ticket, index) => (
                <br></br>,
                <Accordion.Item key={ticket.id} eventKey={String(index)}>
                    <Accordion.Header>
                        {ticket.title} - {ticket.category} - {ticket.state} - {ticket.owner}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>{ticket.title}</td>
                                </tr>
                                <tr>
                                    <td>State</td>
                                    <td>{ticket.state}</td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td>{ticket.category}</td>
                                </tr>
                                <tr>
                                    <td>Owner</td>
                                    <td>{ticket.owner}</td>
                                </tr>
                                <tr>
                                    <td>Creation Date</td>
                                    <td>{formatDate(ticket.creationDate)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
    

    function TicketRow(props) {



        return (
            <tr>
                <td colSpan="6" style={{ padding: 0 }}>





                </td>
            </tr>
        )
    }


export { TicketTable };