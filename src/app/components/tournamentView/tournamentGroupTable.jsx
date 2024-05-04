"use client";

import { getSortedByGroupsPlayers, isPdfPage } from "@/actions/utils";
import { Button, Col, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function TournamentGroupTable({ groupPlayers, groupKey }) {
  const playersByGroup = getSortedByGroupsPlayers(groupPlayers);
  const pathname = usePathname();
  const isPdf = isPdfPage(pathname);

  return (
    <Row
      className={clsx("m-0", isPdf && "pdf-group")}
      style={{ maxWidth: "600px" }}
      id={`group-${groupKey}`}
    >
      {isPdf && <div className="h3 mb-4">Grupo: {groupKey} </div>}
      <Col xs={12} sm={6}>
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
      <Col xs={12} sm={6}>
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
  );
}
