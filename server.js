const express = require('express');
const fs = require('fs');
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

setInterval(addNewData, 10000); // Add new data every 10 seconds


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
})

