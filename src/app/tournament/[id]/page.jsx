import TournamentView from "@/app/components/tournamentView/tournamentView";
import TournamentViewBottom from "@/app/components/tournamentView/tournamentViewBottom";
import { Suspense } from "react";

export default async function page({ params }) {
  return (
    <>
      <h1 className="title text-center mb-4">Datos del torneo</h1>
      <Suspense fallback={`Cargando...`}>
        <TournamentView tournamentId={params.id} />
        <TournamentViewBottom tournamentId={params.id} />
      </Suspense>
    </>
  );
}
