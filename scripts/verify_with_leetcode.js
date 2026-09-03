const fs = require('fs');
const path = require('path');

// Load existing data
const mergedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dsa/merged_dsa.json'), 'utf-8'));
const extractSlugFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/problems\/([^\/]+)/);
  return match ? match[1].toLowerCase() : null;
};
const existingSlugs = new Set();
for (const cat in mergedData) {
  for (const sub in mergedData[cat]) {
    for (const p of mergedData[cat][sub]) {
      const s = extractSlugFromUrl(p.leetcodeUrl);
      if (s) existingSlugs.add(s);
    }
  }
}

// Load candidate new problems
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

// Filter initial 407
const initialUnmatched = layrsProblems.filter(p => {
  const strippedSlug = p.slug.replace(/[^a-z0-9]/g, '');
  const normName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (existingSlugs.has(p.slug)) return false;
  if (p.slug === 'k-th-smallest-prime-fraction') return false;
  if (p.name === 'Sum of All Subsets XOR Total') return false;
  return true;
});

console.log(`Verifying ${initialUnmatched.length} candidates against LeetCode API...`);

async function queryLeetCode(slug) {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({
        query: `query getQuestionTitle($titleSlug: String!) { question(titleSlug: $titleSlug) { questionFrontendId title titleSlug difficulty } }`,
        variables: { titleSlug: slug }
      })
    });
    const d = await res.json();
    return d?.data?.question || null;
  } catch (e) {
    return null;
  }
}

async function verifyAll() {
  const results = {
    validOnLeetCode: [],
    invalidSlug: [],
    alreadyInExisting: []
  };

  // Run with concurrency 15
  const concurrency = 15;
  for (let i = 0; i < initialUnmatched.length; i += concurrency) {
    const batch = initialUnmatched.slice(i, i + concurrency);
    const promises = batch.map(async (p) => {
      const q = await queryLeetCode(p.slug);
      if (q) {
        // Valid slug on LeetCode
        p.frontendId = q.questionFrontendId;
        p.lcTitle = q.title;
        p.lcSlug = q.titleSlug;
        p.lcDifficulty = q.difficulty;
        if (existingSlugs.has(q.titleSlug)) {
          results.alreadyInExisting.push({ p, q });
        } else {
          results.validOnLeetCode.push(p);
        }
      } else {
        results.invalidSlug.push(p);
      }
    });
    await Promise.all(promises);
    process.stdout.write(`Processed ${Math.min(i + concurrency, initialUnmatched.length)}/${initialUnmatched.length}\r`);
  }

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(`Directly valid on LeetCode (not in existing): ${results.validOnLeetCode.length}`);
  console.log(`Resolved but already in existing dataset: ${results.alreadyInExisting.length}`);
  console.log(`Invalid slug / Not found directly: ${results.invalidSlug.length}`);

  if (results.alreadyInExisting.length > 0) {
    console.log('\nFound in existing:', results.alreadyInExisting);
  }

  if (results.invalidSlug.length > 0) {
    console.log('\nInvalid slugs to inspect:');
    results.invalidSlug.forEach(inv => {
      console.log(`- "${inv.name}" (tried slug: "${inv.slug}") [${inv.catName}]`);
    });
  }

  // Save interim results
  fs.writeFileSync(path.join(__dirname, 'lc_verification.json'), JSON.stringify(results, null, 2));
}

verifyAll();
