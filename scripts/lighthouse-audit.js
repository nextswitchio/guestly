#!/usr/bin/env node

// Lighthouse Audit Script
// Runs a Lighthouse audit on the local development server

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const URL = process.argv[2] || 'http://localhost:3000';

async function runAudit() {
  console.log(`\n🔍 Running Lighthouse audit on ${URL}\n`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'html', port: chrome.port };

  const runnerResult = await lighthouse(URL, options);

  console.log('\n📊 Lighthouse Results\n');
  console.log('='.repeat(50));

  const categories = runnerResult.lhr.categories;
  for (const [key, category] of Object.entries(categories)) {
    const score = category.score !== null ? Math.round(category.score * 100) : 'N/A';
    console.log(`${category.title}: ${score}`);
  }

  console.log('='.repeat(50));

  // Save HTML report
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, '..', 'lighthouse-report.html');
  fs.writeFileSync(reportPath, runnerResult.report, 'utf8');
  console.log(`\n📄 Full report saved to: ${reportPath}\n`);

  await chrome.kill();
}

runAudit().catch(console.error);
