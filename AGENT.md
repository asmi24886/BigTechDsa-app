# AGENT.md - CS Topics Organizer

## Overview
A spec-driven project to build a premium, terracotta-themed web application for organizing DSA study resources. The data pipeline extracts problems from 7 online sources, deduplicates, categorizes, and enriches them into a unified dataset.

## Core Philosophy
- **Data-First**: Content is derived from multiple HTML/JSON sources, parsed via Cheerio.
- **Deduplication**: Problems appearing in multiple sources are merged by LeetCode URL slug (primary) or normalized name (fallback).
- **Pattern-Based Organization**: 15 canonical categories, 171 sub-categories mapped from ~60 raw source category names.
- **Premium UI**: Terracotta theme, dark mode by default, glassmorphism, responsive dashboard.

## Data Sources (7 total)

| Source | File | Parser | Problems |
|---|---|---|---|
| NeetCode | neetcode.html | parse_neetcode.js | 924 |
| Educative (Grokking Interview) | educative1.html | parse_educative.js | 511 |
| Striver A2Z | striver.html | parse_striver.js | 423 (363 w/ LC URLs) |
| Thita | thita.html | parse_thita.js | 372 |
| Algomaster | algomaster.html | parse_algomaster.js | 300 |
| AlgoExpert | algoexpert.html | parse_algoexpert.js | 143 (LC-mapped, 44 AE-unique skipped) |
| Educative (Grokking DP) | educative2.html | parse_educative.js | 41 |

## Directory Structure
```
cs-topics-organizer/
├── scripts/
│   ├── parse_neetcode.js       # → data/dsa/dsa_neetcode.json
│   ├── parse_algomaster.js     # → data/dsa/dsa_algomaster.json
│   ├── parse_algoexpert.js     # → data/dsa/dsa_algoexpert.json (skips AE-unique, maps LC equivalents)
│   ├── parse_thita.js          # → data/dsa/dsa_thita.json
│   ├── parse_striver.js        # → data/dsa/dsa_striver.json (400+ NAME_TO_SLUG mappings)
│   ├── parse_educative.js      # → data/dsa/dsa_educative1.json + dsa_educative2.json
│   ├── assemble_data.js        # Merges all → merged_dsa.json (CANONICAL_CATEGORY + CANONICAL_SUBCATEGORY maps)
│   ├── mark_recommended.js     # Adds recommended:true to 399 curated "BigTechDsa Picks"
│   └── enrich_data.js          # Adds difficulty (800+ slug mappings + educative HTML extraction)
├── data/dsa/
│   ├── dsa_*.json              # Per-source extracted data
│   └── merged_dsa.json         # ← FINAL OUTPUT: 1,354 unique problems, 399 recommended
├── *.html                      # Source HTML files
└── package.json                # cheerio dependency
```

## Processing Pipeline

### Step 1: Parse (per-source)
Each `parse_*.js` script extracts problems from HTML using Cheerio, outputting per-source JSON.
- **Striver special case**: Many problems lack LC links. A 400+ entry `NAME_TO_SLUG` map + case-insensitive lookup constructs URLs from pretrained knowledge. Achieves 86% LC URL coverage.
- **Educative special case**: Educative URL slugs closely match LeetCode slugs, enabling direct mapping.
- **AlgoExpert special case**: AE HTML embeds a JS `const data = [...]` with LC numbers + titles. Parser evaluates that data, skips problems without LC mappings (44 unique to AE), and constructs LC URLs from slugified titles.

### Step 2: Assemble (`assemble_data.js`)
- Merges all source JSONs with canonical category/subcategory mapping
- **Source priority**: Thita → Striver → Algomaster → AlgoExpert → NeetCode → Educative1 → Educative2 (Thita has richest sub-patterns)
- Deduplicates by LeetCode slug; merges `sources[]` arrays
- Outputs `merged_dsa.json`

### Step 3: Enrich (`enrich_data.js`)
- Adds `difficulty` field (Easy/Medium/Hard) using:
  - 800+ hardcoded slug→difficulty mappings (4 batches from pretrained LC knowledge)
  - 510 difficulties extracted from educative1.html badge elements
- Audits for cross-category duplicates
- Prints comprehensive statistics

### Step 4: Curate (`mark_recommended.js`)
- Adds `recommended: true` to 500 hand-curated problems ("BigTechDsa Picks")
- Selection based on FAANG interview frequency, pattern teaching value, multi-source overlap
- Distribution: Easy 86, Medium 249, Hard 61, Unknown 3
- All 15 categories covered (range: 6/9 Design to 64/160 DP)

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
        "difficulty": "Easy",
        "recommended": true
      }
    ]
  }
}
```

**Stats:**
- **1,354** unique problems
- **1,283** (94.8%) with LeetCode URLs
- **1,276** (94.2%) with difficulty assigned
- **564** (41.7%) appear in multiple sources
- Difficulty: Easy 276 (20.4%), Medium 743 (54.9%), Hard 257 (19.0%), Unknown 78 (5.8%)
- 78 unknowns are Striver theory/intro topics with no LC equivalent
- **399** (29.5%) recommended problems

## 15 Canonical Categories
Arrays & Hashing (267), Two Pointers (62), Sliding Window (58), Stack & Queue (68), Binary Search (60), Linked List (50), Trees (155), Heap / Priority Queue (62), Graphs (154), Dynamic Programming (160), Backtracking (55), Greedy (87), Bit Manipulation (45), Math & Geometry (62), Design (9)

## Runbook for Agents
1. **Adding a new source**: Create `parse_<source>.js`, add category mappings to `CANONICAL_CATEGORY` in `assemble_data.js`, add filename to `sourceFiles` array.
2. **Adding Sub-category mappings**: Add to `CANONICAL_SUBCATEGORY` (search → replace) + `RECLASSIFY_RULES` for finer splits.
3. **Updating curated picks**: Edit `RECOMMENDED_SLUGS` set in `mark_recommended.js`, run script.
4. **Adding difficulties**: Add slug→difficulty entries to the appropriate batch in `enrich_data.js`.
5. **Full pipeline**: `node scripts/parse_*.js` → `node scripts/assemble_data.js` → `node scripts/enrich_data.js` → `node scripts/mark_recommended.js` → `node scripts/copy_to_web.js`
6. **UI work**: Ensure any changes adhere to the "Terracotta" design tokens.

## Current Progress
- [x] Directory structure & data architecture
- [x] All 7 sources extracted and parsed
- [x] Deduplication & canonical category merging
- [x] Difficulty enrichment (94.7% coverage)
- [x] Final statistics & audit (0 duplicates)
- [ ] Initialize Vite + React project with Terracotta theme
- [ ] Build dynamic Dashboard from merged_dsa.json

