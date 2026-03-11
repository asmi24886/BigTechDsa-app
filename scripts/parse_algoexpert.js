const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('algoexpert.html', 'utf-8');

// The algoexpert.html has embedded JS data in a `const data = [...]` block.
// We extract that data array, evaluate it, then produce our JSON.

// Extract the JS data array from the script tag
const scriptMatch = html.match(/const data = \[([\s\S]*?)\];\s*\n\s*let currentDiff/);
if (!scriptMatch) {
    console.error('Could not find data array in algoexpert.html');
    process.exit(1);
}

// Wrap in brackets and evaluate
const dataStr = '[' + scriptMatch[1] + ']';

// Use Function constructor to safely evaluate (it's just object literals)
const data = new Function('return ' + dataStr)();

const output = {};
let totalCount = 0;
let withLcCount = 0;
let skippedUnique = 0;

// AlgoExpert category → our raw category name mapping
// We'll map AE categories to sensible category names that assemble_data.js can then map to canonical
const AE_CATEGORY_MAP = {
    'Arrays': 'Arrays',
    'Strings': 'Strings',
    'Linked Lists': 'Linked Lists',
    'Stacks': 'Stacks',
    'Queues': 'Queues',
    'Binary Trees': 'Binary Trees',
    'Binary Search Trees': 'Binary Search Trees',
    'Searching (Graphs/BFS/DFS)': 'Searching (Graphs/BFS/DFS)',
    'Heaps': 'Heaps',
    'Tries': 'Tries',
    'Sorting': 'Sorting',
    'Dynamic Programming': 'Dynamic Programming',
    'Recursion': 'Recursion',
    'Binary Search': 'Binary Search',
    'Famous Algorithms': 'Famous Algorithms',
};

data.forEach(cat => {
    const catName = cat.cat;
    // Use original AE category name as the raw category
    const rawCategory = AE_CATEGORY_MAP[catName] || catName;

    cat.problems.forEach(p => {
        // Skip problems with no LC equivalent (unique to AlgoExpert)
        if (!p.lc || p.lc.length === 0) {
            skippedUnique++;
            return;
        }

        // Each AE problem can map to multiple LC problems
        p.lc.forEach(lcProb => {
            const slug = lcProb.title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            const lcUrl = `https://leetcode.com/problems/${slug}/`;

            // Use category as subcategory initially (assemble_data will map it)
            if (!output[rawCategory]) {
                output[rawCategory] = {};
            }
            if (!output[rawCategory][rawCategory]) {
                output[rawCategory][rawCategory] = [];
            }

            // Deduplicate within our output (same LC problem appearing under multiple AE categories)
            if (!output[rawCategory][rawCategory].some(existing => existing.leetcodeUrl === lcUrl)) {
                output[rawCategory][rawCategory].push({
                    name: lcProb.title,
                    leetcodeUrl: lcUrl,
                    source: "https://www.algoexpert.io/questions",
                    leetcodeId: String(lcProb.n)
                });
                totalCount++;
                withLcCount++;
            }
        });
    });
});

fs.writeFileSync('data/dsa/dsa_algoexpert.json', JSON.stringify(output, null, 2));
console.log(`Extracted ${totalCount} problems across ${Object.keys(output).length} categories.`);
console.log(`Skipped ${skippedUnique} problems unique to AlgoExpert (no LC equivalent).`);
console.log(`All ${withLcCount} extracted problems have LeetCode URLs.`);
