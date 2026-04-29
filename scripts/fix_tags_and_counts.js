const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const dumpFile = 'C:/Users/asmi2/.gemini/antigravity/brain/1b156233-f829-4782-9d42-c2d4fd6c7ec4/scratch/neetcode_dump.txt';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
const dumpText = fs.readFileSync(dumpFile, 'utf-8');
const lines = dumpText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getSlug(p) {
  if (!p.leetcodeUrl) return null;
  const match = p.leetcodeUrl.split('/problems/')[1];
  return match ? match.replace(/\/$/, '') : null;
}

const dumpSlugs = new Set();
const dumpNames = new Set();

for (const line of lines) {
    const naiveSlug = line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const normName = normalize(line);
    dumpSlugs.add(naiveSlug);
    dumpNames.add(normName);
}

const NC_SOURCE = 'https://neetcode.io/practice/practice/allNC';
let restoredNC = 0;

for (const cat in data) {
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      const n = normalize(p.name);
      const s = getSlug(p);
      
      // If this problem is in the NeetCode dump but missing the NC tag, restore it
      if (dumpNames.has(n) || (s && dumpSlugs.has(s))) {
         if (!p.sources.includes(NC_SOURCE)) {
             p.sources.push(NC_SOURCE);
             restoredNC++;
         }
      }
      
      // Cleanup: unify generic 'NC' or 'Striver' if they exist by accident
      for (let i = 0; i < p.sources.length; i++) {
         if (p.sources[i] === 'NC') p.sources[i] = NC_SOURCE;
         if (p.sources[i] === 'Striver' || p.sources[i] === 'striver') p.sources[i] = 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z';
      }

      // Deduplicate sources
      p.sources = Array.from(new Set(p.sources));
    }
  }
}

console.log(`Restored NC tags for ${restoredNC} problems.`);
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
