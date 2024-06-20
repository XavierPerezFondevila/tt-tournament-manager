"use client";

import { Modal } from "react-bootstrap";
import "./styles.css";

export default function ViewGroupStateModal(props) {
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
                <th>Coeficiente</th>{" "}
                {/* Fixed capitalization of "Coeficiente" */}
              </tr>
            </thead>
            <tbody>
              {props.standings.map((standingPlayer, index) => (
                <tr key={"standing-player-" + index}>
                  <td>{index + 1}</td>
                  <td>{standingPlayer.nombre}</td>
                  <td>{standingPlayer.partidasGanadas}</td>{" "}
                  <td>{standingPlayer.setsGanados}</td>
                  <td>{standingPlayer.setsPerdidos}</td>
                  <td>{standingPlayer.coeficiente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
