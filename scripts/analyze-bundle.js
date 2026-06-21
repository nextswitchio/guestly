#!/usr/bin/env node

// Bundle Analysis Script
// Opens the bundle analyzer in the browser

const { execSync } = require('child_process');

console.log('\n🔍 Building with bundle analyzer...\n');

try {
  execSync('ANALYZE=true npm run build', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('\n✅ Build complete. Check the analyzer output above.\n');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
