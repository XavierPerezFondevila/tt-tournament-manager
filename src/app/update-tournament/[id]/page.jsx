import { getTournament } from "@/actions/data";
import AddUpdateTournamentForm from "../../components/addUpdateTournamentForm/addUpdateTournamentForm";
import { Suspense } from "react";
import UpdateTournamentForm from "@/app/components/addUpdateTournamentForm/updateTournamentForm";

export default async function page({ params }) {
  return (
    <>
      <h1 className="title text-center mb-4">Modificar Torneo</h1>
      <Suspense fallback="<div>Cargando</div>">
        <UpdateTournamentForm formId={params.id}></UpdateTournamentForm>
      </Suspense>
    </>
  );
}
