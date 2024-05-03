"use client";

import TournamentPlayersTable from "./tournamentPlayersTable";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useEffect, useState } from "react";
import TournamentGroupsTable from "./tournamentGroupsTable";
import { useSearchParams } from "next/navigation";

export default function TournamentViewBottomTabs({
  tournamentPlayers,
  tournamentData,
  tournamentMatches,
  groupPlayers,
}) {
  const searchParams = useSearchParams();
  let defaultKey = searchParams.get("q") || "table";
  if (!["table", "grupos", "finalPhase"].includes(defaultKey)) {
    defaultKey = "table";
  }

  return (
    <>
      <Tabs
        defaultActiveKey={defaultKey}
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
          <TournamentGroupsTable
            groupPlayers={groupPlayers}
            matches={tournamentMatches}
          />
        </Tab>
        <Tab eventKey="finalPhase" title="Fase final">
          Aqui van los partidos de la fase final
        </Tab>
      </Tabs>
    </>
  );
}
