"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./styles.css";
import { Col, Row } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { createTournament, updateTournament } from "@/actions/data";
import Moment from "moment";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS file

export default function AddUpdateTournamentForm({ action, tournamentData }) {
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const submitBtn = ev.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const formData = new FormData(ev.target);

    const filteredFormData = {
      name: formData.get("tournamentName"),
      date: formData.get("tournamentDate"),
      groups: formData.get("tournamentGroups"),
      participants: formData.get("tournamentParticipants"),
      location: formData.get("tournamentPlace"),
      winnersByGroup: formData.get("tournamentWinners"),
      mode: formData.get("torunamentMode")?.toUpperCase(),
      id: tournamentData?.id ?? 0,
    };

    let response = undefined;
    if (action === "add") {
      response = await createTournament(filteredFormData);
      // console.log(response?.id);
      if (response?.success) {
        toast.success("Torneo creado Correctamente");
      } else {
        toast.error("Ha habido un error en la creación del torneo");
      }
      setTimeout(() => {
        window.location.href = `${window.location.origin}/tournament/${response?.id}`;
      }, 2000);
    } else if (action === "update") {
      response = await updateTournament(filteredFormData);
      if (response?.success) {
        toast.success("Modificado Correctamente");
        setTimeout(() => {
          window.location.href = `${window.location.origin}/tournament/${tournamentData?.id}`;
        }, 2000);
      } else {
        toast.error("Ha habido un error en la modificación del torneo");
      }
      submitBtn.disabled = false;
    }
  };

  return (
    <>
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
      <div className="form-wrapper">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="tournamentName">
                <Form.Label>Nombre del torneo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Open X"
                  name="tournamentName"
                  defaultValue={tournamentData && tournamentData.nombre}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="tournamentDate">
                <Form.Label>Fecha del torneo</Form.Label>
                <Form.Control
                  type="date"
                  name="tournamentDate"
                  defaultValue={
                    tournamentData &&
                    Moment(tournamentData.fecha_inicio).format("yyyy-MM-DD")
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3" controlId="tournamentGroups">
                <Form.Label>Número de grupos</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  name="tournamentGroups"
                  defaultValue={tournamentData && tournamentData.num_grupos}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3" controlId="tournamentParticipants">
                <Form.Label>Tamaño del torneo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  name="tournamentParticipants"
                  defaultValue={tournamentData && tournamentData.plazas_torneo}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3" controlId="tournamentWinners">
                <Form.Label>Nº Clasificados por grupo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  name="tournamentWinners"
                  defaultValue={
                    tournamentData && tournamentData.num_clasificados
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-3" controlId="tournamentPlace">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="La Torre de Claramunt"
                  name="tournamentPlace"
                  defaultValue={tournamentData && tournamentData.ubicacion}
                />
              </Form.Group>
            </Col>
            {/* <Col xs={12}>
              <Form.Group className="mb-3" controlId="torunamentMode">
                <Form.Label>Modo del torneo</Form.Label>
                <Form.Select
                  name="torunamentMode"
                  defaultValue={tournamentData && tournamentData.modalidad}
                >
                  <option disabled>
                    Selecciona el modo del torneo (individual/singular)
                  </option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="DOBLES">Dobles</option>
                </Form.Select>
              </Form.Group>
            </Col> */}
            <Col xs={12} className="d-flex justify-content-center">
              <div className="wrapper col-12 col-md-6">
                <Button
                  variant="primary"
                  type="submit"
                  className="text-center w-100 mt-4"
                >
                  {action === "add" ? "Crear torneo" : "Modificar Torneo"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
