"use server";
import { sql } from '@vercel/postgres';
import { generateMatches } from './utils';

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
            const group = newArray[index];
            const playersId = group.map(player => parseInt(player.id));
            const sqlData = await sql`UPDATE participacion SET grupo = ${groups[index].toUpperCase()} WHERE id_jugador = ANY(${playersId})`;
            const matches = generateMatches(group);
            for (let index = 0; index < matches.length; index++) {
                const sqlData = await sql`INSERT INTO PARTIDOS (id_torneo, id_jugador1, id_jugador2, id_arbitro) 
                values (${tournamentId}, ${matches[index].players[0].id}, ${matches[index].players[1].id}, ${matches[index].referee.id})`;
            }
        }



    } catch (error) {
        console.log(error)
    }



    return { success: true };

};