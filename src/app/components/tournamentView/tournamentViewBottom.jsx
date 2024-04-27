import { getTournament, getTournamentPlayers } from "@/actions/data";
import TournamentViewBottomTabs from "./tournamentViewBottomTabs";
import { Suspense } from "react";

export default async function TournamentViewBottom({ tournamentId }) {
  const tournamentPlayers = await getTournamentPlayers(tournamentId);
  const tournamentData = await getTournament(tournamentId);

  return (
    <>
      <TournamentViewBottomTabs
        tournamentPlayers={tournamentPlayers}
        tournamentData={tournamentData}
      />
    </>
  );
}
