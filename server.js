const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path  = require('path');
const csvPath = path.join(__dirname, 'data', 'metrics.csv');

const app = express();
const port = 3000; 

app.get('/', (req, res) => {
    res.send('Proactive Agent setup works');
});


function addNewData() {
    const timestamp = new Date().toISOString();
    const sales = Math.floor(Math.random() * 50 + 100);
    const traffic = Math.floor(Math.random() * 50 + 200);
    const errors = Math.floor(Math.random() * 5);
    const newRow = `\n${timestamp},${sales},${traffic},${errors}`;
    fs.appendFile(csvPath, newRow, (err)=> {
        if (err) {
            console.error('Error appending data to CSV:', err);
        }
        else {
            console.log('New data appended to CSV:', newRow.trim());
        }
    });
}


function readCSV(callback) {
    const results = [];
    
    fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            callback(results);
        });
}


function parseRows(rows) {
    return rows.map(row => ({
        ...row,
        sales: Number(row.sales),
        traffic: Number(row.traffic),
        errors: Number(row.errors)
    }));
}


function runProactiveAgent() {
    console.log('Running proactive agent...');
    readCSV((rawData) => {
        const data = parseRows(rawData);
        const anomalies = detectAnomalies(data);
        if (anomalies.length > 0) {
            console.log('Anomalies detected:');
            anomalies.forEach((a, index) => {
                console.log(`${index + 1}. ${a.reason}`);
            });
        }
        else {
            console.log('No anomalies detected.');
        }

        console.log("Agent cycle complete.");
    });
}


setInterval(runProactiveAgent, 5000); // Run every 60 seconds
function detectAnomalies(data, windowSize = 3, threshold = 3) {
    const anomalies = [];

    for (let i= windowSize; i< data.length; i++) {
        const window = data.slice(i-windowSize, i);
        const meanSales = window.reduce((sum, row) => sum + row.sales, 0) / windowSize;
        const stdDevSales = Math.sqrt(window.reduce((sum, row) => sum + Math.pow(row.sales - meanSales, 2), 0) / windowSize);
        const current = data[i].sales;

        if (Math.abs(current - meanSales) > threshold * stdDevSales) {
            anomalies.push({
                row: data[i],
                reason: `Sales ${current} deviated from rolling mean ${meanSales.toFixed(2)} by more than ${threshold}σ (σ=${stdDevSales.toFixed(2)})`
            });
        }
    }
    return anomalies;
}




//setInterval(addNewData, 10000); // Add new data every 10 seconds


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
})

