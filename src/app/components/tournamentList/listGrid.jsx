import { Button, Col, Row } from "react-bootstrap";
import { getAllTournaments } from "@/actions/data";
import List from "./list";

export default async function ListGrid() {
  const tournaments = await getAllTournaments();
  return (
    <Row className="mb-4" style={{ marginTop: -1.5 + "rem" }}>
      {tournaments.length ? (
        tournaments?.map((tournament, index) => (
          <Col key={index} xs={12} md={6} lg={4} className="tournament-wrapper">
            <List tournament={tournament} />
          </Col>
        ))
      ) : (
        <div className="mt-4">No hay ningún torneo para mostrar...</div>
      )}
    </Row>
  );
}
