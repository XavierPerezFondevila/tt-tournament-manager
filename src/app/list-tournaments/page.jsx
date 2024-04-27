import React, { Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import List from "../components/tournamentList/listGrid";

export default async function Page() {
  return (
    <>
      <Suspense fallback="Cargando ...">
        <List />
      </Suspense>
    </>
  );
}
