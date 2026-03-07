# AGENT.md - CS Topics Organizer

## Overview
A spec-driven project to build a premium, terracotta-themed web application for organizing DSA study resources. The data pipeline extracts problems from 6 online sources, deduplicates, categorizes, and enriches them into a unified dataset.

## Core Philosophy
- **Data-First**: Content is derived from multiple HTML/JSON sources, parsed via Cheerio.
- **Deduplication**: Problems appearing in multiple sources are merged by LeetCode URL slug (primary) or normalized name (fallback).
- **Pattern-Based Organization**: 15 canonical categories, 171 sub-categories mapped from ~60 raw source category names.
- **Premium UI**: Terracotta theme, dark mode by default, glassmorphism, responsive dashboard.

## Data Sources (6 total)

| Source | File | Parser | Problems |
|---|---|---|---|
| NeetCode | neetcode.html | parse_neetcode.js | 924 |
| Educative (Grokking Interview) | educative1.html | parse_educative.js | 511 |
| Striver A2Z | striver.html | parse_striver.js | 423 (363 w/ LC URLs) |
| Thita | thita.html | parse_thita.js | 372 |
| Algomaster | algomaster.html | parse_algomaster.js | 300 |
| Educative (Grokking DP) | educative2.html | parse_educative.js | 41 |

## Directory Structure
```
cs-topics-organizer/
├── scripts/
│   ├── parse_neetcode.js       # → data/dsa/dsa_neetcode.json
│   ├── parse_algomaster.js     # → data/dsa/dsa_algomaster.json
│   ├── parse_thita.js          # → data/dsa/dsa_thita.json
│   ├── parse_striver.js        # → data/dsa/dsa_striver.json (400+ NAME_TO_SLUG mappings)
│   ├── parse_educative.js      # → data/dsa/dsa_educative1.json + dsa_educative2.json
│   ├── assemble_data.js        # Merges all → merged_dsa.json (CANONICAL_CATEGORY + CANONICAL_SUBCATEGORY maps)
│   └── enrich_data.js          # Adds difficulty (800+ slug mappings + educative HTML extraction)
├── data/dsa/
│   ├── dsa_*.json              # Per-source extracted data
│   └── merged_dsa.json         # ← FINAL OUTPUT: 1,347 unique problems
├── *.html                      # Source HTML files
└── package.json                # cheerio dependency
```

## Processing Pipeline

### Step 1: Parse (per-source)
Each `parse_*.js` script extracts problems from HTML using Cheerio, outputting per-source JSON.
- **Striver special case**: Many problems lack LC links. A 400+ entry `NAME_TO_SLUG` map + case-insensitive lookup constructs URLs from pretrained knowledge. Achieves 86% LC URL coverage.
- **Educative special case**: Educative URL slugs closely match LeetCode slugs, enabling direct mapping.

### Step 2: Assemble (`assemble_data.js`)
- Merges all source JSONs with canonical category/subcategory mapping
- **Source priority**: Thita → Striver → Algomaster → NeetCode → Educative1 → Educative2 (Thita has richest sub-patterns)
- Deduplicates by LeetCode slug; merges `sources[]` arrays
- Outputs `merged_dsa.json`

### Step 3: Enrich (`enrich_data.js`)
- Adds `difficulty` field (Easy/Medium/Hard) using:
  - 800+ hardcoded slug→difficulty mappings (4 batches from pretrained LC knowledge)
  - 510 difficulties extracted from educative1.html badge elements
- Audits for cross-category duplicates
- Prints comprehensive statistics

## Final Dataset (merged_dsa.json)

**Enriched Problem Schema:**
```json
{
  "Category Name": {
    "Sub-category Name": [
      {
        "name": "Two Sum",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "leetcodeId": "",
        "sources": ["https://neetcode.io", "https://thita.io"],
        "difficulty": "Easy"
      }
    ]
  }
}
```

**Stats:**
- **1,347** unique problems
- **1,276** (94.7%) with LeetCode URLs
- **1,275** (94.7%) with difficulty assigned
- **555** (41.2%) appear in multiple sources; **7** in all 6 sources
- Difficulty: Easy 276 (20.5%), Medium 742 (55.1%), Hard 257 (19.1%), Unknown 72 (5.3%)
- 72 unknowns are Striver theory/intro topics with no LC equivalent

## 15 Canonical Categories
Arrays & Hashing (263), Two Pointers (62), Sliding Window (58), Stack & Queue (68), Binary Search (59), Linked List (50), Trees (152), Heap / Priority Queue (62), Graphs (153), Dynamic Programming (160), Backtracking (56), Greedy (87), Bit Manipulation (45), Math & Geometry (63), Design (9)

## Runbook for Agents
1. **Adding a new source**: Create `parse_<source>.js`, add category mappings to `CANONICAL_CATEGORY` in `assemble_data.js`, add filename to `sourceFiles` array.
2. **Re-merging**: Run `node scripts/assemble_data.js` then `node scripts/enrich_data.js`.
3. **Adding difficulties**: Add slug→difficulty entries to the appropriate batch in `enrich_data.js`.
4. **UI work**: Ensure any changes adhere to the "Terracotta" design tokens.

## Current Progress
- [x] Directory structure & data architecture
- [x] All 6 sources extracted and parsed
- [x] Deduplication & canonical category merging
- [x] Difficulty enrichment (94.7% coverage)
- [x] Final statistics & audit (0 duplicates)
- [ ] Initialize Vite + React project with Terracotta theme
- [ ] Build dynamic Dashboard from merged_dsa.json

