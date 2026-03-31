const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('algomaster.html', 'utf-8');
const $ = cheerio.load(html);

const data = {};
let totalCount = 0;

// Each category is a .mb-8 section with an h3.tracking-tight header
// and a table with tbody > tr rows containing leetcode links.
$('.mb-8').each(function () {
    const h3 = $(this).find('h3.tracking-tight').first().text().trim();
    if (!h3) return;

    const problems = [];

    // Find rows inside the desktop table (tbody tr)
    $(this).find('tbody tr').each(function () {
        // Problem name is inside the second td's first anchor tag
        const nameNode = $(this).find('td').eq(1).find('a').first();
        const name = nameNode.text().trim();
        
        // LeetCode link might be in a different td (e.g. td 4)
        const lcNode = $(this).find('a[href*="leetcode.com/problems/"]').first();
        const lcUrl = lcNode.attr('href') || '';

        // Ignore if no valid name or leetcode link in this row
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

    // Fallback: if no desktop table rows found, try mobile view links
    if (problems.length === 0) {
        $(this).find('a[href*="leetcode.com/problems/"]').each(function () {
            const lcUrl = $(this).attr('href') || '';
            // Find the problem name from the nearest sibling link (the practice link, not the LC icon)
            const card = $(this).closest('.border.rounded-lg');
            if (!card.length) return;
            const practiceLink = card.find('a[href^="/practice/dsa/"]').first();
            const name = practiceLink.text().trim();
            if (!name || !lcUrl.includes('leetcode.com/problems/')) return;

            if (!problems.some(p => p.name === name)) {
                problems.push({
                    name: name,
                    leetcodeUrl: lcUrl,
                    source: "https://algomaster.io/practice/dsa-patterns",
                    leetcodeId: ""
                });
            }
        });
    }

    if (problems.length > 0) {
        if (!data[h3]) {
            data[h3] = { [h3]: [] };
        }
        data[h3][h3].push(...problems);
        totalCount += problems.length;
    }
});

fs.writeFileSync('data/dsa/dsa_algomaster.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${totalCount} problems across ${Object.keys(data).length} categories.`);
