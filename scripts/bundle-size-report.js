#!/usr/bin/env node

// Bundle Size Report
// Analyzes the .next directory for bundle size information

const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += fs.statSync(filePath).size;
    }
  }
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('\n📦 Guestly Bundle Size Report\n');
console.log('='.repeat(50));

const staticDir = path.join(nextDir, 'static');
const serverDir = path.join(nextDir, 'server');
const appDir = path.join(nextDir, 'app');

console.log(`📁 .next/static:    ${formatBytes(getDirectorySize(staticDir))}`);
console.log(`📁 .next/server:    ${formatBytes(getDirectorySize(serverDir))}`);
console.log(`📁 .next/app:       ${formatBytes(getDirectorySize(appDir))}`);
console.log(`📁 .next (total):   ${formatBytes(getDirectorySize(nextDir))}`);
console.log('='.repeat(50));
console.log('\nRun "npm run build:analyze" for detailed breakdown.\n');
