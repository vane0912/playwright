import fs from 'node:fs/promises'

const report = await fs.readFile('./results.json')
const response = await fetch('https://stumpless-strainlessly-gerardo.ngrok-free.dev/webhook/receive-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: report
});
const data = await response.json();
console.log(data);