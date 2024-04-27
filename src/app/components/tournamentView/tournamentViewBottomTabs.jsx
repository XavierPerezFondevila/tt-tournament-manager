"use client";

import TournamentGroupsGenerator from "./tournamentGroupsGenerator";
import TournamentPlayersTable from "./tournamentPlayersTable";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function TournamentViewBottomTabs({
  tournamentPlayers,
  tournamentData,
}) {
  return (
    <>
      <Tabs
        defaultActiveKey="table"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="table" title="Jugadores">
          <TournamentPlayersTable
            players={tournamentPlayers}
            tournamentData={tournamentData}
          />
        </Tab>
        <Tab eventKey="grupos" title="Grupos">
          Aquí van los grupos
        </Tab>
        <Tab eventKey="finalPhase" title="Fase final">
          Aqui van los partidos de la fase final
        </Tab>
      </Tabs>
    </>
  );
}
