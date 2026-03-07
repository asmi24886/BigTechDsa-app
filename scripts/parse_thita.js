const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('thita.html', 'utf-8');
const $ = cheerio.load(html);

const data = {};
let currentCategory = "General";
let currentSubCategory = "General";
let totalCount = 0;

// Iterate in document order!
$('h3, h4, a[href*="leetcode.com/problems/"]').each((i, el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'h3') {
        const text = $(el).text().trim();
        // Ignore random numbers or stats
        if (text && text.length > 3 && !/^\d+$/.test(text)) {
            currentCategory = text;
            currentSubCategory = text; // Reset subcat
            if (!data[currentCategory]) data[currentCategory] = {};
        }
    } else if (tag === 'h4') {
        const text = $(el).text().trim();
        if (text) {
            currentSubCategory = text;
            if (!data[currentCategory]) data[currentCategory] = {};
            if (!data[currentCategory][currentSubCategory]) data[currentCategory][currentSubCategory] = [];
        }
    } else if (tag === 'a') {
        if (!data[currentCategory]) data[currentCategory] = {};
        if (!data[currentCategory][currentSubCategory]) data[currentCategory][currentSubCategory] = [];

        const rowDiv = $(el).closest('.group');
        const h5 = rowDiv.find('h5');

        let problemName = h5.find('span.truncate').text().trim();
        if (!problemName) {
            problemName = h5.text().replace(/\[[EMH]\]/g, '').replace(/^\d+\.\s*/, '').trim();
        }
        if (!problemName) {
            const wholeText = rowDiv.find('.truncate').first().text().trim();
            if (wholeText) problemName = wholeText;
        }

        const leetcodeUrl = $(el).attr('href');

        if (problemName && leetcodeUrl && leetcodeUrl.includes('leetcode.com/problems/')) {
            if (!data[currentCategory][currentSubCategory].some(p => p.name === problemName)) {
                data[currentCategory][currentSubCategory].push({
                    name: problemName,
                    leetcodeUrl: leetcodeUrl,
                    source: 'https://thita.io',
                    leetcodeId: ''
                });
                totalCount++;
            }
        }
    }
});

// Cleanup empty objects
for (const cat in data) {
    for (const subCat in data[cat]) {
        if (data[cat][subCat].length === 0) {
            delete data[cat][subCat];
        }
    }
    if (Object.keys(data[cat]).length === 0) {
        delete data[cat];
    }
}

fs.writeFileSync('data/dsa/dsa_thita.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${totalCount} problems across ${Object.keys(data).length} categories.`);
