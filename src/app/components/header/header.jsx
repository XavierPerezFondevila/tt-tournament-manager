"use client";
import Link from "next/link";
import LoginForm from "./loginForm";
import { Container, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="app-header mb-4">
      <Container>
        <Row>
          <div className="wrap">
            <Link className="header-link" href="/">
              Inicio
            </Link>
            <LoginForm></LoginForm>
          </div>
        </Row>
      </Container>
    </div>
  );
}
