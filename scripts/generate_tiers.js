const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Extract existing 500 hand-curated slugs from mark_recommended.js
const scriptContent = fs.readFileSync(path.join(__dirname, 'mark_recommended.js'), 'utf-8');
const slugMatches = [...scriptContent.matchAll(/'([^']+)'/g)].map(m => m[1]);
const currentCuratedSet = new Set(slugMatches); // This contains all 500 slugs + some other strings, but good enough for a boost

let allProblems = [];

for (const cat in data) {
    // Penalize Bit Manipulation and Math & Geometry
    const isPenalizedCategory = cat === 'Bit Manipulation' || cat === 'Math & Geometry';

    for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
            // Exclude Unknown difficulty
            if (p.difficulty === 'Unknown') continue;

            // Generate an identifier (slug if leetcode, else name)
            const id = p.leetcodeUrl ? p.leetcodeUrl.split('/problems/')[1].replace(/\/$/, '') : p.name;

            // Calculate score
            let score = 0;
            score += p.sources.length * 20; // High weight for multi-source
            
            if (p.difficulty === 'Medium') score += 10;
            else if (p.difficulty === 'Easy') score += 5;
            else if (p.difficulty === 'Hard') score += 2;

            if (currentCuratedSet.has(id)) score += 30; // Preserve existing curation
            
            if (isPenalizedCategory) score -= 150; // Heavy penalty

            // Add slight random jitter to break ties (deterministic-ish based on name length)
            score += (p.name.length % 5);

            allProblems.push({
                id,
                name: p.name,
                cat,
                sub,
                difficulty: p.difficulty,
                sources: p.sources.length,
                score
            });
        }
    }
}

// Ensure uniqueness by ID
const uniqueProblemsMap = new Map();
for (const p of allProblems) {
    if (!uniqueProblemsMap.has(p.id) || uniqueProblemsMap.get(p.id).score < p.score) {
        uniqueProblemsMap.set(p.id, p);
    }
}

let sortedProblems = Array.from(uniqueProblemsMap.values()).sort((a, b) => b.score - a.score);

// Special rule for penalized categories: ensure we don't completely avoid them by picking at least 2 of each for 250, 4 for 450, 6 for 600
const getTopFromCat = (catName, count) => {
    return sortedProblems.filter(p => p.cat === catName).slice(0, count);
};

const forcedMath = getTopFromCat('Math & Geometry', 6);
const forcedBit = getTopFromCat('Bit Manipulation', 6);

// Remove forced from main pool
const forcedIds = new Set([...forcedMath, ...forcedBit].map(p => p.id));
sortedProblems = sortedProblems.filter(p => !forcedIds.has(p.id));

// Now construct the final lists
let tier250 = [];
let tier450Additional = [];
let tier600Additional = [];

// Base 250
tier250.push(...forcedMath.slice(0, 2));
tier250.push(...forcedBit.slice(0, 2));
while (tier250.length < 250) {
    tier250.push(sortedProblems.shift());
}

// Next 200 for 450
tier450Additional.push(...forcedMath.slice(2, 4));
tier450Additional.push(...forcedBit.slice(2, 4));
while (tier450Additional.length < 200) {
    tier450Additional.push(sortedProblems.shift());
}

// Next 150 for 600
tier600Additional.push(...forcedMath.slice(4, 6));
tier600Additional.push(...forcedBit.slice(4, 6));
while (tier600Additional.length < 150) {
    tier600Additional.push(sortedProblems.shift());
}

// Format the output
const formatArray = (arr, title) => {
    let out = `const ${title} = new Set([\n`;
    const byCat = {};
    arr.forEach(p => {
        if (!byCat[p.cat]) byCat[p.cat] = [];
        byCat[p.cat].push(p);
    });
    
    for (const cat of Object.keys(byCat).sort()) {
        out += `    // --- ${cat} ---\n`;
        const sortedInCat = byCat[cat].sort((a, b) => b.score - a.score);
        sortedInCat.forEach(p => {
            out += `    '${p.id}', // ${p.difficulty}, src: ${p.sources}, score: ${p.score}\n`;
        });
    }
    out += `]);\n`;
    return out;
};

fs.writeFileSync('scripts/generated_tiers.txt', 
    formatArray(tier250, 'PICKS_250_SLUGS') + '\n\n' + 
    formatArray(tier450Additional, 'PICKS_450_SLUGS') + '\n\n' + 
    formatArray(tier600Additional, 'PICKS_600_SLUGS')
);

console.log("Generated Tiers successfully to scripts/generated_tiers.txt");
console.log(`250: ${tier250.length}, 450: ${tier450Additional.length}, 600: ${tier600Additional.length}`);

// Print category distribution for 250
const dist250 = tier250.reduce((acc, p) => { acc[p.cat] = (acc[p.cat] || 0) + 1; return acc; }, {});
console.log("\nTier 250 Category Distribution:");
Object.entries(dist250).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
