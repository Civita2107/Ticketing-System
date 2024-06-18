import 'dayjs';
import { Table } from 'react-bootstrap';


function TicketTable(props) {
    const { tickets } = props;

    return (
        <Table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>State</th>
                    <th>Category</th>
                    <th>Owner</th>
                    <th>Creation Date</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map( (ticket) => <TicketRow ticket={ticket} key={ticket.id} />)}
            </tbody>
        </Table>
    )

function TicketRow(props) {

    const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    }

    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.ticket.state}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">{props.ticket.category}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">{props.ticket.owner}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">{formatDate(props.ticket.timestamp)}</Card.Subtitle>
        <Card.Text>
          {content}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
    )
}
}

export { TicketTable };