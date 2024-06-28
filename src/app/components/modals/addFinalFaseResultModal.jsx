"use client";

import {
  addOrUpdateNewFinalFaseMatch,
  updateFinalFaseMatchResult,
} from "@/actions/data";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./styles.css";

export default function AddFinalFaseResultModal(props) {
  const setResult = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);

    const results = [
      `${formData.get("resultado1_1") || 0}-${
        formData.get("resultado2_1") || 0
      }`,
    ];

    let idWinner = props.selectedmatch.id_jugador1;
    const globalResult = results.join("-");

    if (results[1] > results[0]) {
      idWinner = selectedmatch.id_jugador2;
    }
    props.selectedmatch.resultado_global = globalResult;
    props.selectedmatch.ganador = idWinner;

    let result = await updateFinalFaseMatchResult(
      props.selectedmatch.id_partido,
      idWinner,
      globalResult
    );

    if (result.success) {
      const nextRound = props.selectedmatch.num_ronda / 2;
      const oldMatchNumber = props.selectedmatch.orden_partido;

      result = await addOrUpdateNewFinalFaseMatch(
        props.tournamentid,
        idWinner,
        nextRound,
        oldMatchNumber
      );

      if (result.success) {
        props.onHide();
      }
    }
  };

  return (
    <Modal
      id="final-fase-result-modal"
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
                  <td className="align-middle text-center"></td>
                  <td className="align-middle text-center"></td>
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
