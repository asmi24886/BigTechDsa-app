const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('algomaster.html', 'utf-8');
const $ = cheerio.load(html);

const data = {};
let totalCount = 0;

// Find all category containers. Each seems to be a div that has an h3 for the category
$('h3.tracking-tight').each((i, el) => {
    const header = $(el).text().trim();
    if (!header) return;

    const problems = [];

    // Find the closest parent container that wraps both the header and the problem list
    // The header is inside a div structure, and the problems are inside tables or list divs following it.
    // In the provided HTML, the header is at top level of a block, followed by <div class="hidden lg:block overflow-x-auto"> which holds the table.
    const sectionContainer = $(el).closest('.mb-8'); // Looking at DOM, categories might be in big blocks
    if (sectionContainer.length === 0) return;

    // Let's find rows inside this section container
    // It has a <table class="w-full caption-bottom text-sm"> with <tbody><tr>
    sectionContainer.find('tbody tr').each((j, row) => {
        // Problem name and link is inside the second td, which has an anchor tag
        const linkNode = $(row).find('td').eq(1).find('a').first();
        const name = linkNode.text().trim();
        const lcUrl = linkNode.attr('href') || '';

        // Ignore if not a valid leetcode problem link
        if (!name || !lcUrl.includes('leetcode.com/problems/')) return;

        // Check if we already added this problem in this category to prevent duplicates from multiple views (mobile/desktop)
        if (!problems.some(p => p.name === name)) {
            problems.push({
                name: name,
                leetcodeUrl: lcUrl,
                source: "https://algomaster.io/practice/dsa-patterns",
                leetcodeId: ""
            });
        }
    });

    if (problems.length > 0) {
        data[header] = {
            [header]: problems // Initially set subcategory same as category, to be enriched later
        };
        totalCount += problems.length;
    }
});

fs.writeFileSync('data/dsa/dsa_algomaster.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${totalCount} problems across ${Object.keys(data).length} categories.`);
