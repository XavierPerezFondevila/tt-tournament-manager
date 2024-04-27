export const generateTournamentGroups = (players, numGroups, tournamentSize) => {
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

    console.log(newArray)
};