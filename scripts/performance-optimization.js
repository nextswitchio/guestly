#!/usr/bin/env node

// Performance Optimization Report
// Checks for common performance issues

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function checkFileExists(filePath) {
  return fs.existsSync(path.join(projectRoot, filePath));
}

console.log('\n⚡ Performance Optimization Report\n');
console.log('='.repeat(50));

const checks = [
  { name: 'middleware.ts', path: 'middleware.ts', critical: true },
  { name: '.env.example', path: '.env.example', critical: true },
  { name: 'robots.txt', path: 'public/robots.txt', critical: false },
  { name: 'not-found.tsx', path: 'app/not-found.tsx', critical: false },
  { name: 'loading.tsx (root)', path: 'app/loading.tsx', critical: false },
  { name: 'error.tsx (root)', path: 'app/error.tsx', critical: false },
  { name: 'next.config.ts', path: 'next.config.ts', critical: true },
  { name: 'cache.ts', path: 'lib/cache.ts', critical: false },
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  const exists = checkFileExists(check.path);
  const status = exists ? '✅' : '❌';
  const label = check.critical ? '(critical)' : '';
  console.log(`${status} ${check.name} ${label}`);
  if (exists) passed++;
  else failed++;
}

console.log('='.repeat(50));
console.log(`\nPassed: ${passed}/${checks.length}`);
console.log(`Failed: ${failed}/${checks.length}\n`);

if (failed > 0) {
  console.log('⚠️  Some performance optimizations are missing.\n');
} else {
  console.log('✅ All performance checks passed!\n');
}
