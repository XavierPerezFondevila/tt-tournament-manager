export default function TournamentViewTop({ tournamentData }) {
  return (
    <div className="tournament-top mb-4">
      <div>
        <strong>Nombre del torneo: </strong>
        {tournamentData.nombre}
      </div>
      <div>
        <strong>Fecha del torneo: </strong>
        {tournamentData.fecha_inicio.toLocaleDateString()}
      </div>
      <div>
        <strong>Número de grupos: </strong>
        {tournamentData.num_grupos}
      </div>
      <div>
        <strong>Plazas del torneo: </strong>
        {tournamentData.plazas_torneo}
      </div>
      <div>
        <strong>Numero de clasificados por grupos: </strong>
        {tournamentData.num_clasificados}
      </div>
      <div>
        <strong>Modalidad: </strong>
        {tournamentData.modalidad.toLowerCase()}
      </div>
    </div>
  );
}
