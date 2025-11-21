const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function readCSV(csvPath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => results.push({
                ...row,
                sales: Number(row.sales)
            }))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

module.exports = { readCSV };
