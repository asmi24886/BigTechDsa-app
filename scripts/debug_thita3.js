const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('thita.html', 'utf-8');
const $ = cheerio.load(html);

const firstMb2 = $('.mb-2').first();
console.log("firstMb2 HTML (truncated):");
console.log(firstMb2.html().substring(0, 1500));
