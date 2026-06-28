/**
 * BigTechDsa 3-Tier Curation Script
 * 
 * Selects 650 problems and assigns them to three tiers:
 *   - Iron 300:    The 300 highest-scored must-do problems
 *   - Gold 250:    The next 250 level-up problems
 *   - Platinum 100: The final 100 bar-raiser problems for senior/staff
 * 
 * Scoring priorities:
 *   - Multi-source consensus is the primary signal
 *   - Graphs & DP get a category boost
 *   - Math, Bit Manipulation, Design get a penalty
 *   - Hard/Medium favored over Easy for senior/staff relevance
 *   - Easy problems excluded unless they have >= 4 sources or are hand-picked
 *   - Trees capped at 45 to prevent overrepresentation
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

// ─── Hand-picked essential FAANG problems (guaranteed inclusion) ───
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

// ─── High-priority categories that deserve extra representation ───
const HIGH_PRIORITY_CATS = new Set(['Graphs', 'Dynamic Programming']);

// ─── Low-priority categories ───
const LOW_PRIORITY_CATS = new Set(['Math & Geometry', 'Bit Manipulation', 'Design']);

// ─── Per-category caps ───
const CATEGORY_CAPS = {
  'Trees': 45,
};

// ─── Tier sizes ───
const IRON_SIZE = 300;
const GOLD_SIZE = 250;
const PLATINUM_SIZE = 100;
const TOTAL_SIZE = IRON_SIZE + GOLD_SIZE + PLATINUM_SIZE; // 650

// ─── Phase 1: Score and Rank All Problems ───
let allProblems = [];
let totalProblemsWithAtLeastTwoSources = 0;
for (const cat in data) {
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      const slug = getSlug(p);
      if (!slug) continue; // Must be on LeetCode

      if (p.sources && p.sources.length >= 2) {
        totalProblemsWithAtLeastTwoSources++;
      }

      const isHandPicked = INCLUDE_2_SOURCE.has(slug);

      // Skip Easy problems unless they have strong consensus or are hand-picked
      if (p.difficulty === 'Easy' && p.sources.length < 4 && !isHandPicked) {
        continue;
      }

      let score = p.sources.length * 100;

      // Hand-picked boost
      if (isHandPicked) {
        score += 500;
      }

      // Category boosts/penalties
      if (HIGH_PRIORITY_CATS.has(cat)) {
        score += 100;
      }
      if (LOW_PRIORITY_CATS.has(cat)) {
        score -= 250;
      }

      // Difficulty weighting for senior/staff focus
      if (p.difficulty === 'Hard') score += 50;
      else if (p.difficulty === 'Medium') score += 20;
      else if (p.difficulty === 'Easy') score -= 100;

      allProblems.push({ p, slug, score, cat });
    }
  }
}

// Ensure uniqueness by slug
const uniqueProblemsMap = new Map();
for (const item of allProblems) {
  if (!uniqueProblemsMap.has(item.slug) || uniqueProblemsMap.get(item.slug).score < item.score) {
    uniqueProblemsMap.set(item.slug, item);
  }
}

// ─── Phase 2: Select top 650 with per-category caps ───
let sortedItems = Array.from(uniqueProblemsMap.values()).sort((a, b) => b.score - a.score);

const catCounts = {};
const selectedItems = [];
for (const item of sortedItems) {
  if (selectedItems.length >= TOTAL_SIZE) break;
  const cap = CATEGORY_CAPS[item.cat];
  if (cap !== undefined) {
    catCounts[item.cat] = (catCounts[item.cat] || 0);
    if (catCounts[item.cat] >= cap) continue;
    catCounts[item.cat]++;
  }
  selectedItems.push(item);
}

// ─── Phase 3: Assign tiers by rank ───
// selectedItems is already sorted by score (descending)
const tierMap = new Map(); // slug -> tier
for (let i = 0; i < selectedItems.length; i++) {
  const item = selectedItems[i];
  let tier;
  if (i < IRON_SIZE) {
    tier = 'Iron';
  } else if (i < IRON_SIZE + GOLD_SIZE) {
    tier = 'Gold';
  } else {
    tier = 'Platinum';
  }
  tierMap.set(item.slug, tier);
}

// ─── Phase 4: Apply tiers to data ───
let tierCounts = { Iron: 0, Gold: 0, Platinum: 0 };
let excluded = 0;
let byCategory = {};

for (const cat in data) {
  if (!byCategory[cat]) byCategory[cat] = { Iron: 0, Gold: 0, Platinum: 0, excluded: 0 };
  for (const sub in data[cat]) {
    for (const p of data[cat][sub]) {
      const slug = getSlug(p);
      delete p.recommendedTier; // clean legacy

      if (slug && tierMap.has(slug)) {
        const tier = tierMap.get(slug);
        p.isBigTechDsa = true;
        p.bigTechDsaTier = tier;
        tierMap.delete(slug); // prevent double-counting duplicates
        tierCounts[tier]++;
        byCategory[cat][tier]++;
      } else {
        delete p.isBigTechDsa;
        delete p.bigTechDsaTier;
        excluded++;
        byCategory[cat].excluded++;
      }
    }
  }
}

const totalIncluded = tierCounts.Iron + tierCounts.Gold + tierCounts.Platinum;

// ─── Write updated data ───
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');

// ─── Report ───
console.log(`\n╔═══════════════════════════════════════════════════════╗`);
console.log(`║         BigTechDsa 3-Tier Curation Complete           ║`);
console.log(`╠═══════════════════════════════════════════════════════╣`);
console.log(`║  Total problems:     ${(totalIncluded + excluded).toString().padStart(5)}                           ║`);
console.log(`║  Problems with >=2 sources: ${totalProblemsWithAtLeastTwoSources.toString().padStart(5)}                     ║`);
console.log(`║  ─────────────────────────────────────────────────    ║`);
console.log(`║  🥉 Iron 300:        ${tierCounts.Iron.toString().padStart(5)}   (must-do core)            ║`);
console.log(`║  🥇 Gold 250:        ${tierCounts.Gold.toString().padStart(5)}   (level-up)                ║`);
console.log(`║  💎 Platinum 100:    ${tierCounts.Platinum.toString().padStart(5)}   (bar-raiser)              ║`);
console.log(`║  ─────────────────────────────────────────────────    ║`);
console.log(`║  Total curated:      ${totalIncluded.toString().padStart(5)}                           ║`);
console.log(`║  Not included:       ${excluded.toString().padStart(5)}                           ║`);
console.log(`╚═══════════════════════════════════════════════════════╝`);

console.log(`\n── Per-Category Breakdown ──`);
for (const cat in byCategory) {
  const c = byCategory[cat];
  const total = c.Iron + c.Gold + c.Platinum;
  if (total > 0) {
    console.log(`  ${cat.padEnd(25)} Iron:${c.Iron.toString().padStart(3)}  Gold:${c.Gold.toString().padStart(3)}  Plat:${c.Platinum.toString().padStart(3)}  | Total:${total.toString().padStart(3)}`);
  }
}
