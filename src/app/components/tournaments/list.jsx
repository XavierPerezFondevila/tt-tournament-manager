import { Col, Row } from 'react-bootstrap';
import { getAllTournaments } from '@/actions/data';

export default async function List() {
  const tournaments = await getAllTournaments();

    return (
    <div>
        { tournaments?.map((tournament) => (
            <div key={tournament.id}>
                <Col xs={12} md={6} className='tournament-wrapper border p-2 w-100'>
                    <div className="tournament-info d-flex gap-4">
                        <div className='name'>{tournament.nombre}</div>
                        <div className='date'>Fecha inicio: {tournament.fecha_inicio.toLocaleString().split(',')[0]}</div>
                    </div>
                    <div className='action-buttons'></div>
                </Col>
            </div>
        ))}
    </div>);
}
