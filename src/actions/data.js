"use server";
import { sql } from '@vercel/postgres';
import md5 from "md5";
import { unstable_noStore as noStore } from 'next/cache';
import { useFetcher } from 'react-router-dom';


export async function setPlayerQualified(isQualified, playerId, tournamentId) {
    const sqlData = await sql`UPDATE PARTICIPACION SET 
    CLASIFICADO = ${`${isQualified}`}
    WHERE ID_JUGADOR = ${playerId} AND ID_TORNEO = ${tournamentId}`;

    return parseReponse(sqlData);
}

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
        const sqlData = await sql`SELECT J.ID, J.NOMBRE, J.ficha, J.RANKING, P.GRUPO, P.CLASIFICADO
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
        const sqlData = await sql`SELECT J.id, J.NOMBRE, J.RANKING, P.GRUPO, P.CLASIFICADO
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
            P.resultado,
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

export async function getFinalPhaseMatches(tournamentId) {
    if (!isNaN(tournamentId) && parseInt(tournamentId) > 0) {
        const sqlData = await sql`SELECT 
            P.id AS id_partido,
            J1.id AS id_jugador1,
            J1.nombre AS nombre_jugador1,
            J2.id AS id_jugador2,
            J2.nombre AS nombre_jugador2,
            P.ganador,
            P.resultado_global,
            P.orden_partido,
            P.num_ronda
        FROM 
            partidos_fase_final P
        LEFT JOIN 
            Jugador J1 ON P.id_jugador1 = J1.id
        LEFT JOIN 
            Jugador J2 ON P.id_jugador2 = J2.id
        WHERE 
            P.id_torneo = ${tournamentId}
        ORDER BY 
            P.orden_partido, P.num_ronda ASC;
        `;
        return sqlData.rows;
    }

    return [];
}

export async function addOrUpdateNewFinalFaseMatch(tournamentId, idWinner, nextRound, oldMatchNumber) {
    const ordenPartido = Math.round(oldMatchNumber % 2 == 0 ? (oldMatchNumber / 2) : ((oldMatchNumber + 1) / 2));

    if (nextRound < 1) {
        return null;
    }


    const sqlData = await sql`SELECT P.id
    FROM partidos_fase_final P
    WHERE P.id_torneo = ${tournamentId} and P.num_ronda = ${nextRound} and P.orden_partido = ${ordenPartido}`;

    let result = undefined;
    if (sqlData.rowCount === 0) { //create
        if (oldMatchNumber % 2 == 0) {
            result = await sql`
                WITH inserted_partido AS (
                    INSERT INTO partidos_fase_final (id_torneo, id_jugador2, orden_partido, num_ronda) 
                    VALUES (${tournamentId}, ${idWinner}, ${ordenPartido}, ${nextRound})
                    RETURNING 
                        id AS id_partido, 
                        id_torneo, 
                        id_jugador1, 
                        id_jugador2, 
                        ganador, 
                        resultado_global, 
                        orden_partido, 
                        num_ronda
                )
                SELECT 
                    ip.id_partido,
                    ip.id_torneo,
                    ip.id_jugador1,
                    j1.nombre AS nombre_jugador1,
                    ip.id_jugador2,
                    j2.nombre AS nombre_jugador2,
                    ip.ganador,
                    ip.resultado_global,
                    ip.orden_partido,
                    ip.num_ronda
                FROM 
                    inserted_partido ip
                LEFT JOIN 
                    jugador j1 ON ip.id_jugador1 = j1.id
                LEFT JOIN 
                    jugador j2 ON ip.id_jugador2 = j2.id;

        `;
        }
        else {
            result = await sql`
                WITH inserted_partido AS (
                    INSERT INTO partidos_fase_final (id_torneo, id_jugador1, orden_partido, num_ronda) 
                    VALUES (${tournamentId}, ${idWinner}, ${ordenPartido}, ${nextRound})
                    RETURNING 
                        id AS id_partido, 
                        id_torneo, 
                        id_jugador1, 
                        id_jugador2, 
                        ganador, 
                        resultado_global, 
                        orden_partido, 
                        num_ronda
                )
                SELECT 
                    ip.id_partido,
                    ip.id_torneo,
                    ip.id_jugador1,
                    j1.nombre AS nombre_jugador1,
                    ip.id_jugador2,
                    j2.nombre AS nombre_jugador2,
                    ip.ganador,
                    ip.resultado_global,
                    ip.orden_partido,
                    ip.num_ronda
                FROM 
                    inserted_partido ip
                LEFT JOIN 
                    jugador j1 ON ip.id_jugador1 = j1.id
                LEFT JOIN 
                    jugador j2 ON ip.id_jugador2 = j2.id;

        `;
        }
    } else {
        // console.log(oldMatchNumber)
        if (oldMatchNumber % 2 == 0) {
            result = await sql`
                WITH updated_partido AS (
                    UPDATE partidos_fase_final SET 
                        id_jugador2 = ${idWinner},
                        ganador = null,
                        resultado_global = null
                    WHERE id_torneo = ${tournamentId} 
                    AND num_ronda = ${nextRound} 
                    AND orden_partido = ${ordenPartido}
                    RETURNING 
                        id AS id_partido, 
                        id_torneo, 
                        id_jugador1, 
                        id_jugador2, 
                        ganador, 
                        resultado_global, 
                        orden_partido, 
                        num_ronda
                )
                SELECT 
                    up.id_partido,
                    up.id_torneo,
                    up.id_jugador1,
                    j1.nombre AS nombre_jugador1,
                    up.id_jugador2,
                    j2.nombre AS nombre_jugador2,
                    up.ganador,
                    up.resultado_global,
                    up.orden_partido,
                    up.num_ronda
                FROM 
                    updated_partido up
                LEFT JOIN 
                    jugador j1 ON up.id_jugador1 = j1.id
                LEFT JOIN 
                    jugador j2 ON up.id_jugador2 = j2.id;
        `;
        } else {
            result = await sql`
                WITH updated_partido AS (
                    UPDATE partidos_fase_final SET 
                        id_jugador1 = ${idWinner},
                        ganador = null,
                        resultado_global = null
                    WHERE id_torneo = ${tournamentId} 
                    AND num_ronda = ${nextRound} 
                    AND orden_partido = ${ordenPartido}
                    RETURNING 
                        id AS id_partido, 
                        id_torneo, 
                        id_jugador1, 
                        id_jugador2, 
                        ganador, 
                        resultado_global, 
                        orden_partido, 
                        num_ronda
                )
                SELECT 
                    up.id_partido,
                    up.id_torneo,
                    up.id_jugador1,
                    j1.nombre AS nombre_jugador1,
                    up.id_jugador2,
                    j2.nombre AS nombre_jugador2,
                    up.ganador,
                    up.resultado_global,
                    up.orden_partido,
                    up.num_ronda
                FROM 
                    updated_partido up
                LEFT JOIN 
                    jugador j1 ON up.id_jugador1 = j1.id
                LEFT JOIN 
                    jugador j2 ON up.id_jugador2 = j2.id;
        `;
        }
    }

    const response = parseReponse(result);
    // console.log(result);
    if (response.success) {
        return result.rows.shift();
    }

}

export async function createFinalPhaseMatch(match) {
    // console.log(match.orden_partido)
    const sqlData = await sql`
        INSERT INTO partidos_fase_final (id_torneo, id_jugador1, id_jugador2, orden_partido, num_ronda) 
        VALUES (${match.tournament}, ${match.jugador1}, ${match.jugador2}, ${match.orden_partido}, ${match.num_ronda})
      `;

    return parseReponse(sqlData);


}

export async function updateMatchResult(matchPoints, globalResult, idWinner, matchId) {


    const sqlData = await sql`UPDATE partidos SET 
    resultado = ${matchPoints},
    resultado_global = ${`${globalResult}`},
    ganador = ${`${idWinner}`}
    WHERE id = ${`${matchId}`};`;

    return parseReponse(sqlData);
}

export async function updateFinalFaseMatchResult(matchId, idWinner, globalResult) {

    const sqlData = await sql`UPDATE partidos_fase_final SET 
    resultado_global = ${`${globalResult}`},
    ganador = ${`${idWinner}`}
    WHERE id = ${`${matchId}`};`;

    return parseReponse(sqlData);
}

function parseReponse(response) {
    if (response.rowCount == 1) {
        return { success: true };
    }

    return { success: false };
}