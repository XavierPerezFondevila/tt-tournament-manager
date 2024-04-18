import { Button, Col, Row } from "react-bootstrap";
import { getAllTournaments } from "@/actions/data";
import List from "./list";

export default async function ListGrid() {
  const tournaments = await getAllTournaments();

  return (
    <Row>
      {tournaments?.map((tournament, index) => (
        <Col
          key={index}
          xs={12}
          md={6}
          lg={4}
          className="tournament-wrapper border p-2"
        >
          <List tournament={tournament} />
        </Col>
      ))}
    </Row>
  );
}
