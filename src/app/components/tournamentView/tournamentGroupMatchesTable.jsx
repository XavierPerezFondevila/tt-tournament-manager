"use client";

import {
  getMatchesByGroup,
  getSortedByGroupsPlayers,
  isPdfPage,
} from "@/actions/utils";
import { Button, Table } from "react-bootstrap";
import "./styles.css";
import { useState } from "react";
import AddResultModal from "../modals/addResultModal";
import { usePathname } from "next/navigation";

export default function TournamentGroupMatchesTable({
  matches,
  groupKey,
  tournamentPlayers,
}) {
  const groupMatches = getMatchesByGroup(matches, groupKey);
  const groupPlayers = getSortedByGroupsPlayers(tournamentPlayers)[groupKey];
  const auxPlayerIndex = groupPlayers.flat().map(({ id }) => id);

  const [modalShow, setModalShow] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState({});

  const initResultModal = (match) => {
    setSelectedMatch(match);
    setModalShow(true);
  };

  const pathname = usePathname();
  const isPdfRoute = isPdfPage(pathname);

  return (
    <div className="table-wrapper matches-table table-responsive mt-4">
      <Table bordered style={{ maxWidth: "1032px" }}>
        <thead>
          <tr>
            <td className="text-center align-middle small">PART</td>
            <td className="text-center align-middle small">ARB</td>
            <td className="text-center align-middle small">
              <div>JUGADOR1</div>
              <div>JUGADOR2</div>
            </td>
            <td className="text-center align-middle small">
              <div>1r</div>
              <div>JUEGO</div>
            </td>
            <td className="text-center align-middle small">
              <div>2ndo</div>
              <div>JUEGO</div>
            </td>
            <td className="text-center align-middle small">
              <div>3r</div>
              <div>JUEGO</div>
            </td>
            <td className="text-center align-middle small">
              <div>4to</div>
              <div>JUEGO</div>
            </td>
            <td className="text-center align-middle small">
              <div>5to</div>
              <div>JUEGO</div>
            </td>
            <td
              className="text-center align-middle small"
              style={{ minWidth: "20ch" }}
            >
              Ganador
            </td>
            <td className="text-center align-middle small">Resultado</td>
            {!isPdfRoute && (
              <td className="text-center align-middle small"></td>
            )}
          </tr>
        </thead>
        <tbody>
          {groupMatches.map((match) => (
            <tr key={"current-matches-" + match.id_partido}>
              <td className="text-center align-middle">
                {auxPlayerIndex.findIndex((id) => id === match.id_jugador1) + 1}
                -
                {auxPlayerIndex.findIndex((id) => id === match.id_jugador2) + 1}
              </td>
              <td className="text-center align-middle">
                {auxPlayerIndex.findIndex((id) => id === match.id_arbitro) + 1}
              </td>
              <td className="text-center align-middle">
                <div>{match.nombre_jugador1}</div>
                <div>{match.nombre_jugador2}</div>
              </td>
              {match.resultado && !isPdfRoute
                ? match.resultado.split(",").map((result, index) => {
                    const [part1, part2] = result.split("-");
                    // Check if both parts are not equal to zero
                    if (parseInt(part1) !== 0 || parseInt(part2) !== 0) {
                      return (
                        <td key={index} className="text-center align-middle">
                          <div>{part1}</div>{" "}
                          <div
                            className="separator"
                            style={{ lineHeight: "10px" }}
                          >
                            -
                          </div>
                          <div>{part2}</div>
                        </td>
                      );
                    } else {
                      return <td key={index}></td>;
                    }
                  })
                : Array.from({ length: 5 }).map((_, index) => (
                    <td key={index} className="text-center align-middle"></td>
                  ))}
              <td
                className="text-center align-middle"
                style={{ minWidth: "20ch" }}
              >
                {match?.ganador && !isPdfRoute
                  ? match.id_jugador1 === match.ganador
                    ? match.nombre_jugador1
                    : match.nombre_jugador2
                  : ""}
              </td>
              <td className="text-center align-middle">
                {match?.ganador && !isPdfRoute ? match.resultado_global : ""}
              </td>

              {!isPdfRoute && (
                <td className="text-center align-middle">
                  <Button
                    variant="primary"
                    onClick={() => {
                      initResultModal(match);
                      // setModalShow(true)
                    }}
                  >
                    Añadir resultado
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <AddResultModal
        selectedmatch={selectedMatch}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
    </div>
  );
}
