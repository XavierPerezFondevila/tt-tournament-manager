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
    const sqlData = await sql`INSERT into TORNEOS (nombre, fecha_inicio, num_grupos, plazas_torneo, num_clasificados, ubicacion, modalidad) 
    values (${`${data.name}`}, ${`${data.date}`}, ${`${data.groups}`}, ${`${data.participants}`}, ${`${data.winnersByGroup}`}, ${`${data.location}`}, ${`${data.mode}`})`;

    return parseReponse(sqlData);
}


export async function getTournament(id) {
    noStore();
    if (!isNaN(id) && parseInt(id) > 0) {
        const sqlData = await sql`SELECT * FROM TORNEOS WHERE ID = ${`${id}`}`;
        if (sqlData.rows.length) {
            return sqlData.rows[0];
        }
    }


    return null;
}

export async function deleteTournament(id) {
    noStore();
    if (!isNaN(id) && parseInt(id) > 0) {
        const sqlData = await sql`DELETE FROM TORNEOS WHERE ID = ${`${id}`}`;
        if (sqlData.rowCount === 1) {
            return { success: true };
        }
    }


    return { success: false };
}

export async function updateTournament(data) {
    const sqlData = await sql`UPDATE TORNEOS SET 
    nombre = ${`${data.name}`}, 
    fecha_inicio = ${`${data.date}`}, 
    num_grupos = ${`${data.groups}`}, 
    plazas_torneo = ${`${data.participants}`}, 
    num_clasificados = ${`${data.winnersByGroup}`}, 
    ubicacion = ${`${data.location}`}, 
    modalidad = ${`${data.mode}`}
    WHERE id = ${`${data.id}`};`;

    return parseReponse(sqlData);
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

export async function getTournamentPlayers(id) {
    noStore();
    if (!isNaN(id) && parseInt(id) > 0) {
        const sqlData = await sql`SELECT J.ID, J.NOMBRE, J.EMAIL, J.MOVIL, J.RANKING
        FROM JUGADOR J
        JOIN PARTICIPACION P ON J.ID = P.ID_JUGADOR
        WHERE P.ID_TORNEO = ${`${id}`}
        ORDER BY J.RANKING DESC`;

        return sqlData.rows;
    }


    return null;
}

export async function addPlayerToTournament(player, tournamentId) {

    const playerData = await sql`SELECT ID
    FROM JUGADOR J
    WHERE J.EMAIL = ${`${player.email}`}`;

    let newPlayerData = null;
    if (playerData.rows.length) {
        newPlayerData = await sql`UPDATE JUGADOR SET 
        nombre = ${`${player.nombre}`},
        movil = ${`${player.movil}`},
        ranking = ${`${player.ranking}`}
        WHERE email = ${`${player.email}`}
        RETURNING id;`;
    } else {
        newPlayerData = await sql`INSERT into JUGADOR (nombre, email, movil, ranking) 
        values (${`${player.nombre}`}, ${`${player.email}`}, ${`${player.movil}`}, ${`${player.ranking}`})
        RETURNING id`;
    }

    if (newPlayerData.rows.length) {
        const newPlayerId = newPlayerData.rows[0]?.id;
        const newParticipation = await sql`INSERT into participacion (id_torneo, id_jugador) 
        values (${`${tournamentId}`}, ${`${newPlayerId}`})`;

        return parseReponse(newParticipation);
    }

    return { success: false }

}

function parseReponse(response) {
    if (response.rowCount == 1) {
        return { success: true };
    }

    return { success: false };
}