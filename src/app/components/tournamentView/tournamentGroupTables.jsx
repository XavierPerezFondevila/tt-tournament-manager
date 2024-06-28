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
import { createFinalPhaseMatch } from "@/actions/data";

export default function TournamentGroupTables({
  groupPlayers,
  matches,
  tournamentId,
  tournamentWinnersNum,
  finalPhaseMatches,
}) {
  const [thisTournamentPlayers, setThisTournamentPlayers] =
    useState(groupPlayers);

  let areGroupsCreated = false;
  const [currentMatches, setCurrentMatches] = useState(matches);
  if (thisTournamentPlayers.length && thisTournamentPlayers[0].grupo !== null) {
    areGroupsCreated = true;
  }

  const playersByGroup = areGroupsCreated
    ? getSortedByGroupsPlayers(thisTournamentPlayers)
    : [];

  const [selectedGroupKey, setSelectedGroupKey] = useState("");
  const [groupStandings, setGroupStandings] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const initModal = (groupKey) => {
    setSelectedGroupKey(groupKey);
    setModalShow(true);
  };

  const assignGroupStandings = () => {
    const players = thisTournamentPlayers;

    const orderedStandings = getGroupStandings(
      matches,
      selectedGroupKey,
      players
    );

    setGroupStandings(orderedStandings);
  };

  const setFinalPhase = async () => {
    const matches = await generateFinalPhase(thisTournamentPlayers);
    let matchOrder = 0;

    for (const match of matches) {
      matchOrder++;
      const newMatch = {
        tournament: tournamentId,
        jugador1: match[0].id,
        jugador2: match[1].id,
        orden_partido: matchOrder,
        num_ronda: 8,
      };

      const result = await createFinalPhaseMatch(newMatch);
    }

    const uri = new URL(window.location.href);

    uri.searchParams.set("q", "finalPhase");

    window.location.href = uri;
  };

  return (
    <div>
      <div className="btn-wrapper">
        {!finalPhaseMatches.length && (
          <Button variant="primary mt-2 mb-4" onClick={setFinalPhase}>
            Generar Fase final
          </Button>
        )}
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
                        groupPlayers={thisTournamentPlayers}
                        groupKey={groupKey}
                      />
                      <TournamentGroupMatchesTable
                        matches={currentMatches}
                        groupKey={groupKey}
                        tournamentPlayers={thisTournamentPlayers}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            <ViewGroupStateModal
              groupkey={selectedGroupKey}
              show={modalShow}
              tournamentid={tournamentId}
              onHide={(showState, updatedPlayers) => {
                if (showState && updatedPlayers) {
                  setThisTournamentPlayers((prevPlayers) =>
                    prevPlayers.map((player) => {
                      const newPlayer = updatedPlayers.find(
                        (p) => p.id === player.id
                      );
                      return newPlayer ? { ...player, ...newPlayer } : player;
                    })
                  );
                }
                setModalShow(showState);
              }}
              onShow={assignGroupStandings}
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
