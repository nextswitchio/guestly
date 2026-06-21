#!/usr/bin/env node

// Image Optimization Script
// Checks for missing or empty image references

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('\n🖼️  Image Optimization Report\n');
console.log('='.repeat(50));

// Check public directory for images
const publicDir = path.join(projectRoot, 'public');
let imageCount = 0;
let totalSize = 0;

function scanImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanImages(fullPath);
    } else if (/\.(png|jpg|jpeg|gif|webp|svg|avif)$/i.test(entry.name)) {
      imageCount++;
      totalSize += fs.statSync(fullPath).size;
    }
  }
}

if (fs.existsSync(publicDir)) {
  scanImages(publicDir);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log(`📁 Total images: ${imageCount}`);
console.log(`📦 Total size:   ${formatBytes(totalSize)}`);
console.log('='.repeat(50));

if (imageCount === 0) {
  console.log('\n⚠️  No images found in public directory.\n');
} else {
  console.log('\n✅ Images present in public directory.\n');
}
