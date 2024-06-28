"use client";

import { deleteTournament } from "@/actions/data";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS file

export default function List({ tournament }) {
  const deleteTournamentAction = async (ev, id) => {
    const response = await deleteTournament(id);
    // eliminar el nodo del html :)
    if (response.success) {
      document.querySelector(`.wrap:has(button[id="${ev.target.id}"]`).remove();
      toast.success("Eliminado Correctamente");
    } else {
      toast.error("Ha habido un error al eliminar el torneo");
    }
  };

  return (
    <div className="wrap p-2 border mt-4">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      <div className="tournament-info">
        <div className="top-info d-flex gap-1 gap-md-2">
          <div className="name">{tournament.nombre}</div>
          <div className="date">
            Fecha inicio: {tournament.fecha_inicio.toLocaleDateString()}
          </div>
        </div>
        <div className="num-info d-flex gap-1 gap-md-2">
          <div className="groups-num">Plazas: {tournament.plazas_torneo}</div>
          <div className="participants-num">
            Grupos: {tournament.num_grupos}
          </div>
        </div>
        <div className="place">Ubicación: {tournament.ubicacion}</div>
      </div>
      <Row className="action-buttons mt-3 mx-0 w-100">
        <Col xs={12} md={4} className="px-0 px-md-1 my-1 my-md-0">
          <Link
            className="btn btn-success edit-btn w-100"
            href={`/update-tournament/${tournament.id}`}
          >
            Editar
          </Link>
        </Col>
        <Col xs={12} md={4} className="px-0 px-md-1 my-1 my-md-0">
          <Link
            className="btn btn-primary w-100"
            href={`/tournament/${tournament.id}`}
          >
            Ver torneo
          </Link>
        </Col>
        {/* <Col xs={12} md={4} className="px-0 px-md-1 my-1 my-md-0">
          <Button
            id={"tournament" + tournament.id}
            variant="danger"
            className="remove-btn w-100"
            onClick={(ev) => {
              deleteTournamentAction(ev, tournament.id);
            }}
          >
            Eliminar
          </Button>
        </Col>  */}
      </Row>
    </div>
  );
}
