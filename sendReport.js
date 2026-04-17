import fs from 'node:fs/promises'

const report = await fs.readFile('./results.json')
const response = await fetch('https://n8n-service-donk.onrender.com/webhook/receive-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: report
});
const data = await response.json();
console.log(data);