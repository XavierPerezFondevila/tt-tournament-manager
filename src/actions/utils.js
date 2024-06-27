export const updateTableOrderNums = (table) => {
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        [...rows || []].forEach((row, index) => {
            row.querySelector('td.player-num').innerText = (index + 1);
        });
    }
};

export const getGroupStandings = (matches, selectedGroupKey, groupPlayers) => {
    // Retrieve matches for the selected group
    const groupMatches = getMatchesByGroup(matches, selectedGroupKey);
    const standings = {};

    // Iterate through each match in the group
    groupMatches.forEach((match) => {
        const players = [match.id_jugador1, match.id_jugador2];
        if (match.resultado_global?.length) {
            // Split the match result to get sets won by each player
            const matchResult = match.resultado_global.split("-").map(Number);
            const puntosResult = match.resultado.split(",");

            // Update stats for each player in the match
            players.forEach((player, index) => {
                const setsGanados = matchResult[index];
                const setsPerdidos = matchResult[1 - index];

                // Initialize player stats if not already present
                if (!(player in standings)) {
                    const filteredPlayer = groupPlayers.find(
                        (groupPlayer) => groupPlayer.id == player
                    );
                    standings[player] = {
                        nombre: filteredPlayer.nombre,
                        clasificado: filteredPlayer.clasificado,
                        partidasGanadas: 0,
                        setsGanados: 0,
                        setsPerdidos: 0,
                        puntosGanados: 0,
                        puntosPerdidos: 0,
                        id: player,
                    };
                }

                // Update player stats
                if (match.ganador === player) {
                    standings[player].partidasGanadas++;
                }
                standings[player].setsGanados += setsGanados;
                standings[player].setsPerdidos += setsPerdidos;
            });

            // Update points stats
            puntosResult.forEach((resultado) => {
                const puntosSplit = resultado.split("-");
                console.log(puntosSplit)
                standings[players[0]].puntosGanados += parseInt(puntosSplit[0]) || 0;
                standings[players[1]].puntosPerdidos += parseInt(puntosSplit[1]) || 0;
            });
        }
    });

    // Calculate coefficient for each player
    Object.values(standings).forEach((player) => {
        player.coeficiente = player.setsGanados / (player.setsPerdidos || 1); // Avoid division by zero
    });

    // Sort players by coefficient, then by (puntosGanados - puntosPerdidos) difference
    let orderedStandings = Object.values(standings).sort(
        (playerA, playerB) => {
            const coefDiff = playerB.coeficiente - playerA.coeficiente;
            if (coefDiff !== 0) {
                return coefDiff;
            }
            return (playerB.puntosGanados - playerB.puntosPerdidos) - (playerA.puntosGanados - playerA.puntosPerdidos);
        }
    );

    // Resolve ties by adding 0.1 to the coefficient of the player who won the match between tied players
    orderedStandings = resolveCoeficientTies(orderedStandings, groupMatches);

    // Final sorting after tie resolution
    orderedStandings.sort(
        (playerA, playerB) => {
            const coefDiff = playerB.coeficiente - playerA.coeficiente;
            if (coefDiff !== 0) {
                return coefDiff;
            }
            return (playerB.puntosGanados - playerB.puntosPerdidos) - (playerA.puntosGanados - playerA.puntosPerdidos);
        }
    );

    return orderedStandings;
};

const resolveCoeficientTies = (orderedStandings, groupMatches) => {
    // Implement logic to resolve ties
    for (let i = 0; i < orderedStandings.length - 1; i++) {
        if (orderedStandings[i].coeficiente === orderedStandings[i + 1].coeficiente) {
            const playerA = orderedStandings[i];
            const playerB = orderedStandings[i + 1];

            const match = groupMatches.find(match =>
                (match.id_jugador1 === playerA.id && match.id_jugador2 === playerB.id) ||
                (match.id_jugador1 === playerB.id && match.id_jugador2 === playerA.id)
            );

            if (match) {
                if (match.ganador === playerA.id) {
                    playerA.coeficiente += 0.1;
                } else if (match.ganador === playerB.id) {
                    playerB.coeficiente += 0.1;
                }
            }
        }
    }
    return orderedStandings;
};


export const getSortedByGroupsPlayers = (players) => {
    const groupedAndSorted = players.reduce((acc, player) => {
        if (!acc[player.grupo]) {
            acc[player.grupo] = [];
        }
        acc[player.grupo].push(player);
        return acc;
    }, {});

    // Sort each group by ranking in descending order
    for (const group in groupedAndSorted) {
        groupedAndSorted[group].sort((a, b) => b.ranking - a.ranking);

        // Calculate the midpoint index
        const midpointIndex = Math.ceil(groupedAndSorted[group].length / 2);

        // Split the sorted array into two arrays
        const firstHalf = groupedAndSorted[group].slice(0, midpointIndex);
        const lastHalf = groupedAndSorted[group].slice(midpointIndex);

        // Replace the original array with the split arrays
        groupedAndSorted[group] = [firstHalf, lastHalf];
    }

    return groupedAndSorted;
};

export function generateMatches(players) {
    if (!Array.isArray(players) || players.length < 2) {
        throw new Error('The players array must contain at least two players.');
    }

    const matches = [];
    const playerCount = players.length;

    // Generate all possible match combinations
    for (let i = 0; i < playerCount; i++) {
        for (let j = i + 1; j < playerCount; j++) {
            matches.push([players[i], players[j]]);
        }
    }

    // Shuffle matches to randomize initial order
    shuffle(matches);

    // Organize matches to balance player participation
    const organizedMatches = balancePlayerParticipation(matches, players);

    return organizeMatchesWithReferees(organizedMatches, players);
}

// Shuffle array function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Balance player participation
function balancePlayerParticipation(matches, players) {
    const balancedMatches = [];
    const playerMatchesCount = new Map(players.map(player => [player, 0]));

    while (matches.length > 0) {
        let selectedMatch = null;
        let minWait = Infinity;

        for (const match of matches) {
            const [player1, player2] = match;
            const maxCount = Math.max(playerMatchesCount.get(player1), playerMatchesCount.get(player2));

            if (maxCount < minWait) {
                minWait = maxCount;
                selectedMatch = match;
            }
        }

        balancedMatches.push(selectedMatch);
        matches.splice(matches.indexOf(selectedMatch), 1);

        const [player1, player2] = selectedMatch;
        playerMatchesCount.set(player1, playerMatchesCount.get(player1) + 1);
        playerMatchesCount.set(player2, playerMatchesCount.get(player2) + 1);
    }

    return balancedMatches;
}

// Check if a player has played in the previous match
function playerInPreviousMatch(match, previousMatch) {
    return match.some(player => previousMatch.includes(player));
}

// Reorganize matches to ensure no consecutive players
function reorganizeMatches(matches) {
    const finalMatches = [];
    const recentlyPlayed = new Set();

    while (matches.length > 0) {
        let foundMatch = false;

        for (let i = 0; i < matches.length; i++) {
            const currentMatch = matches[i];
            const [player1, player2] = currentMatch;

            if (!recentlyPlayed.has(player1) && !recentlyPlayed.has(player2)) {
                finalMatches.push(currentMatch);
                matches.splice(i, 1);
                recentlyPlayed.clear();
                recentlyPlayed.add(player1);
                recentlyPlayed.add(player2);
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            // If no suitable match found, take the next available match and reset recently played set
            const fallbackMatch = matches.shift();
            finalMatches.push(fallbackMatch);
            recentlyPlayed.clear();
            const [player1, player2] = fallbackMatch;
            recentlyPlayed.add(player1);
            recentlyPlayed.add(player2);
        }
    }

    return finalMatches;
}

// Organize matches and assign referees
function organizeMatchesWithReferees(matches, players) {
    const matchSequence = reorganizeMatches(matches);
    const refereeCount = new Map(players.map(player => [player, 0]));
    const matchesWithReferees = [];

    // Select a random player as the first referee who is not in the first match
    const [firstMatchPlayer1, firstMatchPlayer2] = matchSequence[0];
    const possibleFirstReferees = players.filter(player => player !== firstMatchPlayer1 && player !== firstMatchPlayer2);
    let referee = possibleFirstReferees[Math.floor(Math.random() * possibleFirstReferees.length)];
    refereeCount.set(referee, 1);
    matchesWithReferees.push({ players: matchSequence[0], referee });

    for (let i = 1; i < matchSequence.length; i++) {
        const currentMatch = matchSequence[i];
        const [currentPlayer1, currentPlayer2] = currentMatch;

        // Find referees who have not refereed before
        const previousReferees = matchesWithReferees.map(match => match.referee);
        const eligibleReferees = players.filter(player =>
            !previousReferees.includes(player) && player !== currentPlayer1 && player !== currentPlayer2);

        if (eligibleReferees.length === 0) {
            // If no eligible referees, find a player who has refereed the least
            const nonPlayingPlayers = players.filter(player =>
                player !== currentPlayer1 && player !== currentPlayer2);
            nonPlayingPlayers.sort((a, b) => refereeCount.get(a) - refereeCount.get(b));
            referee = nonPlayingPlayers[0];
        } else {
            referee = eligibleReferees[0];
        }

        refereeCount.set(referee, (refereeCount.get(referee) || 0) + 1);
        matchesWithReferees.push({ players: currentMatch, referee });
    }

    return matchesWithReferees;
}



export const getMatchesByGroup = (matches, group) => {
    return matches.filter(match => match.grupo === group);
};

export const isPdfPage = (path) => {
    const tournamentGroupRegex = /\/tournament\/\d+\/groups\/[A-Z]/;
    return tournamentGroupRegex.test(path);
};