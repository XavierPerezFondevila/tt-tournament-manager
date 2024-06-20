"use server";
import { sql } from '@vercel/postgres';
import md5 from "md5";
import { unstable_noStore as noStore } from 'next/cache';
import { useFetcher } from 'react-router-dom';


export async function getUser(nick, password) {

    const data = await sql`SELECT nick
    FROM admin
    WHERE nick ILIKE ${`%${nick}%`} and password ILIKE ${md5(password)}`;

    if (data.rows.length) {
        return data.rows[0];
    }

}

export async function createTournament(data) {
    const sqlData = await sql`
    INSERT INTO TORNEOS (nombre, fecha_inicio, num_grupos, plazas_torneo, num_clasificados, ubicacion) 
    VALUES (${data.name}, ${data.date}, ${data.groups}, ${data.participants}, ${data.winnersByGroup}, ${data.location})
    RETURNING id;
  `;
    let parsed = parseReponse(sqlData);
    if (sqlData.rows.length) {
        parsed["id"] = sqlData.rows.shift()?.id;
    }

    return parsed;


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
        const partidosDelete = await sql`DELETE FROM PARTIDOS WHERE ID_TORNEO = ${`${id}`}`;
        const participationDelete = await sql`DELETE FROM PARTICIPACION WHERE ID_TORNEO = ${`${id}`}`;
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
    ubicacion = ${`${data.location}`}
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
        const sqlData = await sql`SELECT J.ID, J.NOMBRE, J.ficha, J.RANKING, P.GRUPO
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
    WHERE J.ficha = ${`${player.ficha}`}`;

    let newPlayerData = null;
    if (playerData.rows.length) {
        newPlayerData = await sql`UPDATE JUGADOR SET 
        nombre = ${`${player.nombre}`},
        ranking = ${`${player.ranking}`}
        WHERE ficha = ${`${player.ficha}`}
        RETURNING id;`;
    } else {
        newPlayerData = await sql`INSERT into JUGADOR (nombre, ficha, ranking) 
        values (${`${player.nombre}`}, ${`${player.ficha}`}, ${`${player.ranking}`})
        RETURNING id`;
    }

    if (newPlayerData.rows.length) {
        const newPlayerId = newPlayerData.rows[0]?.id;
        const newParticipation = await sql`INSERT into participacion (id_torneo, id_jugador) 
        values (${`${tournamentId}`}, ${`${newPlayerId}`})`;

        if (parseReponse(newParticipation)) {
            return { success: true, id: newPlayerId };
        }
    }

    return { success: false };

}

export async function removePlayerFromTournament(player, tournamentId) {
    const sqlData = await sql`DELETE FROM PARTICIPACION 
    WHERE ID_JUGADOR = ${player} AND ID_TORNEO = ${tournamentId}`;

    return parseReponse(sqlData);
}

export async function getGroupPlayers(tournamentId) {
    noStore();
    if (!isNaN(tournamentId) && parseInt(tournamentId) > 0) {
        const sqlData = await sql`SELECT J.id, J.NOMBRE, J.RANKING, P.GRUPO
        FROM JUGADOR J 
        JOIN PARTICIPACION P ON J.id = P.id_jugador
        WHERE P.id_torneo = ${tournamentId}
        ORDER BY P.GRUPO, J.RANKING DESC;`;

        return sqlData.rows;
    }

    return [];
}


export async function getTournamentMatches(tournamentId) {
    if (!isNaN(tournamentId) && parseInt(tournamentId) > 0) {
        const sqlData = await sql`SELECT 
            P.id AS id_partido,
            J1.id AS id_jugador1,
            J1.nombre AS nombre_jugador1,
            J2.id AS id_jugador2,
            J2.nombre AS nombre_jugador2,
            JA.id AS id_arbitro,
            JA.nombre AS nombre_arbitro,
            P.ganador,
            P.resultado_global,
            PR.grupo
        FROM 
            Partidos P
        JOIN 
            Jugador J1 ON P.id_jugador1 = J1.id
        JOIN 
            Jugador J2 ON P.id_jugador2 = J2.id
        JOIN 
            Jugador JA ON P.id_arbitro = JA.id
        JOIN 
            (SELECT id_jugador, grupo 
            FROM Participacion 
            WHERE id_torneo = ${tournamentId} 
            GROUP BY id_jugador, grupo) PR ON J1.id = PR.id_jugador
        WHERE 
            P.id_torneo = ${tournamentId}
        ORDER BY 
            P.id;
        `;
        return sqlData.rows;
    }

    return [];
}

export async function updateMatchResult(globalResult, winner, matchId) {
    const sqlData = await sql`UPDATE partidos SET 
    resultado_global = ${`${globalResult}`},
    ganador = ${`${winner}`}
    WHERE id = ${`${matchId}`};`;

    return parseReponse(sqlData);
}

function parseReponse(response) {
    if (response.rowCount == 1) {
        return { success: true };
    }

    return { success: false };
}