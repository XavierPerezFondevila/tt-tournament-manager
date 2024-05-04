import { getTournamentMatches, getTournamentPlayers } from "@/actions/data";
import { getMatchesByGroup, getSortedByGroupsPlayers } from "@/actions/utils";
import TournamentGroupMatchesTable from "@/app/components/tournamentView/tournamentGroupMatchesTable";
import TournamentGroupTable from "@/app/components/tournamentView/tournamentGroupTable";
import { Suspense } from "react";

export default async function TournamentGroup({ params }) {
  const tournamentPlayers = await getTournamentPlayers(params.id);
  const tournamentMatches = await getTournamentMatches(params.id);

  return (
    <div className="mt-2">
      <Suspense fallback="cargando...">
        <TournamentGroupTable
          groupPlayers={tournamentPlayers}
          groupKey={params.key}
        />
        <TournamentGroupMatchesTable
          matches={tournamentMatches}
          groupKey={params.key}
          tournamentPlayers={tournamentPlayers}
        />
      </Suspense>
    </div>
  );
}
