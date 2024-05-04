"use client";

import { getSortedByGroupsPlayers } from "@/actions/utils";
import { Button, Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import jsPDF from "jspdf";
import Link from "next/link";
import TournamentGroupTable from "./tournamentGroupTable";
import TournamentGroupMatchesTable from "./tournamentGroupMatchesTable";

export default function TournamentGroupTables({
  groupPlayers,
  matches,
  tournamentId,
}) {
  const playersByGroup = getSortedByGroupsPlayers(groupPlayers);

  return (
    <div>
      <div className="groups-wrapper">
        <Accordion>
          {Object.keys(playersByGroup)?.map((groupKey) => (
            <Accordion.Item key={groupKey} eventKey={groupKey}>
              <Accordion.Header>Grupo {groupKey}</Accordion.Header>
              <Accordion.Body>
                <Link
                  href={`/tournament/${tournamentId}/groups/${groupKey}`}
                  className="btn btn-primary mb-4"
                  target="_blank"
                >
                  Imprimir PDF
                </Link>
                <div className="groups-table-wrapper">
                  <TournamentGroupTable
                    groupPlayers={groupPlayers}
                    groupKey={groupKey}
                  />
                  <TournamentGroupMatchesTable
                    matches={matches}
                    groupKey={groupKey}
                    tournamentPlayers={groupPlayers}
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
