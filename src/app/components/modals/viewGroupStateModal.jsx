import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IconSuccess } from "@/icons/iconSuccess";
import { setPlayerQualified } from "@/actions/data";

export default function ViewGroupStateModal(props) {
  const [orderedPlayers, setOrderedPlayers] = useState([]);

  // Update orderedPlayers if props.standings change
  useEffect(() => {
    if (props.standings) {
      setOrderedPlayers(props.standings);
    }
  }, [props.standings]);

  const updatePlayerQualification = async (isQualified, player) => {
    const result = await setPlayerQualified(
      isQualified,
      player.id,
      props.tournamentid
    );

    if (result.success) {
      // Update the player object in orderedPlayers
      const updatedPlayers = orderedPlayers.map((p) =>
        p.id === player.id ? { ...p, clasificado: isQualified } : p
      );

      setOrderedPlayers(updatedPlayers); // Update orderedPlayers state
      props.onHide(true, updatedPlayers); // Notify parent component
    }
  };

  return (
    <Modal
      className="standing-modal"
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Clasificación grupo - {props.groupkey}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <table className="table bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Partidos ganados</th>
                <th>Sets ganados</th>
                <th>Sets perdidos</th>
                <th>Coeficiente</th>
                <th>Puntos ganados</th>
                <th>Puntos Perdidos</th>
                <th>Clasificado</th>
              </tr>
            </thead>
            <tbody>
              {orderedPlayers.map((standingPlayer, index) => (
                <tr key={"standing-player-" + index}>
                  <td>{index + 1}</td>
                  <td>{standingPlayer.nombre}</td>
                  <td>{standingPlayer.partidasGanadas}</td>
                  <td>{standingPlayer.setsGanados}</td>
                  <td>{standingPlayer.setsPerdidos}</td>
                  <td>{standingPlayer.coeficiente}</td>
                  <td>{standingPlayer.puntosGanados}</td>
                  <td>{standingPlayer.puntosPerdidos}</td>
                  <td>
                    {standingPlayer.clasificado ? (
                      <div className="inset d-flex align-items-center gap-2">
                        <span className="lbl">Sí</span>
                        <Button
                          variant="danger"
                          className="d-flex align-items-center gap-2"
                          onClick={() => {
                            updatePlayerQualification(false, standingPlayer);
                          }}
                        >
                          <span>Desclasificar</span> <IconSuccess />
                        </Button>
                      </div>
                    ) : (
                      <div className="inset d-flex align-items-center gap-2">
                        <span className="lbl">No</span>
                        <Button
                          variant="success"
                          className="d-flex align-items-center gap-2"
                          onClick={() => {
                            updatePlayerQualification(true, standingPlayer);
                          }}
                        >
                          <span>Clasificar</span>
                          <IconSuccess />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
