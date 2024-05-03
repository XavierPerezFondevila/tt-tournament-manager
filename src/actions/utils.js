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
    players = players.map(player => { return { ...player, playedBefore: false, refereedBefore: false, refereedCount: 0 }; });

    const matches = [];

    const nMatches = (players.length * (players.length - 1)) / 2;
    const maxRefereeMatches = Math.ceil(nMatches / players.length);

    for (let index = 0; index < nMatches; index++) {

        const availablePlayers = getAvailablePlayers(players);
        const matchPlayers = getMatchPlayers(availablePlayers, matches);


        // updatePlayersStateToFalse
        players = players.map(player => { return { ...player, playedBefore: false }; });

        matchPlayers.forEach(matchPlayer => {
            const playerIndex = players.findIndex(player => {
                return player.id === matchPlayer.id;
            });

            if (playerIndex !== -1) {
                players[playerIndex].playedBefore = true;
            }
        });

        const referee = getAvailableReferee(players, maxRefereeMatches, matchPlayers);
        // updateReferees
        players = players.map(player => { return { ...player, refereedBefore: false }; });
        const refereeIndex = players.findIndex(player => player.id === referee.id);
        if (refereeIndex != -1) {
            players[refereeIndex].refereedBefore = true;
            players[refereeIndex].refereedCount = (players[refereeIndex].refereedCount + 1);
        }

        matches.push({ players: matchPlayers, referee: referee });
    }

    return matches;
}

const getAvailableReferee = (players, maxRefereeMatches, matchPlayers) => {
    let availableReferees = undefined;
    const matchPlayerIds = matchPlayers.map(player => player.id);

    for (let i = 0; i <= maxRefereeMatches; i++) {
        availableReferees = players.filter(player => player.refereedCount === i && !matchPlayerIds.includes(player.id));
        if (availableReferees.length !== 0) {
            break;
        }
    }

    const availableReferee = availableReferees.find(player => {
        return player.refereedBefore === false && player.refereedCount <= maxRefereeMatches;
    });

    return availableReferee;

};

const isNonRepeatedMatch = (players, matches) => {
    const isRepeatedMatch = false;

    const currentMatchPlayersId = players.map(player => player.id).sort();

    matches.some(match => {
        const matchPlayersId = match.players.map(player => player.id).sort();
        return matchPlayersId === currentMatchPlayersId;
    });

};

const getMatchPlayers = (players, matches) => {
    let player1 = undefined;
    let player2 = undefined;
    let matchPlayers = undefined;
    do {
        player1 = players[Math.floor(Math.random() * players.length)];

        do {
            player2 = players[Math.floor(Math.random() * players.length)];
        } while (player2.id === player1.id);

        matchPlayers = [player1, player2];

    } while (isNonRepeatedMatch(matchPlayers, matches))

    return matchPlayers;

};

const getAvailablePlayers = (players) => {
    const availablePlayers = players.filter(player => player["playedBefore"] === false);

    return availablePlayers;
};