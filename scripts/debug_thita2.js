const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('thita.html', 'utf-8');
const $ = cheerio.load(html);

const h3 = $('h3').first();
const mb2 = h3.closest('.mb-2');
console.log("mb2 length:", mb2.length);
console.log("mb2.next() length:", mb2.next('.text-card-foreground').length);
console.log("mb2.siblings() classes:", mb2.siblings().map((i, el) => $(el).attr('class')).get().join(" | "));
