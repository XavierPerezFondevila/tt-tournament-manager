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

    let newArray = [];
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

    // newArray = [
    //     [
    //         {
    //             "id": 68,
    //             "nombre": "Francesc masip",
    //             "ficha": "1719081719268-ficha",
    //             "ranking": 2100,
    //             "grupo": "A"
    //         },
    //         {
    //             "id": 70,
    //             "nombre": "Viacheslav Volodin",
    //             "ficha": "1719082290970-ficha",
    //             "ranking": 1200,
    //             "grupo": "A"
    //         },
    //         {
    //             "id": 86,
    //             "nombre": "Albert Solé",
    //             "ficha": "1719082863345-ficha",
    //             "ranking": 850,
    //             "grupo": "A"
    //         },
    //         {
    //             "id": 96,
    //             "nombre": "Andy Ortiz",
    //             "ficha": "1719083106669-ficha",
    //             "ranking": 200,
    //             "grupo": "A"
    //         },
    //         {
    //             "id": 90,
    //             "nombre": "Jordi Torroja",
    //             "ficha": "1719082986333-ficha",
    //             "ranking": 100,
    //             "grupo": "A"
    //         }
    //     ],
    //     [
    //         {
    //             "id": 74,
    //             "nombre": "Gabriel Oliveras",
    //             "ficha": "1719082411525-ficha",
    //             "ranking": 1750,
    //             "grupo": "B"
    //         },
    //         {
    //             "id": 71,
    //             "nombre": "Eugenia Plenidina",
    //             "ficha": "1719082323858-ficha",
    //             "ranking": 1200,
    //             "grupo": "B"
    //         },
    //         {
    //             "id": 69,
    //             "nombre": "Angel Ramírez",
    //             "ficha": "1719082262196-ficha",
    //             "ranking": 810,
    //             "grupo": "B"
    //         },
    //         {
    //             "id": 75,
    //             "nombre": "David García",
    //             "ficha": "1719082442320-ficha",
    //             "ranking": 660,
    //             "grupo": "B"
    //         },
    //         {
    //             "id": 85,
    //             "nombre": "Dani Santpere",
    //             "ficha": "1719082840182-ficha",
    //             "ranking": 200,
    //             "grupo": "B"
    //         },
    //         {
    //             "id": 89,
    //             "nombre": "Juli Roca",
    //             "ficha": "1719082969989-ficha",
    //             "ranking": 100,
    //             "grupo": "B"
    //         }
    //     ],
    //     [
    //         {
    //             "id": 77,
    //             "nombre": "Dani Luco",
    //             "ficha": "1719082518344-ficha",
    //             "ranking": 1300,
    //             "grupo": "C"
    //         },
    //         {
    //             "id": 92,
    //             "nombre": "Jose Martínez",
    //             "ficha": "1719083035207-ficha",
    //             "ranking": 1200,
    //             "grupo": "C"
    //         },
    //         {
    //             "id": 88,
    //             "nombre": "Felix Pons",
    //             "ficha": "1719082947442-ficha",
    //             "ranking": 700,
    //             "grupo": "C"
    //         },
    //         {
    //             "id": 79,
    //             "nombre": "Victor Castañeda",
    //             "ficha": "1719082562828-ficha",
    //             "ranking": 680,
    //             "grupo": "C"
    //         },
    //         {
    //             "id": 83,
    //             "nombre": "María José Rodríguez",
    //             "ficha": "1719082742675-ficha",
    //             "ranking": 130,
    //             "grupo": "C"
    //         }
    //     ],
    //     [
    //         {
    //             "id": 78,
    //             "nombre": "Néstor Troncoso",
    //             "ficha": "1719082530546-ficha",
    //             "ranking": 1300,
    //             "grupo": "D"
    //         },
    //         {
    //             "id": 84,
    //             "nombre": "Frederick Mayeux",
    //             "ficha": "1719082807236-ficha",
    //             "ranking": 1010,
    //             "grupo": "D"
    //         },
    //         {
    //             "id": 72,
    //             "nombre": "Jose Ortego",
    //             "ficha": "1719082352166-ficha",
    //             "ranking": 685,
    //             "grupo": "D"
    //         },
    //         {
    //             "id": 76,
    //             "nombre": "Bernat Ferrer",
    //             "ficha": "1719082468730-ficha",
    //             "ranking": 680,
    //             "grupo": "D"
    //         },
    //         {
    //             "id": 93,
    //             "nombre": "Jose Martínez",
    //             "ficha": "1719083046354-ficha",
    //             "ranking": 250,
    //             "grupo": "D"
    //         },
    //         {
    //             "id": 99,
    //             "nombre": "Lluc Martínez",
    //             "ficha": "1719083138151-ficha",
    //             "ranking": 200,
    //             "grupo": "D"
    //         }
    //     ],
    //     [
    //         {
    //             "id": 91,
    //             "nombre": "Marc Flores",
    //             "ficha": "1719083011364-ficha",
    //             "ranking": 1300,
    //             "grupo": "E"
    //         },
    //         {
    //             "id": 87,
    //             "nombre": "Eduard Señor",
    //             "ficha": "1719082921634-ficha",
    //             "ranking": 980,
    //             "grupo": "E"
    //         },
    //         {
    //             "id": 80,
    //             "nombre": "Lluis Vilagran",
    //             "ficha": "1719082653351-ficha",
    //             "ranking": 400,
    //             "grupo": "E"
    //         },
    //         {
    //             "id": 95,
    //             "nombre": "Juan Carlos",
    //             "ficha": "1719083095969-ficha",
    //             "ranking": 250,
    //             "grupo": "C"
    //         },
    //         {
    //             "id": 98,
    //             "nombre": "Oscar Segura",
    //             "ficha": "1719083129530-ficha",
    //             "ranking": 200,
    //             "grupo": "E"
    //         }
    //     ],
    //     [
    //         {
    //             "id": 81,
    //             "nombre": "Joan Serrer",
    //             "ficha": "1719082693552-ficha",
    //             "ranking": 1250,
    //             "grupo": "F"
    //         },
    //         {
    //             "id": 82,
    //             "nombre": "Chema Escudero",
    //             "ficha": "1719082723313-ficha",
    //             "ranking": 890,
    //             "grupo": "F"
    //         },
    //         {
    //             "id": 73,
    //             "nombre": "Esteban Maldonado",
    //             "ficha": "1719082381961-ficha",
    //             "ranking": 650,
    //             "grupo": "A"
    //         },
    //         {
    //             "id": 94,
    //             "nombre": "Josep Garrido",
    //             "ficha": "1719083078387-ficha",
    //             "ranking": 460,
    //             "grupo": "F"
    //         },
    //         {
    //             "id": 97,
    //             "nombre": "Dan Baraldés",
    //             "ficha": "1719083121350-ficha",
    //             "ranking": 200,
    //             "grupo": "F"
    //         }
    //     ]
    // ];


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

const getPlayersByGroup = (jugadores) => {
    const grupos = {};

    jugadores.forEach(jugador => {
        if (!grupos[jugador.grupo]) {
            grupos[jugador.grupo] = [];
        }
        grupos[jugador.grupo].push(jugador);
    });

    return Object.values(grupos);
}


export const generateFinalPhase = (players) => {
    const qualifiedPlayers = players.filter(player => player.clasificado);
    let groups = getPlayersByGroup(qualifiedPlayers);
    const matches = [];

    let counter = 0;
    let currentPlayer = undefined;


    for (let index = 0; index < 8; index++) {
        if (counter < groups.length) {
            currentPlayer = groups[counter].shift();
        } else {
            let newIndex = groups.findIndex(group => group.length > 1);
            currentPlayer = groups[newIndex].shift();
        }

        matches.push([currentPlayer]);
        counter++;
    }

    for (let index = 0; index < 8; index++) {
        const matchPlayer = matches[index][0];

        let newIndex = groups.findIndex(group => group.length > 1 && group.slice()[0].grupo !== matchPlayer.grupo);
        if (newIndex === -1) {
            newIndex = groups.findIndex(group => group.length && group.slice()[0].grupo !== matchPlayer.grupo)
        }

        if (newIndex === -1) {
            newIndex = groups.findIndex(group => group.length)
        }

        matches[index].push(groups[newIndex].pop());
    }

    return matches;
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
