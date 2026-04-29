const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const dumpFile = 'C:/Users/asmi2/.gemini/antigravity/brain/1b156233-f829-4782-9d42-c2d4fd6c7ec4/scratch/neetcode_dump.txt';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
const dumpText = fs.readFileSync(dumpFile, 'utf-8');

// Build a set of normalized names from merged_dsa.json
const existingNames = new Set();
const existingSlugs = new Set();

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getSlug(p) {
  if (!p.leetcodeUrl) return null;
  const match = p.leetcodeUrl.split('/problems/')[1];
  return match ? match.replace(/\/$/, '') : null;
}

for (const cat in data) {
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      existingNames.add(normalize(p.name));
      const slug = getSlug(p);
      if (slug) {
        existingSlugs.add(slug);
      }
    }
  }
}

// Process the dump
const lines = dumpText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
const missing = [];

for (const line of lines) {
    // Generate a naive slug for the problem from its name
    const naiveSlug = line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const normName = normalize(line);
    
    if (!existingNames.has(normName) && !existingSlugs.has(naiveSlug)) {
        missing.push(line);
    }
}

console.log(`Found ${missing.length} missing problems:`);
console.log(missing.join('\n'));
