import Image from "next/image";
import styles from "./page.css";
import Link from 'next/link';
import { IconAdd } from "@/icons/IconAdd";
import { IconList } from "@/icons/IconList";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {
  return (
    <main className="page-home">
      <Container>
        <Row className="home-buttons-wrapper">
          <Col xs={6}>
            <Link className="w-100 home-link d-flex flex-column flex-md-row text-center h-100" href="/add-tournament">
              <IconAdd />
              <span className="lbl">Añadir torneo</span>
            </Link>
          </Col>
          <Col xs={6}>
            <Link className="w-100 home-link d-flex flex-column flex-md-row text-center h-100" href="/list-tournaments">
              <IconList className={styles.icon} />
              <span className="lbl">Ver torneos</span>
            </Link>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
