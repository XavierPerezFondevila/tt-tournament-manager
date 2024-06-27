"use client";

import { updateMatchResult } from "@/actions/data";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./styles.css";
import { getMatchWinner } from "@/actions/tournament";

export default function AddResultModal(props) {
  const setResult = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let error = false;

    const results = [
      `${formData.get("resultado1_1") || 0}-${
        formData.get("resultado2_1") || 0
      }`,
      `${formData.get("resultado1_2") || 0}-${
        formData.get("resultado2_2") || 0
      }`,
      `${formData.get("resultado1_3") || 0}-${
        formData.get("resultado2_3") || 0
      }`,
      `${formData.get("resultado1_4") || 0}-${
        formData.get("resultado2_4") || 0
      }`,
      `${formData.get("resultado1_5") || 0}-${
        formData.get("resultado2_5") || 0
      }`,
    ];

    const playerResults = [
      { id_jugador: props.selectedmatch.id_jugador1, result: 0 },
      { id_jugador: props.selectedmatch.id_jugador2, result: 0 },
    ];

    results.forEach((result) => {
      const filteredResult = result.split("-");
      if (filteredResult[0] - filteredResult[1] > 0) {
        playerResults[0].result++;
      } else if (filteredResult[0] - filteredResult[1] < 0) {
        playerResults[1].result++;
      }
    });

    error =
      playerResults.filter((playerResult) => playerResult.result < 2).length ==
      2;

    if (!error) {
      const matchPoints = results.join(",");
      const globalResult = playerResults
        .map((playerResult) => playerResult.result)
        .join("-");

      let maxResult = -1;
      let idJugadorWithMaxResult = null;

      for (const player of playerResults) {
        if (player.result > maxResult) {
          maxResult = player.result;
          idJugadorWithMaxResult = player.id_jugador;
        }
      }

      props.selectedmatch.resultado = matchPoints;
      props.selectedmatch.resultado_global = globalResult;
      props.selectedmatch.ganador = idJugadorWithMaxResult;

      const result = await updateMatchResult(
        matchPoints,
        globalResult,
        idJugadorWithMaxResult,
        props.selectedmatch.id_partido
      );

      if (result.success) {
        props.onHide();
      }
    }
  };

  return (
    <Modal
      id="result-modal"
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          {props.selectedmatch.nombre_jugador1} -{" "}
          {props.selectedmatch.nombre_jugador2}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={setResult}>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <td className="align-middle text-center"></td>
                  <td className="align-middle text-center">
                    1r <br />
                    JUEGO
                  </td>
                  <td className="align-middle text-center">
                    2ndo <br /> JUEGO
                  </td>
                  <td className="align-middle text-center">
                    3r <br /> JUEGO
                  </td>
                  <td className="align-middle text-center">
                    4to <br /> JUEGO
                  </td>
                  <td className="align-middle text-center">
                    5to <br /> JUEGO
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="align-middle text-center text-truncate">
                    {props.selectedmatch.nombre_jugador1}
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_1">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado1_1"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_2">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado1_2"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_3">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado1_3"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_4">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado1_4"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_5">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado1_5"
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle text-center text-truncate">
                    {props.selectedmatch.nombre_jugador2}
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado1_1">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado2_1"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado2_2">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado2_2"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado2_3">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado2_3"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado2_4">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado2_4"
                      />
                    </Form.Group>
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group controlId="resultado2_5">
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="0"
                        name="resultado2_5"
                      />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="text-end pt-4 border-0">
                    <Button variant="primary" type="submit">
                      Guardar resultado
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
