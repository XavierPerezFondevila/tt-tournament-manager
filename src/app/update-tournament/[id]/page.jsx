import { Suspense } from "react";
import UpdateTournamentForm from "@/app/components/addUpdateTournamentForm/updateTournamentForm";

export default async function page({ params }) {
  return (
    <>
      <h1 className="title text-center mb-4">Modificar Torneo</h1>
      <Suspense fallback="Cargando...">
        <UpdateTournamentForm formId={params.id}></UpdateTournamentForm>
      </Suspense>
    </>
  );
}
