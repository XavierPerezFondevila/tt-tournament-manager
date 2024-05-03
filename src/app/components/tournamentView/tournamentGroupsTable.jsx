"use client";

import { getSortedByGroupsPlayers } from "@/actions/utils";
import { Button, Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import jsPDF from "jspdf";

export default function TournamentGroupsTable({ groupPlayers, matches }) {
  const playersByGroup = getSortedByGroupsPlayers(groupPlayers);

  const convertHTMLToPDF = () => {
    window.print();
  };

  return (
    <div>
      <Button type="button" variant="primary" onClick={convertHTMLToPDF}>
        Genera el PDF
      </Button>
      <div className="groups-wrapper">
        <Accordion>
          {Object.keys(playersByGroup)?.map((groupKey) => (
            <Accordion.Item key={groupKey} eventKey={groupKey}>
              <Accordion.Header>Grupo {groupKey}</Accordion.Header>
              <Accordion.Body>
                <Row
                  className="group-table-wrapper"
                  style={{ maxWidth: "600px" }}
                  id={"group-" + groupKey}
                >
                  <Col xs={12} md={6}>
                    {playersByGroup[groupKey][0]?.map((player, index) => (
                      <Row key={player.id} className="border px-0">
                        <Col className="py-2 border-end text-center" xs={2}>
                          {index + 1}{" "}
                        </Col>
                        <Col className="py-2 border-end text-truncate" xs={7}>
                          {player.nombre}
                        </Col>
                        <Col className="py-2 text-center" xs={3}>
                          {player.ranking}
                        </Col>
                      </Row>
                    ))}
                  </Col>
                  <Col xs={12} md={6}>
                    {playersByGroup[groupKey][1]?.map((player, index) => (
                      <Row key={player.id} className="border px-0">
                        <Col className="py-2 border-end text-center" xs={2}>
                          {index + playersByGroup[groupKey][0].length + 1}
                        </Col>
                        <Col className="py-2 border-end text-truncate" xs={7}>
                          {player.nombre}
                        </Col>
                        <Col className="py-2 text-center" xs={3}>
                          {player.ranking}
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
