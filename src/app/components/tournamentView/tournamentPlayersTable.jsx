"use client";
import { useState } from "react";
import {
  addPlayerToTournament,
  removePlayerFromTournament,
} from "@/actions/data";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import "./styles.css";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS file
import { updateTableOrderNums } from "@/actions/utils";
import TournamentGroupsGenerator from "./tournamentGroupsGenerator";

export default function TournamentPlayersTable({ players, tournamentData }) {
  const [currentPlayers, setCurrentPlayers] = useState(players);

  const handleRequest = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);

    const newPlayer = {
      nombre: formData.get("playerName"),
      ficha: formData.get("playerFicha") || Date.now() + "-ficha",
      ranking: formData.get("playerRanking"),
    };

    const isValidUser = !Object.values(newPlayer).some(
      (val) => val.length === 0
    );
    if (isValidUser) {
      // insert into table
      const result = await addPlayerToTournament(newPlayer, tournamentData.id);
      if (result.success) {
        toast.success("Añadido correctamente");
        // update count
        newPlayer["id"] = result.id;
        setCurrentPlayers(
          [...currentPlayers, newPlayer].sort((a, b) => b.ranking - a.ranking)
        );
        updateTableOrderNums(document.querySelector(".table"));
        // insert into table
      } else {
        toast.error("No se ha podido añadir este jugador al torneo");
      }
    }
  };

  const removePlayer = async (playerId) => {
    // DELETE FROM DATABASE
    const result = await removePlayerFromTournament(
      playerId,
      tournamentData.id
    );
    // WHEN DELETED DELETE FROM TABLE ROW
    if (result.success) {
      // show alert
      toast.success("Se ha eliminado el jugador seleccionado correctamente");
      setCurrentPlayers(
        currentPlayers.filter((player) => player.id !== playerId)
      );
    } else {
      toast.error("No se ha podido eliminar el jugador seleccionado");
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
      <Form onSubmit={handleRequest} className="tournament-table-form">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Ranking</th>
              <th>Num. Ficha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player, index) => (
              <tr key={index} className={`player-${player.id}`}>
                <td className="player-num">{index + 1}</td>
                <td>{player.nombre}</td>
                <td>{player.ranking}</td>
                <td>
                  {player.ficha.includes("-ficha") ? "N/A" : player.ficha}
                </td>
                <td>
                  <Button
                    variant="danger"
                    type="button"
                    className="text-center w-100"
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
          {currentPlayers.length < tournamentData.plazas_torneo && (
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
                  <Form.Group controlId="playerRanking">
                    <Form.Control
                      type="number"
                      placeholder="1000"
                      name="playerRanking"
                    />
                  </Form.Group>
                </td>
                <td>
                  <Form.Group controlId="playerFicha">
                    <Form.Control
                      type="text"
                      placeholder="8373"
                      name="playerFicha"
                    />
                  </Form.Group>
                </td>
                <td>
                  <Button
                    variant="success"
                    type="submit"
                    className="text-center w-100"
                  >
                    Añadir Jugador
                  </Button>
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </Form>
      {currentPlayers.length !== 0 && (
        <TournamentGroupsGenerator
          players={currentPlayers}
          tournamentData={tournamentData}
        />
      )}
    </>
  );
}
