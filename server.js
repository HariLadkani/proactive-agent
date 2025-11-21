const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path  = require('path');

const {readCSV} = require('./anomaly/csvReader');
const {detectAnomalies} = require('./anomaly/detector');
const {explainAnomaly, buildPrompt} = require('./anomaly/llmExplain');


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


function parseRows(rows) {
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
        const data = await parseRows(raw);
        const anomalies = await detectAnomalies(data);

        if (anomalies.length > 0) {
            for (const a of anomalies) {
                const prompt = await buildPrompt(a, "sales");
                const llm = await explainAnomaly(prompt);
                console.log("---- Anomaly Explanation ----");
                console.log(llm.output_text);
            }
        }
    }
    catch (error) {
        console.error('Error in proactive agent:', error);
    }
}


setInterval(runProactiveAgent, 5000); // Run every 60 seconds





//setInterval(addNewData, 10000); // Add new data every 10 seconds


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
})