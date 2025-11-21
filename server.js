const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path  = require('path');

const {readCSV} = require('./anomaly/csvReader');
const {detectAnomalies} = require('./anomaly/detector');
const {explainAnomaly, buildPrompt} = require('./anomaly/llmExplain');


const demo_metric = "sales";
const csvPath = path.join(__dirname, 'data', 'metrics.csv');
let lastProcessedIndex = 0;
const app = express();
const port = 3000; 

app.get('/', (req, res) => {
    res.send('Proactive Agent setup works');
});


function addNewData() {
    const timestamp = new Date().toISOString();
    let sales = Math.floor(Math.random() * 50 + 100);
    const traffic = Math.floor(Math.random() * 50 + 200);
    const errors = Math.floor(Math.random() * 5);

    if (Math.random() < 0.2) {
        sales += sales * 2;
    }
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


async function parseRows(rows) {
    return rows.map(row => ({
        ...row,
        sales: Number(row.sales),
        traffic: Number(row.traffic),
        errors: Number(row.errors)
    }));
}


async function runProactiveAgent() {
    try {
        const raw = await readCSV(csvPath);
        console.log(raw);
        const data = await parseRows(raw);
        console.log(data);
        const anomalies = await detectAnomalies(data, 3, 2, lastProcessedIndex);
        console.log('Detected anomalies:', anomalies);
        if (anomalies.length > 0) {
            for (const a of anomalies) {
                const prompt = await buildPrompt(a, demo_metric);
                const llm = await explainAnomaly(prompt);
                console.log("---- Anomaly Detected ----");
                console.log(`Timestamp: ${a.row.timestamp}`);
                console.log(`Metric: ${demo_metric}`);
                console.log(llm.output_text);
                console.log("--------------------------\n");
            }
        }
        lastProcessedIndex = data.length;
    }
    catch (error) {
        console.error('Error in proactive agent:', error);
    }
}


setInterval(runProactiveAgent, 5000); // Run every 60 seconds
setInterval(addNewData, 10000);


//setInterval(addNewData, 10000); // Add new data every 10 seconds


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
})