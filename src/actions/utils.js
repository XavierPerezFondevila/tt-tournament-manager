export const updateTableOrderNums = (table) => {
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        [...rows || []].forEach((row, index) => {
            row.querySelector('td.player-num').innerText = (index + 1);
        });
    }
};

export const getGroupStandings = (matches, selectedGroupKey, groupPlayers) => {
    // Assume `getMatchesByGroup`, `matches`, and `selectedGroupKey` are defined and have valid data
    const groupMatches = getMatchesByGroup(matches, selectedGroupKey);
    const standings = {};

    // Iterate through each match in the group
    groupMatches.forEach((match) => {
        const players = [match.id_jugador1, match.id_jugador2];
        if (match.resultado_global?.length) {
            // Iterate through each player in the match
            players.forEach((player, index) => {
                const matchResult = match.resultado_global.split("-");
                const setsGanados = parseInt(matchResult[index], 10);
                const setsPerdidos = parseInt(matchResult[1 - index], 10);

                // Initialize player stats if not already present
                if (!(player in standings)) {
                    const filteredPlayer = groupPlayers.find(
                        (groupPlayer) => groupPlayer.id == player
                    );
                    standings[player] = {
                        nombre: filteredPlayer.nombre,
                        partidasGanadas: 0,
                        setsGanados: 0,
                        setsPerdidos: 0,
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
        }
    });

    // Calculate coeficiente for each player
    Object.values(standings).forEach((player) => {
        player.coeficiente = player.setsGanados / player.setsPerdidos;
    });

    // Order standings by coeficiente
    let orderedStandings = Object.values(standings).sort(
        (playerA, playerB) => playerB.coeficiente - playerA.coeficiente
    );

    // Resolve ties by adding 0.1 to the coeficiente of the player who won the match between tied players
    orderedStandings = resolveCoeficientTies(orderedStandings, groupMatches);

    // Final sorting after tie resolution
    orderedStandings.sort(
        (playerA, playerB) => playerB.coeficiente - playerA.coeficiente
    );

    return orderedStandings;
};

const resolveCoeficientTies = (orderedStandings, groupMatches) => {
    // Step 1: Create a map to store coefficients and associated players
    const coefMap = new Map();
    // Step 2: Populate the map
    orderedStandings.forEach(player => {
        const { coeficiente, nombre, id } = player;
        if (!coefMap.has(coeficiente)) {
            coefMap.set(coeficiente, []);
        }
        coefMap.get(coeficiente).push({ nombre, id });
    });

    // Step 3: Filter the map to find coefficients with more than one player
    const duplicates = [];
    coefMap.forEach((players, coeficiente) => {
        if (players.length > 1) {
            duplicates.push({ coeficiente, players });
        }
    });

    if (duplicates.length) {
        orderedStandings.forEach((standingPlayer, index) => {
            const tiedPlayers = orderedStandings.filter(
                (player) =>
                    player.coeficiente === standingPlayer.coeficiente &&
                    player.id !== standingPlayer.id
            );

            tiedPlayers.forEach((tiedPlayer) => {
                const match = groupMatches.find(
                    (match) =>
                        (match.id_jugador1 == standingPlayer.id &&
                            match.id_jugador2 == tiedPlayer.id) ||
                        (match.id_jugador2 == standingPlayer.id &&
                            match.id_jugador1 == tiedPlayer.id)
                );

                // There is always a match, so no need to check for undefined
                if (match.ganador === standingPlayer.id) {
                    standingPlayer.coeficiente += 0.1;
                }
            });
        });

        const completedMatches = groupMatches.filter(match => match?.resultado_global);

        if (completedMatches.length === groupMatches.length) {
            return resolveCoeficientTies(orderedStandings, groupMatches);
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

        // Select the player from previous matches who has not refereed yet and is not playing in the current match
        const previousPlayers = new Set(matchSequence.slice(0, i).flat());
        const eligibleReferees = Array.from(previousPlayers).filter(player =>
            player !== currentPlayer1 && player !== currentPlayer2 && !refereeCount.has(player));

        if (eligibleReferees.length === 0) {
            // If no eligible referees, find a player who has refereed the least and is not playing in the current match
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