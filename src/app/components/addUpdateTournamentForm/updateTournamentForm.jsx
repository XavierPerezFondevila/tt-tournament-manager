import { getTournament } from "@/actions/data";
import AddUpdateTournamentForm from "./addUpdateTournamentForm";

export default async function UpdateTournamentForm({ formId }) {
  const data = await getTournament(formId);

  return (
    <>
      {data ? (
        <AddUpdateTournamentForm action="update" tournamentData={data} />
      ) : (
        <div class="empty-text text-center text-secondary">
          No se ha encontrado ningún torneo...
        </div>
      )}
    </>
  );
}
