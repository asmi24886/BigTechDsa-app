const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('thita.html', 'utf-8');
const $ = cheerio.load(html);

console.log("h3 count:", $('h3').length);

const links = $('a[href*="leetcode.com/"]');
console.log("LeetCode links count:", links.length);

if (links.length > 0) {
    const firstLink = links.first();
    console.log("\nFirst link HTML:", firstLink.parent().html());

    // Find closest h4
    const h4 = firstLink.closest('.text-card-foreground').find('h4').first();
    console.log("Associated h4 text:", h4.text().trim());

    // Check h5
    const h5 = firstLink.closest('.group').find('h5');
    console.log("h5 HTML:", h5.html());
}
