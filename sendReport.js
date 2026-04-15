const fs = require('node:fs/promises')

async function sendReport(){
    const report = await fs.readFile('./results.json')

    const response = await fetch('http://localhost:5678/webhook/receive-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: report
    });

    const data = await response.json();
    console.log(data);
}

sendReport()