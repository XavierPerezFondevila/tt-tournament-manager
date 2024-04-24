import { getTournamentPlayers } from "@/actions/data";
import TournamentPlayersTable from "./tournamentPlayersTable";

export default async function TournamentViewBottom({ tournamentId }) {
  console.log(tournamentId);
  const tournamentPlayers = await getTournamentPlayers(tournamentId);

  return (
    <TournamentPlayersTable
      players={tournamentPlayers}
      tournamentId={tournamentId}
    />
  );
}
