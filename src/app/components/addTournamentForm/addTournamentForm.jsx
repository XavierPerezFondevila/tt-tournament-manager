"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./styles.css";
import { Col, Container, Row } from "react-bootstrap";
import { createTournament } from "@/actions/data";

export default function AddTournamentForm() {
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const filteredFormData = {
      name: formData.get("tournamentName"),
      date: formData.get("tournamentDate"),
      groups: formData.get("tournamentGroups"),
      participants: formData.get("tournamentParticipants"),
      location: formData.get("tournamentPlace"),
      winnersByGroup: formData.get("tournamentWinners"),
      mode: formData.get("torunamentMode")?.toUpperCase(),
    };

    const response = await createTournament(filteredFormData);
  };

  return (
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
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="tournamentDate">
              <Form.Label>Fecha del torneo</Form.Label>
              <Form.Control type="date" name="tournamentDate" />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group className="mb-3" controlId="tournamentGroups">
              <Form.Label>Número de grupos</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                name="tournamentGroups"
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
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="torunamentMode">
              <Form.Label>Modo del torneo</Form.Label>
              <Form.Select name="torunamentMode">
                <option>
                  Selecciona el modo del torneo (individual/singular)
                </option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="DOBLES">Dobles</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} className="d-flex justify-content-center">
            <div className="wrapper col-12 col-md-6">
              <Button
                variant="primary"
                type="submit"
                className="text-center w-100 mt-4"
              >
                Crear torneo
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
