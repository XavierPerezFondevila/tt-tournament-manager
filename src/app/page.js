import Image from "next/image";
import styles from "./page.css";
import Link from 'next/link';
import { IconAdd } from "@/icons/IconAdd";
import { IconList } from "@/icons/IconList";

export default function Home() {
  return (
    <main className="page-home">
      <Link className="home-link" href="/add-tournament">
        <IconAdd />
        <span className="lbl">Añadir torneo</span>
      </Link>
      <Link className="home-link" href="/list-tournaments">
        <IconList className={styles.icon} />
        <span className="lbl">Ver torneos</span>
      </Link>
    </main>
  );
}
