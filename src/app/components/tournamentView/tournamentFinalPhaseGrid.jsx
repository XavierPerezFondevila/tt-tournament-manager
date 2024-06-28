import React, { useState } from "react";
import AddFinalFaseResultModal from "../modals/addFinalFaseResultModal";

export default function TournamentFinalPhaseGrid({ matches, tournamentId }) {
  const [currentMatches, setCurrentMatches] = useState(matches);
  const [modalShow, setModalShow] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState({});

  const initResultModal = (match) => {
    setSelectedMatch(match);
    setModalShow(true);
  };

  return (
    <>
      <div className="fp-grid-wrapper">
        {currentMatches.map((match) => (
          <div
            onClick={() => {
              initResultModal(match);
            }}
            key={match.id_partido}
            className={"match" + match.orden_partido + match.num_ronda + ""}
            //   onClick={addMatchResult}
          >
            <div className="match-name border p-2 d-flex justify-content-between align-items-center">
              <span className="name">{match.nombre_jugador1}</span>
              <span className="result">
                {match.resultado_global?.length
                  ? match.resultado_global.split("-")[0]
                  : 0}
              </span>
            </div>
            <div className="match-name border p-2 d-flex justify-content-between align-items-center">
              <span className="name">{match.nombre_jugador2}</span>
              <span className="result">
                {match.resultado_global?.length
                  ? match.resultado_global.split("-")[1]
                  : 0}
              </span>
            </div>
          </div>
        ))}
      </div>
      <AddFinalFaseResultModal
        selectedmatch={selectedMatch}
        tournamentid={tournamentId}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
    </>
  );
}
