import fs from 'node:fs/promises'

async function sendReportToN8N(percy_url){
    const report = await fs.readFile('./results.json')
    const response = await fetch('https://n8n-service-donk.onrender.com/webhook/receive-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            report: JSON.parse(report),
            percy_url
        })
    });
    const data = await response.json();
}

const args = process.argv.slice(2)

sendReportToN8N(args[0])

