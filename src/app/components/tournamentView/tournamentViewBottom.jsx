import {
  getGroupPlayers,
  getTournament,
  getTournamentMatches,
  getTournamentPlayers,
} from "@/actions/data";
import TournamentViewBottomTabs from "./tournamentViewBottomTabs";
import { Suspense } from "react";

export default async function TournamentViewBottom({ tournamentId }) {
  const tournamentPlayers = await getTournamentPlayers(tournamentId);
  const tournamentData = await getTournament(tournamentId);
  const groupPlayers = await getGroupPlayers(tournamentId);
  const tournamentMatches = await getTournamentMatches(tournamentId);

  return (
    <>
      <TournamentViewBottomTabs
        tournamentPlayers={tournamentPlayers}
        tournamentData={tournamentData}
        groupPlayers={groupPlayers}
        tournamentMatches={tournamentMatches}
      />
    </>
  );
}
