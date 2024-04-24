import React from "react";
import TournamentViewTop from "./tournamentViewTop";
import { getTournament } from "@/actions/data";

export default async function TournamentView({ tournamentId }) {
  const tournamentInfo = await getTournament(tournamentId);

  return <TournamentViewTop tournamentData={tournamentInfo} />;
}
