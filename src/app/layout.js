import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container } from "react-bootstrap";
import Header from "./components/header/header";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "CTT la Torre | Creador de torneos",
  description: "Torneos de CTT LA TORRE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header></Header>
        <div className="page-content">
          <Container>
            {children}
          </Container>
        </div>
      </body>
    </html>
  );
}
