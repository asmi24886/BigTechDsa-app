const fs = require('fs');
const path = require('path');

// Load verification results
const verifPath = path.join(__dirname, 'lc_verification.json');
const verifData = JSON.parse(fs.readFileSync(verifPath, 'utf-8'));

// The 405 valid
const allNew = [...verifData.validOnLeetCode];

// Handle "Play with Chips" -> LC 1217
allNew.push({
  catName: 'Greedy',
  indexInCat: 1,
  rawLines: ['Play with Chips', '#greedy', 'Easy', '—', '—', 'Practice'],
  name: 'Play with Chips',
  tag: '#greedy',
  difficulty: 'Easy',
  slug: 'minimum-cost-to-move-chips-to-the-same-position',
  frontendId: '1217',
  lcTitle: 'Minimum Cost to Move Chips to The Same Position',
  lcSlug: 'minimum-cost-to-move-chips-to-the-same-position',
  lcDifficulty: 'Easy',
  note: 'Originally titled "Play with Chips" on LeetCode'
});

// Handle "Shortest Subarray with OR at Least K"
allNew.push({
  catName: 'Bit Manipulation',
  indexInCat: 40,
  rawLines: ['Shortest Subarray with OR at Least K', '#bit-manipulation', 'Hard', '—', '—', 'Practice'],
  name: 'Shortest Subarray with OR at Least K',
  tag: '#bit-manipulation',
  difficulty: 'Hard',
  slug: 'shortest-subarray-with-or-at-least-k-i',
  frontendId: '3095',
  lcTitle: 'Shortest Subarray With OR at Least K I',
  lcSlug: 'shortest-subarray-with-or-at-least-k-i',
  lcDifficulty: 'Easy',
  note: 'Layrs listed without roman numeral (LC 3095 Part I; Part II LC 3097 is already matched)'
});

// Sort by Frontend ID numerically if available, or by name
allNew.sort((a, b) => {
  const idA = parseInt(a.frontendId, 10) || 99999;
  const idB = parseInt(b.frontendId, 10) || 99999;
  return idA - idB;
});

console.log(`Total new problems compiled: ${allNew.length}`);

// Map Layrs categories to our 15 Canonical Categories
const CANONICAL_MAP = {
  'Arrays & Hashing': 'Arrays & Hashing',
  'Two Pointers': 'Two Pointers',
  'Sliding Window': 'Sliding Window',
  'Stack': 'Stack & Queue',
  'Queue': 'Stack & Queue',
  'Binary Search': 'Binary Search',
  'Linked List': 'Linked List',
  'Trees': 'Trees',
  'Tries': 'Trees',
  'Heap / Priority Queue': 'Heap / Priority Queue',
  'Backtracking': 'Backtracking',
  'Graphs': 'Graphs',
  'Dynamic Programming': 'Dynamic Programming',
  'Greedy': 'Greedy',
  'Bit Manipulation': 'Bit Manipulation',
  'Math & Geometry': 'Math & Geometry',
  'Prefix Sum': 'Arrays & Hashing',
  'Matrix': 'Arrays & Hashing',
  'Intervals & Advanced Trees': 'Greedy', // Intervals typically map to Greedy or Trees
  'Sorting': 'Arrays & Hashing',
  'Strings': 'Arrays & Hashing',
  'Design & Simulation': 'Design',
  'Other': 'Arrays & Hashing'
};

allNew.forEach(p => {
  p.canonicalCat = CANONICAL_MAP[p.catName] || p.catName;
  p.leetcodeUrl = `https://leetcode.com/problems/${p.lcSlug || p.slug}/`;
});

// Tally by Difficulty
const diffBreakdown = { Easy: 0, Medium: 0, Hard: 0 };
allNew.forEach(p => {
  const diff = p.lcDifficulty || p.difficulty;
  diffBreakdown[diff] = (diffBreakdown[diff] || 0) + 1;
});
console.log('Difficulty breakdown (LeetCode official):', diffBreakdown);

// Tally by Layrs Category
const layrsCatBreakdown = {};
allNew.forEach(p => {
  layrsCatBreakdown[p.catName] = (layrsCatBreakdown[p.catName] || 0) + 1;
});
console.log('\nLayrs Category Breakdown:');
Object.entries(layrsCatBreakdown).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

// Tally by Canonical Category
const canonicalBreakdown = {};
allNew.forEach(p => {
  canonicalBreakdown[p.canonicalCat] = (canonicalBreakdown[p.canonicalCat] || 0) + 1;
});
console.log('\nCanonical Category Breakdown:');
Object.entries(canonicalBreakdown).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

// Save JSON artifact
const outputData = {
  metadata: {
    source: 'layrs.txt',
    totalInLayrs: 1082,
    matchedWithExisting: 675,
    newProblemsCount: allNew.length,
    generatedAt: new Date().toISOString()
  },
  difficultyBreakdown: diffBreakdown,
  layrsCategoryBreakdown: layrsCatBreakdown,
  canonicalCategoryBreakdown: canonicalBreakdown,
  problems: allNew.map(p => ({
    id: p.frontendId || '',
    name: p.lcTitle || p.name,
    rawName: p.name,
    slug: p.lcSlug || p.slug,
    leetcodeUrl: p.leetcodeUrl,
    difficulty: p.lcDifficulty || p.difficulty,
    layrsDifficulty: p.difficulty,
    layrsCategory: p.catName,
    layrsTag: p.tag,
    canonicalCategory: p.canonicalCat,
    note: p.note || undefined
  }))
};

fs.writeFileSync(path.join(__dirname, '../data/dsa/layrs_new_problems.json'), JSON.stringify(outputData, null, 2));
console.log('\nSaved data/dsa/layrs_new_problems.json successfully!');
