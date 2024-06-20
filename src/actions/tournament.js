"use server";
import { sql } from '@vercel/postgres';
import { generateMatches, getGroupStandings, getMatchesByGroup } from './utils';

const FINAL_ROUND_NAMES = {
    2: 'Final',
    4: 'Semifinal',
    8: 'Cuartos de final',
    16: 'Deciseisavos',
    // 32: '',
    // 64: '',
};

export const generateTournamentGroups = async (players, numGroups, tournamentSize, tournamentId) => {
    const groups = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    // Create a clone of the players array to avoid mutating the original array
    const clonedPlayers = players.slice();
    // If the length of clonedPlayers is less than tournamentSize, fill it with { id: undefined, ranking: 0 } objects
    if (clonedPlayers.length < tournamentSize) {
        const additionalPlayersNeeded = tournamentSize - clonedPlayers.length;
        for (let i = 0; i < additionalPlayersNeeded; i++) {
            clonedPlayers.push({ id: undefined, ranking: 0 });
        }
    }

    const newArray = [];
    let q = 0;

    for (let i = 0; i < tournamentSize / 2; i++) {
        if (q === numGroups) {
            q = 0;
        }
        if (!newArray[q]) {
            newArray[q] = [];
        }
        newArray[q].push(clonedPlayers.shift(), clonedPlayers.pop());
        q++;
    }

    try {
        // delete players and tourney from partidos
        const sqlDeleteData = await sql`DELETE FROM PARTIDOS WHERE ID_TORNEO = ${tournamentId}`;
        for (let index = 0; index < newArray.length; index++) {
            let group = newArray[index];
            let playersId = group.map(player => parseInt(player.id));
            const hasUndefinedPlayer = playersId.some(val => isNaN(val));
            if (hasUndefinedPlayer) {
                playersId = playersId.filter(id => !isNaN(id));
                group = group.filter(player => player.id !== undefined);
            }

            const sqlData = await sql`UPDATE participacion SET grupo = ${groups[index].toUpperCase()} WHERE id_jugador = ANY(${playersId})`;
            const matches = generateMatches(group);
            for (let index = 0; index < matches.length; index++) {
                // console.log(matches[index])
                const sqlData = await sql`INSERT INTO PARTIDOS (id_torneo, id_jugador1, id_jugador2, id_arbitro) 
                values (${tournamentId}, ${matches[index].players[0].id}, ${matches[index].players[1].id}, ${matches[index].referee.id})`;
            }
        }



    } catch (error) {
        console.log(error)
    }



    return { success: true };

};

export const generateFinalPhase = (matches, playersByGroup, tournamentWinnersNum) => {
    const standings = {};
    let matchesNum = 0;

    Object.keys(playersByGroup).forEach((groupKey) => {
        const players = playersByGroup[groupKey].flat();
        const groupStandings = getGroupStandings(matches, groupKey, players);
        const qualifiedPlayers = groupStandings.slice(0, tournamentWinnersNum);
        standings[groupKey] = qualifiedPlayers;
        matchesNum += standings[groupKey].length;
    });

    const roundName = FINAL_ROUND_NAMES[matchesNum];

    console.log(generarDieciseisavos(standings));


};

export const getMatchWinner = async (match, result) => {

    let matchWinner = undefined;
    if (result.length === 2) {

    }
    const player1Result = result[0];
    const player2Result = result[1];

    if (parseInt(player1Result) > parseInt(player2Result)) {
        matchWinner = match.id_jugador1;
    } else {
        matchWinner = match.id_jugador2;
    }

    const matchResult = {
        ganador: matchWinner,
        resultado_global: `${player1Result}-${player2Result}`
    };

    return matchResult;
}

// Función para ordenar los jugadores por algún criterio (aquí se ordena por partidas ganadas y coeficiente)
const ordenarJugadoresPorCriterio = (jugadores) => {
    return jugadores.sort((a, b) => {
        // Orden primero por partidas ganadas de forma descendente
        if (b.partidasGanadas !== a.partidasGanadas) {
            return b.partidasGanadas - a.partidasGanadas;
        } else {
            // Si tienen el mismo número de partidas ganadas, orden por coeficiente de forma descendente
            return b.coeficiente - a.coeficiente;
        }
    });
}

// Función para generar los enfrentamientos de dieciseisavos
export const generarDieciseisavos = (torneo) => {
    let enfrentamientos = [];

    // Agrupamos a todos los jugadores en una lista única
    let todosLosJugadores = [];
    Object.values(torneo).forEach(grupo => {
        todosLosJugadores = todosLosJugadores.concat(grupo);
    });

    // Ordenamos a todos los jugadores según nuestro criterio
    todosLosJugadores = ordenarJugadoresPorCriterio(todosLosJugadores);

    // Creamos los enfrentamientos de dieciseisavos emparejando a los jugadores correspondientes
    for (let i = 0; i < todosLosJugadores.length / 2; i++) {
        let jugadorA = todosLosJugadores[i];
        let jugadorB = todosLosJugadores[todosLosJugadores.length - 1 - i];
        enfrentamientos.push({
            jugador1: jugadorA,
            jugador2: jugadorB
        });
    }

    return enfrentamientos;
}
