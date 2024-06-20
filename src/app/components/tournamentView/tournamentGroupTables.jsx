"use client";

import { useEffect } from "react";
import {
  getGroupStandings,
  getMatchesByGroup,
  getSortedByGroupsPlayers,
} from "@/actions/utils";
import { Button, Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Link from "next/link";
import TournamentGroupTable from "./tournamentGroupTable";
import TournamentGroupMatchesTable from "./tournamentGroupMatchesTable";
import ViewGroupStateModal from "../modals/viewGroupStateModal";
import { useState } from "react";
import { generateFinalPhase } from "@/actions/tournament";

export default function TournamentGroupTables({
  groupPlayers,
  matches,
  tournamentId,
  tournamentWinnersNum,
}) {
  let areGroupsCreated = false;
  const [currentMatches, setCurrentMatches] = useState(matches);

  if (groupPlayers.length && groupPlayers[0].grupo !== null) {
    areGroupsCreated = true;
  }

  const playersByGroup = areGroupsCreated
    ? getSortedByGroupsPlayers(groupPlayers)
    : [];

  const [selectedGroupKey, setSelectedGroupKey] = useState("");
  const [groupStandings, setGroupStandings] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const initModal = (groupKey) => {
    setSelectedGroupKey(groupKey);
    setModalShow(true);
  };

  const assignGroupStandings = () => {
    const orderedStandings = getGroupStandings(
      matches,
      selectedGroupKey,
      groupPlayers
    );
    setGroupStandings(orderedStandings);
  };

  return (
    <div>
      <div className="btn-wrapper">
        <Button
          variant="primary mt-2 mb-4"
          onClick={() => {
            generateFinalPhase(
              currentMatches,
              playersByGroup,
              tournamentWinnersNum
            );
          }}
        >
          Generar Fase final
        </Button>
      </div>
      <div className="groups-wrapper">
        {playersByGroup.length !== 0 ? (
          <>
            <Accordion>
              {Object.keys(playersByGroup)?.map((groupKey) => (
                <Accordion.Item
                  key={"accordion" + groupKey}
                  eventKey={groupKey}
                >
                  <Accordion.Header>Grupo {groupKey}</Accordion.Header>
                  <Accordion.Body>
                    <div className="btns-wrapper mb-4 d-flex gap-4 flex-wrap">
                      <Link
                        href={`/tournament/${tournamentId}/groups/${groupKey}`}
                        className="btn btn-primary"
                        target="_blank"
                      >
                        Imprimir PDF
                      </Link>

                      <Button
                        variant="success"
                        onClick={() => {
                          initModal(groupKey);
                        }}
                      >
                        Ver clasificacion
                      </Button>
                    </div>

                    <div className="groups-table-wrapper">
                      <TournamentGroupTable
                        groupPlayers={groupPlayers}
                        groupKey={groupKey}
                      />
                      <TournamentGroupMatchesTable
                        matches={currentMatches}
                        groupKey={groupKey}
                        tournamentPlayers={groupPlayers}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            <ViewGroupStateModal
              groupkey={selectedGroupKey}
              show={modalShow}
              onShow={assignGroupStandings}
              onHide={() => {
                setModalShow(false);
              }}
              standings={groupStandings}
            />
          </>
        ) : (
          <div>No se han creado los grupo todavía</div>
        )}
      </div>
    </div>
  );
}
