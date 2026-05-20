#!/usr/bin/env node

// Quick Performance Fixes
// Applies common performance fixes automatically

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('\n🔧 Quick Performance Fixes\n');
console.log('='.repeat(50));

const fixes = [];

// Check if next.config.ts has compression enabled
const nextConfigPath = path.join(projectRoot, 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const config = fs.readFileSync(nextConfigPath, 'utf8');
  if (config.includes('compress: true')) {
    fixes.push({ name: 'Compression enabled', status: '✅' });
  } else {
    fixes.push({ name: 'Compression enabled', status: '⚠️  Not found' });
  }
}

// Check for loading.tsx files
const appDir = path.join(projectRoot, 'app');
let loadingCount = 0;
let errorCount = 0;

function countLoadingErrorFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('(')) {
      countLoadingErrorFiles(fullPath);
    } else if (entry.name === 'loading.tsx') {
      loadingCount++;
    } else if (entry.name === 'error.tsx') {
      errorCount++;
    }
  }
}

if (fs.existsSync(appDir)) {
  countLoadingErrorFiles(appDir);
}

fixes.push({ name: `loading.tsx files (${loadingCount})`, status: loadingCount > 0 ? '✅' : '⚠️  None found' });
fixes.push({ name: `error.tsx files (${errorCount})`, status: errorCount > 0 ? '✅' : '⚠️  None found' });

// Check for middleware
if (fs.existsSync(path.join(projectRoot, 'middleware.ts'))) {
  fixes.push({ name: 'middleware.ts', status: '✅' });
} else {
  fixes.push({ name: 'middleware.ts', status: '⚠️  Not found' });
}

for (const fix of fixes) {
  console.log(`${fix.status} ${fix.name}`);
}

console.log('='.repeat(50));
console.log('\n✅ Performance check complete.\n');
