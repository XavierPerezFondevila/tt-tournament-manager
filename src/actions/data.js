"use server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import md5 from "md5";


export async function getUser(nick, password) {

    const data = await sql`SELECT nick
    FROM admin
    WHERE nick ILIKE ${`%${nick}%`} and password ILIKE ${md5(password)}`;

    if (data.rows.length) {
        return data.rows[0];
    }

}

export async function createTournament(data) {
    const sqlData = await sql`INSERT into TORNEOS (nombre, fecha_inicio, num_grupos, plazas_torneo, ubicacion, modalidad) 
    values (${`${data.name}`}, ${`${data.date}`}, ${`${data.groups}`}, ${`${data.participants}`}, ${`${data.location}`}, ${`${data.mode}`})`;

    return sqlData;
}

export async function getAllTournaments() {
    noStore();
    const sqlData = await sql`SELECT *
    FROM torneos`;

    if (sqlData.rows.length) {
        return sqlData.rows;
    }

    return [];
}