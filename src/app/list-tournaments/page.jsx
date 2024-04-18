import React, { Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import List from "../components/tournaments/listGrid";

export default async function Page() {
  return (
    <>
      <Suspense fallback={<div>Cargando ...</div>}>
        <List />
      </Suspense>
    </>
  );
}
