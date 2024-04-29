import AddUpdateTournamentForm from "../components/addUpdateTournamentForm/addUpdateTournamentForm";

export default function Page() {
  return (
    <>
      <h1 className="title text-center mb-4">Añadir Torneo</h1>
      <AddUpdateTournamentForm action="add"></AddUpdateTournamentForm>;
    </>
  );
}
