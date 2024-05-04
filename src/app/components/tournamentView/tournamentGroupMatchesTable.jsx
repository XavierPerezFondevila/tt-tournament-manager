"use client";

import { getMatchesByGroup, getSortedByGroupsPlayers } from "@/actions/utils";
import { Table } from "react-bootstrap";
import "./styles.css";

export default function TournamentGroupMatchesTable({
  matches,
  groupKey,
  tournamentPlayers,
}) {
  const groupMatches = getMatchesByGroup(matches, groupKey);
  const groupPlayers = getSortedByGroupsPlayers(tournamentPlayers)[groupKey];
  const auxPlayerIndex = groupPlayers.flat().map(({ id }) => id);

  return (
    <div className="table-wrapper matches-table table-responsive mt-4">
      <Table bordered style={{ maxWidth: "900px" }}>
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
            <td className="text-center align-middle small">Ganador</td>
            <td className="text-center align-middle small">Resultado</td>
          </tr>
        </thead>
        <tbody>
          {groupMatches.map((match) => (
            <tr key={match.id_partido}>
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
              <td className="text-center align-middle">
                <div className="result"></div>
              </td>
              <td className="text-center align-middle">
                <div className="result"></div>
              </td>
              <td className="text-center align-middle">
                <div className="result"></div>
              </td>
              <td className="text-center align-middle">
                <div className="result"></div>
              </td>
              <td className="text-center align-middle">
                <div className="result"></div>
              </td>
              <td className="text-center align-middle"></td>
              <td className="text-center align-middle"></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
