const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dsa/layrs_new_problems.json'), 'utf-8'));

const artifactPath = 'C:/Users/asmi2/.gemini/antigravity-ide/brain/63a429ce-c512-4d51-8e09-e717a85fe946/layrs_new_problems_report.md';

let md = `# Layrs DSA Analysis & New Problems Report

> [!NOTE]
> Analysis performed against the unified dataset of **1,419 problem entries** (1,407 unique problems) assembled across NeetCode, Striver A2Z, Algomaster, Thita, Educative Grokking (Interview & DP), and AlgoExpert.

---

## Executive Summary & Tally

| Metric | Count | Percentage |
|---|---|---|
| **Total Problems in layrs.txt** | **1,082** | 100% |
| **Already in Existing Dataset** | **675** | 62.38% |
| **Brand New Problems** | **407** | **37.62%** |

### Difficulty Distribution of New Problems

| Difficulty | New Problems | Existing Overlap | Total in Layrs |
|---|---|---|---|
| **Easy** | 53 (13.0%) | 133 | 186 |
| **Medium** | 205 (50.4%) | 385 | 591 |
| **Hard** | 149 (36.6%) | 157 | 305 |
| **Total** | **407** | **675** | **1,082** |

> [!TIP]
> Notice the heavy representation of **Hard (149)** and **Medium (205)** problems among the new additions. Layrs has an exceptionally high concentration of advanced problems (e.g. 87 new DP problems, 42 new Greedy problems, 27 new Graph problems, and 23 Binary Search problems) that significantly expand the pool for senior/staff interview prep.

---

## Category Breakdown of the 407 New Problems

### By Canonical Categories (15 Master Categories)

| Canonical Category | New Problems | Easy | Medium | Hard |
|---|---|---|---|---|
| **Arrays & Hashing** (includes Matrix, Prefix Sum, Strings, Sorting) | 99 | 24 | 48 | 27 |
| **Dynamic Programming** | 87 | 3 | 41 | 43 |
| **Greedy** (includes Intervals) | 48 | 8 | 25 | 15 |
| **Graphs** | 27 | 1 | 14 | 12 |
| **Binary Search** | 23 | 2 | 10 | 11 |
| **Bit Manipulation** | 22 | 2 | 10 | 10 |
| **Math & Geometry** | 22 | 6 | 8 | 8 |
| **Trees** (includes Tries) | 17 | 1 | 9 | 7 |
| **Heap / Priority Queue** | 15 | 0 | 10 | 5 |
| **Stack & Queue** | 12 | 1 | 9 | 2 |
| **Two Pointers** | 11 | 2 | 7 | 2 |
| **Sliding Window** | 11 | 0 | 7 | 4 |
| **Design** | 8 | 1 | 5 | 2 |
| **Backtracking** | 4 | 1 | 2 | 1 |
| **Linked List** | 1 | 1 | 0 | 0 |
| **Total** | **407** | **53** | **205** | **149** |

---

## Complete Catalog of 407 New Problems

Grouped by Canonical Category, sorted by LeetCode Frontend ID.

`;

// Group problems by canonical category
const byCat = {};
for (const p of data.problems) {
  const cat = p.canonicalCategory;
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push(p);
}

// Order of categories
const catOrder = [
  'Dynamic Programming',
  'Arrays & Hashing',
  'Greedy',
  'Graphs',
  'Binary Search',
  'Heap / Priority Queue',
  'Bit Manipulation',
  'Math & Geometry',
  'Trees',
  'Stack & Queue',
  'Sliding Window',
  'Two Pointers',
  'Design',
  'Backtracking',
  'Linked List'
];

for (const cat of catOrder) {
  const proberr = byCat[cat] || [];
  if (proberr.length === 0) continue;

  md += `\n### ${cat} (${proberr.length} problems)\n\n`;
  md += `| ID | Problem Name | Difficulty | Layrs Tag | Notes |\n`;
  md += `|---|---|---|---|---|\n`;

  proberr.forEach(p => {
    const id = p.id ? `#${p.id}` : '—';
    const link = `[${p.name}](${p.leetcodeUrl})`;
    const diffBadge = p.difficulty === 'Hard' ? '🔴 Hard' : (p.difficulty === 'Medium' ? '🟡 Medium' : '🟢 Easy');
    const tag = p.layrsTag || '—';
    const note = p.note || (p.layrsCategory !== cat ? `From Layrs "${p.layrsCategory}"` : '—');
    md += `| ${id} | ${link} | ${diffBadge} | \`${tag}\` | ${note} |\n`;
  });
}

fs.writeFileSync(artifactPath, md, 'utf-8');
console.log('Written artifact to:', artifactPath);
