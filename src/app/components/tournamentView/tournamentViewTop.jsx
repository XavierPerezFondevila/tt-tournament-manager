export default function TournamentViewTop({ tournamentData }) {
  console.log(tournamentData);
  return (
    <div className="tournament-top mb-4">
      <div>Nombre del torneo: {tournamentData.nombre}</div>
      <div>
        Fecha del torneo: {tournamentData.fecha_inicio.toLocaleDateString()}
      </div>
      <div>Numero de grupos: {tournamentData.num_grupos}</div>
      <div>
        Numero de clasificados por grupos: {tournamentData.num_clasificados}
      </div>
      <div>Modalidad: {tournamentData.modalidad.toLowerCase()}</div>
    </div>
  );
}
