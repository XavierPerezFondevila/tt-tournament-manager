export const updateTableOrderNums = (table) => {
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        [...rows || []].forEach((row, index) => {
            row.querySelector('td.player-num').innerText = (index + 1);
        });
    }
};