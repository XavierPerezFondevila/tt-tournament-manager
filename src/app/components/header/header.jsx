"use client";
import Link from "next/link";
import LoginForm from "./loginForm";
import { Container, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { isPdfPage } from "@/actions/utils";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const isPdf = isPdfPage(pathname);

  return (
    <div className={clsx("app-header", "mb-4", isPdf && "d-none")}>
      <Container>
        <Row>
          <div className="wrap justify-content-center">
            <Link className="header-link" href="/">
              <Image
                width={60}
                height={60}
                src="/logo.png"
                alt="logo"
                className="img-fluid"
              />
            </Link>
            {/* <LoginForm></LoginForm> */}
          </div>
        </Row>
      </Container>
    </div>
  );
}
