#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * 
 * This script generates PNG icons from the SVG favicon for PWA compatibility.
 * 
 * Usage:
 *   node scripts/generate-icons.js
 * 
 * Requirements:
 *   npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG icon data (same as favicon.svg)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ebdbb2"/>
  <rect x="20" y="20" width="25" height="25" rx="3" fill="#458588"/>
  <rect x="55" y="20" width="25" height="25" rx="3" fill="#458588"/>
  <rect x="20" y="55" width="25" height="25" rx="3" fill="#458588"/>
  <rect x="58" y="58" width="8" height="8" fill="#d65d0e"/>
  <rect x="70" y="58" width="8" height="8" fill="#d65d0e"/>
  <rect x="58" y="70" width="8" height="8" fill="#d65d0e"/>
  <rect x="70" y="70" width="8" height="8" fill="#d65d0e"/>
</svg>`;

const sizes = [
  { width: 192, height: 192, name: 'icon-192x192.png' },
  { width: 512, height: 512, name: 'icon-512x512.png' }
];

const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, size.name);
    
    try {
      await sharp(Buffer.from(svgIcon))
        .resize(size.width, size.height)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${size.name} (${size.width}x${size.height})`);
    } catch (error) {
      console.error(`❌ Error generating ${size.name}:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
  console.log(`📁 Icons saved to: ${outputDir}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Verify icons in public/icons/ directory');
  console.log('   2. Run: npm run build');
  console.log('   3. Deploy to Firebase or test locally');
  console.log('   4. Test with PWABuilder: https://www.pwabuilder.com/');
}

generateIcons();
