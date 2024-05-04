export const updateTableOrderNums = (table) => {
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        [...rows || []].forEach((row, index) => {
            row.querySelector('td.player-num').innerText = (index + 1);
        });
    }
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



export const generateMatches = (groupPlayers) => {
    let players = groupPlayers.slice();
    players = players.map(player => ({ ...player, playedBefore: false, refereedBefore: false, refereedCount: 0 }));

    const matches = [];

    const nPlayers = players.length;
    const rounds = nPlayers - 1; // Number of rounds needed to complete the schedule

    let lastReferee = null; // Variable to store the last referee

    // Generate matches for each round
    for (let round = 0; round < rounds; round++) {
        for (let i = 0; i < nPlayers / 2; i++) {
            const matchPlayers = [players[i], players[nPlayers - 1 - i]];
            matches.push({ players: matchPlayers, referee: null });
        }
        // Rotate players except the first one
        players.splice(1, 0, players.pop());

        // Assign referees for each match in the round
        for (const match of matches.slice(round * (nPlayers / 2), (round + 1) * (nPlayers / 2))) {
            const availableReferees = players.filter(player => (
                !match.players.includes(player) && // Not one of the players in the match
                player !== lastReferee && // Not the same as the last referee
                player.refereedCount < matches.length // Not exceeded maximum allowed matches
            ));
            if (availableReferees.length > 0) {
                const randomReferee = availableReferees[Math.floor(Math.random() * availableReferees.length)];
                match.referee = randomReferee;
                randomReferee.refereedCount++;
                lastReferee = randomReferee; // Update last referee
            }
        }
    }

    return matches;
};

export const getMatchesByGroup = (matches, group) => {
    return matches.filter(match => match.grupo === group);
};

export const isPdfPage = (path) => {
    const tournamentGroupRegex = /\/tournament\/\d+\/groups\/[A-Z]/;
    return tournamentGroupRegex.test(path);
};