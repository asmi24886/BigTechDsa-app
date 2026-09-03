const fs = require('fs');
const path = require('path');

const mergedFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const mergedData = JSON.parse(fs.readFileSync(mergedFile, 'utf-8'));

const extractSlugFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/problems\/([^\/]+)/);
  return match ? match[1].toLowerCase() : null;
};

const existingList = [];
for (const cat of Object.keys(mergedData)) {
  for (const sub of Object.keys(mergedData[cat])) {
    for (const p of mergedData[cat][sub]) {
      const slug = extractSlugFromUrl(p.leetcodeUrl);
      existingList.push({
        name: p.name,
        slug,
        cat,
        sub,
        difficulty: p.difficulty,
        sources: p.sources,
        tier: p.bigTechDsaTier
      });
    }
  }
}

// Parse Layrs
const content = fs.readFileSync(path.join(__dirname, '../layrs.txt'), 'utf-8');
const lines = content.split(/\r?\n/).map(l => l.trim());

const categories = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^(\d+)\s+problems$/);
  if (match) {
    categories.push({ startLine: i, catName: lines[i - 1], count: parseInt(match[1], 10) });
  }
}

const slugify = (text) => {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

const layrsProblems = [];
for (let c = 0; c < categories.length; c++) {
  const cat = categories[c];
  const nextCatStart = c + 1 < categories.length ? categories[c + 1].startLine - 1 : lines.length;
  const catLines = lines.slice(cat.startLine, nextCatStart);

  let currentProblem = null;
  for (let j = 0; j < catLines.length; j++) {
    const line = catLines[j];
    const numMatch = line.match(/^#(\d+)$/);
    if (numMatch) {
      if (currentProblem) layrsProblems.push(currentProblem);
      currentProblem = { catName: cat.catName, indexInCat: parseInt(numMatch[1], 10), rawLines: [] };
      continue;
    }
    if (currentProblem) currentProblem.rawLines.push(line);
  }
  if (currentProblem) layrsProblems.push(currentProblem);
}

layrsProblems.forEach(p => {
  p.name = p.rawLines[0];
  for (let k = 1; k < p.rawLines.length; k++) {
    const l = p.rawLines[k];
    if (l.startsWith('#') && !p.tag) p.tag = l;
    else if (['Easy', 'Medium', 'Hard'].includes(l) && !p.difficulty) p.difficulty = l;
  }
  p.slug = slugify(p.name);
});

const existingSlugs = new Set(existingList.map(p => p.slug).filter(Boolean));
const existingStrippedSlugs = new Set(existingList.map(p => p.slug ? p.slug.replace(/[^a-z0-9]/g, '') : null).filter(Boolean));
const existingNormNames = new Set(existingList.map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

const matched = [];
const newProblems = [];

layrsProblems.forEach(p => {
  const strippedSlug = p.slug.replace(/[^a-z0-9]/g, '');
  const normName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  let match = null;
  if (existingSlugs.has(p.slug)) {
    match = existingList.find(e => e.slug === p.slug);
  } else if (existingStrippedSlugs.has(strippedSlug)) {
    match = existingList.find(e => e.slug && e.slug.replace(/[^a-z0-9]/g, '') === strippedSlug);
  } else if (existingNormNames.has(normName)) {
    match = existingList.find(e => e.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normName);
  }

  if (match) {
    matched.push({ layrs: p, existing: match });
  } else {
    newProblems.push(p);
  }
});

console.log(`Matched: ${matched.length}`);
console.log(`New: ${newProblems.length}`);

// Tally by difficulty for new problems
const diffTally = { Easy: 0, Medium: 0, Hard: 0, Total: newProblems.length };
newProblems.forEach(p => {
  diffTally[p.difficulty] = (diffTally[p.difficulty] || 0) + 1;
});
console.log('\nNew Problems by Difficulty:');
console.log(diffTally);

// Tally by Layrs category for new problems
const catTally = {};
newProblems.forEach(p => {
  catTally[p.catName] = (catTally[p.catName] || 0) + 1;
});
console.log('\nNew Problems by Layrs Category:');
Object.entries(catTally).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// Tally for ALL Layrs problems
const totalLayrsDiff = { Easy: 0, Medium: 0, Hard: 0, Total: layrsProblems.length };
layrsProblems.forEach(p => {
  totalLayrsDiff[p.difficulty] = (totalLayrsDiff[p.difficulty] || 0) + 1;
});
console.log('\nAll Layrs Problems by Difficulty:');
console.log(totalLayrsDiff);

// Matched problems by difficulty
const matchedDiff = { Easy: 0, Medium: 0, Hard: 0, Total: matched.length };
matched.forEach(m => {
  matchedDiff[m.layrs.difficulty] = (matchedDiff[m.layrs.difficulty] || 0) + 1;
});
console.log('\nMatched Problems by Difficulty:');
console.log(matchedDiff);
