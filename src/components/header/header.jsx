"use client";
import Link from "next/link";
import LoginForm from "./loginForm";
import { Container } from "react-bootstrap";

export default function Header() {
  return (
<div className="app-header mb-4">
        <Container>
            <div className="wrap">
                <Link className="header-link" href="/">Inicio</Link>
                <LoginForm></LoginForm>
            </div>
        </Container>
    </div>
  )
}
