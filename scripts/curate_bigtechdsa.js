/**
 * BigTechDsa Curation Script
 * 
 * Selects the definitive set of problems to crack any DSA interview.
 * Replaces the old 3-tier system (250/450/600) with a single curated boolean.
 * 
 * Target: EXACTLY 456 problems covering every pattern out of 1407.
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

function getSlug(p) {
  if (!p.leetcodeUrl) return null;
  const match = p.leetcodeUrl.split('/problems/')[1];
  return match ? match.replace(/\/$/, '') : null;
}

// ─── 2-source problems to INCLUDE (essential FAANG patterns) ───
// These are hand-picked.
const INCLUDE_2_SOURCE = new Set([
  '132-pattern', 'remove-duplicate-letters', 'car-fleet', 'flatten-nested-list-iterator',
  'buildings-with-an-ocean-view', 'validate-stack-sequences', 'count-good-nodes-in-binary-tree',
  'binary-tree-vertical-order-traversal', 'find-leaves-of-binary-tree',
  'lowest-common-ancestor-of-a-binary-tree-iii', 'step-by-step-directions-from-a-binary-tree-node-to-another',
  'vertical-order-traversal-of-a-binary-tree', 'count-sub-islands', 'number-of-closed-islands',
  'walls-and-gates', 'shortest-bridge', 'shortest-path-in-a-grid-with-obstacles-elimination',
  'snakes-and-ladders', 'longest-substring-with-at-most-two-distinct-characters',
  'number-of-substrings-containing-all-three-characters', 'binary-subarrays-with-sum',
  'minimum-number-of-arrows-to-burst-balloons', 'paint-house', 'minimum-cost-for-tickets',
  'combination-sum-iv', 'design-hit-counter', 'snapshot-array', 'design-browser-history',
  'increasing-triplet-subsequence', 'largest-number', 'sliding-window-median', 'happy-number',
  'ugly-number', 'ugly-number-ii', 'factorial-trailing-zeroes', 'excel-sheet-column-title',
  'valid-square', 'best-meeting-point', 'number-of-dice-rolls-with-target-sum',
  'knight-probability-in-chessboard', 'add-two-numbers-ii', 'maximum-twin-sum-of-a-linked-list'
]);

// ─── Phase 1: Score and Rank All Problems ───
let allProblems = [];
for (const cat in data) {
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      const slug = getSlug(p);
      if (!slug) continue; // Must be on LeetCode

      let score = p.sources.length * 100;

      // Heavy boost for manual hand-picks:
      if (INCLUDE_2_SOURCE.has(slug)) {
        score += 500;
      }

      // Small secondary tie-breakers:
      if (p.difficulty === 'Medium') score += 10;
      else if (p.difficulty === 'Easy') score += 5;
      else if (p.difficulty === 'Hard') score += 2;

      allProblems.push({ p, slug, score });
    }
  }
}

// Ensure uniqueness by ID just in case
const uniqueProblemsMap = new Map();
for (const item of allProblems) {
    if (!uniqueProblemsMap.has(item.slug) || uniqueProblemsMap.get(item.slug).score < item.score) {
        uniqueProblemsMap.set(item.slug, item);
    }
}

// ─── Phase 2: Pick top 456 ───
let sortedItems = Array.from(uniqueProblemsMap.values()).sort((a, b) => b.score - a.score);
const top456Slugs = new Set(sortedItems.slice(0, 456).map(item => item.slug));

let included = 0;
let excluded = 0;
let byCategory = {};

for (const cat in data) {
  if (!byCategory[cat]) byCategory[cat] = { included: 0, excluded: 0 };
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      const slug = getSlug(p);
      delete p.recommendedTier; // clean legacy
      
      if (slug && top456Slugs.has(slug)) {
        p.isBigTechDsa = true;
        top456Slugs.delete(slug); // mark used so we don't double count if duplicates exist
        included++;
        byCategory[cat].included++;
      } else {
        delete p.isBigTechDsa;
        excluded++;
        byCategory[cat].excluded++;
      }
    }
  }
}

// ─── Write updated data ───
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');

// ─── Report ───
console.log(`\n╔══════════════════════════════════════════════╗`);
console.log(`║     BigTechDsa Curation Complete             ║`);
console.log(`╠══════════════════════════════════════════════╣`);
console.log(`║  Total problems:    ${(included + excluded).toString().padStart(5)}                  ║`);
console.log(`║  BigTechDsa set:    ${included.toString().padStart(5)}                  ║`);
console.log(`║  Not included:      ${excluded.toString().padStart(5)}                  ║`);
console.log(`╚══════════════════════════════════════════════╝`);
