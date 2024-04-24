"use client";

import { addPlayerToTournament } from "@/actions/data";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import "./styles.css";

export default function TournamentPlayersTable({ players, tournamentId }) {
  const handleRequest = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);

    const newPlayer = {
      nombre: formData.get("playerName"),
      email: formData.get("playerEmail"),
      movil: formData.get("playerPhone"),
      ranking: formData.get("playerRanking"),
    };

    const result = await addPlayerToTournament(newPlayer, tournamentId);
  };

  const removePlayer = async (id) => {
    // DELETE FROM DATABASE
    // WHEN DELETED DELETE FROM TABLE ROW
  };

  return (
    <Form onSubmit={handleRequest} className="tournament-table-form">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ranking</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.nombre}</td>
              <td>{player.email}</td>
              <td>{player.movil}</td>
              <td>{player.ranking}</td>
              <td>
                <Button
                  variant="danger"
                  type="button"
                  className="text-center"
                  onClick={() => {
                    removePlayer(player.id);
                  }}
                >
                  Eliminar Jugador
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <Form.Group controlId="playerName">
                <Form.Control
                  type="text"
                  placeholder="Adrián Sánchez"
                  name="playerName"
                />
              </Form.Group>
            </td>
            <td>
              <Form.Group controlId="playerEmail">
                <Form.Control
                  type="text"
                  placeholder="adri.sanchez@gmail.com"
                  name="playerEmail"
                />
              </Form.Group>
            </td>
            <td>
              <Form.Group controlId="playerPhone">
                <Form.Control
                  type="text"
                  placeholder="666555444"
                  name="playerPhone"
                />
              </Form.Group>
            </td>
            <td>
              <Form.Group controlId="playerRanking">
                <Form.Control
                  type="number"
                  placeholder="1000"
                  name="playerRanking"
                />
              </Form.Group>
            </td>
            <td>
              <Button variant="primary" type="submit" className="text-center">
                Añadir Jugador
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Form>
  );
}
