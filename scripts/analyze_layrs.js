const fs = require('fs');
const path = require('path');

// 1. Load merged_dsa.json
const mergedFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const mergedData = JSON.parse(fs.readFileSync(mergedFile, 'utf-8'));

// Helper to normalize strings
const normalizeName = (s) => {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const extractSlugFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/problems\/([^\/]+)/);
  return match ? match[1].toLowerCase() : null;
};

// Index all existing problems
const existingList = [];
const existingBySlug = new Map();
const existingByNormName = new Map();

for (const cat of Object.keys(mergedData)) {
  for (const sub of Object.keys(mergedData[cat])) {
    for (const p of mergedData[cat][sub]) {
      const slug = extractSlugFromUrl(p.leetcodeUrl);
      const normName = normalizeName(p.name);
      
      const item = {
        name: p.name,
        slug,
        cat,
        sub,
        difficulty: p.difficulty,
        sources: p.sources || [],
        isBigTechDsa: !!p.isBigTechDsa,
        bigTechDsaTier: p.bigTechDsaTier,
        leetcodeUrl: p.leetcodeUrl
      };

      existingList.push(item);
      if (slug) existingBySlug.set(slug, item);
      if (normName) existingByNormName.set(normName, item);
    }
  }
}

console.log(`Existing dataset stats:`);
console.log(`- Total problem entries in merged_dsa.json: ${existingList.length}`);
console.log(`- Unique slugs: ${existingBySlug.size}`);
console.log(`- Unique normalized names: ${existingByNormName.size}`);

// 2. Parse layrs.txt
const content = fs.readFileSync(path.join(__dirname, '../layrs.txt'), 'utf-8');
const lines = content.split(/\r?\n/).map(l => l.trim());

const categories = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^(\d+)\s+problems$/);
  if (match) {
    const count = parseInt(match[1], 10);
    categories.push({ startLine: i, catName: lines[i - 1], count });
  }
}

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
  p.normName = normalizeName(p.name);
});

console.log(`\nLayrs dataset stats:`);
console.log(`- Total problems parsed: ${layrsProblems.length}`);

// 3. Match Layrs problems against existing
const matchedBySlug = [];
const matchedByNameOnly = [];
const newProblems = [];

for (const p of layrsProblems) {
  // Check slug match
  if (existingBySlug.has(p.slug)) {
    matchedBySlug.push({ layrs: p, existing: existingBySlug.get(p.slug) });
    continue;
  }
  // Check normName match
  if (existingByNormName.has(p.normName)) {
    matchedByNameOnly.push({ layrs: p, existing: existingByNormName.get(p.normName) });
    continue;
  }
  // If not matched, mark as new
  newProblems.push(p);
}

console.log(`\nMatching results:`);
console.log(`- Matched by slug: ${matchedBySlug.length}`);
console.log(`- Matched by normalized name: ${matchedByNameOnly.length}`);
console.log(`- Total matched: ${matchedBySlug.length + matchedByNameOnly.length}`);
console.log(`- Candidate NEW problems: ${newProblems.length}`);

// Let's inspect matchedByNameOnly
if (matchedByNameOnly.length > 0) {
  console.log(`\nSample matched by name only:`);
  matchedByNameOnly.slice(0, 10).forEach(m => {
    console.log(`  Layrs: "${m.layrs.name}" (slug: ${m.layrs.slug}) <-> Existing: "${m.existing.name}" (slug: ${m.existing.slug})`);
  });
}
