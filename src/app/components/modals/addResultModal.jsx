"use client";

import { updateMatchResult } from "@/actions/data";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "./styles.css";
import { getMatchWinner } from "@/actions/tournament";

export default function AddResultModal(props) {
  const setResult = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const result = [
      formData.get("resultado1_1") || 0,
      formData.get("resultado2_1") || 0,
    ];

    const matchWinner = await getMatchWinner(props.selectedmatch, result);

    props.selectedmatch.resultado_global = matchWinner.resultado_global;
    props.selectedmatch.ganador = matchWinner.ganador;

    const matchResult = await updateMatchResult(
      matchWinner.resultado_global,
      matchWinner.ganador,
      props.selectedmatch.id_partido
    );

    if (matchResult.success) {
      props.onHide();
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
          <div className="table-responsive" style={{ margin: "auto" }}>
            <Table>
              <tbody>
                <tr>
                  <td className="align-middle text-center text-truncate">
                    {props.selectedmatch.nombre_jugador1}
                  </td>
                  <td className="align-middle text-center">
                    <Form.Group
                      controlId="resultado1_1"
                      style={{ maxWidth: "100px" }}
                    >
                      <Form.Control type="number" min={0} name="resultado1_1" />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle text-center text-truncate border-0">
                    {props.selectedmatch.nombre_jugador2}
                  </td>
                  <td className="align-middle text-center border-0">
                    <Form.Group
                      controlId="resultado1_1"
                      style={{ maxWidth: "100px" }}
                    >
                      <Form.Control type="number" min={0} name="resultado2_1" />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="text-end pt-4 border-0">
                    <div className="btn-wrapper d-flex justify-content-center">
                      <Button variant="primary" type="submit">
                        Guardar resultado
                      </Button>
                    </div>
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
