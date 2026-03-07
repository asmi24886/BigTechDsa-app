const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('neetcode.html', 'utf-8');
const $ = cheerio.load(html);

const data = {};
let totalCount = 0;

$('app-accordion').each((i, acc) => {
  const header = $(acc).find('button p').first().text().trim();
  if (header === 'JavaScript' || !header) return;

  const problems = [];
  
  // Find all rows in this accordion's panel
  $(acc).find('.accordion-panel tr').each((j, row) => {
    // Problem name from the a.table-text
    const nameNode = $(row).find('a.table-text').first();
    let name = nameNode.text().trim();
    if (!name) return; // Not a valid problem row

    // Leetcode link
    const lcNode = $(row).find('a[href^="https://leetcode.com/problems/"]').first();
    let lcUrl = lcNode.attr('href') || '';
    
    // Leetcode ID (We will parse it later, just put placeholder or extract from URL if possible)
    let lcId = "";

    problems.push({
      name: name,
      leetcodeUrl: lcUrl,
      source: "https://neetcode.io/practice/practice/allNC",
      leetcodeId: lcId
    });
  });

  if (problems.length > 0) {
    data[header] = {
      [header]: problems
    };
    totalCount += problems.length;
  }
});

fs.writeFileSync('data/dsa/dsa_neetcode.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${totalCount} problems across ${Object.keys(data).length} categories.`);
