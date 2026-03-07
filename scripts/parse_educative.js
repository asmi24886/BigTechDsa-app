const fs = require('fs');
const cheerio = require('cheerio');

// ============================================================
// educative1.html — Grokking the Coding Interview (patterns)
// ============================================================
const html1 = fs.readFileSync('educative1.html', 'utf-8');
const $1 = cheerio.load(html1);

const data1 = {};
let currentCategory = 'General';
let totalE1 = 0;
let withLeetcode1 = 0;

// Known slug -> LeetCode slug mapping for educative URL slugs
function slugToLeetcode(slug) {
    // The educative href slug is often very close to the LeetCode slug
    // Skip introduction pages and mock interview items
    if (!slug || slug.startsWith('introduction-to-') || slug === 'course-overview') return null;

    // Some educative slugs differ from LeetCode — map them
    const overrides = {
        'ipo': 'ipo',
        'valid-palindrome': 'valid-palindrome',
        '3sum': '3sum',
        'remove-nth-node-from-end-of-list': 'remove-nth-node-from-end-of-list',
        'sort-colors': 'sort-colors',
        'reverse-words-in-a-string': 'reverse-words-in-a-string',
        'valid-word-abbreviation': 'valid-word-abbreviation',
        'valid-palindrome-ii': 'valid-palindrome-ii',
        'lowest-common-ancestor-of-a-binary-tree-iii': 'lowest-common-ancestor-of-a-binary-tree-iii',
        'strobogrammatic-number': 'strobogrammatic-number',
        'minimum-number-of-moves-to-make-palindrome': 'minimum-number-of-moves-to-make-palindrome',
        'next-palindrome-using-same-digits': 'next-palindrome-using-same-digits',
        'count-subarrays-with-fixed-bounds': 'count-subarrays-with-fixed-bounds',
        'find-the-lexicographically-largest-string-from-box-ii': 'find-the-lexicographically-largest-string-from-the-box-ii',
        'get-the-maximum-score': 'get-the-maximum-score',
        'create-maximum-number': 'create-maximum-number',
        'append-characters-to-string-to-make-subsequence': 'append-characters-to-string-to-make-subsequence',
        'squares-of-a-sorted-array': 'squares-of-a-sorted-array',
        'n-queen': 'n-queens',
        'schedule-tasks-on-minimum-machines': 'meeting-rooms-ii',
        'kth-smallest-number-in-m-sorted-lists': 'kth-smallest-element-in-a-sorted-matrix',
        'find-k-sum-subsets': 'combination-sum',
        'gas-station': 'gas-station',
        'linked-list-cycle-iii': 'linked-list-cycle-ii',
        'linked-list-cycle-iv': 'linked-list-cycle-ii',
    };

    if (overrides[slug]) return overrides[slug];
    return slug; // most educative slugs match LeetCode slugs directly
}

// Categories are in <h3> tags
$1('h3.content-emphasis').each(function () {
    const text = $1(this).text().trim();
    if (text && text.length > 1 && !text.includes('Mock Interview') && !text.includes('Two Pointer Strategies') && !text.includes('Merging Strategies')) {
        currentCategory = text;
        if (!data1[currentCategory]) data1[currentCategory] = [];
    }
});

// Build category associations by iterating through the document structure
// Each major section has h3 for category, then <a> links for problems
const sections1 = $1('.bg-neutral-default.s-gray-default.rounded-lg');
sections1.each(function () {
    const catEl = $1(this).find('h3.content-emphasis.m-0');
    if (catEl.length === 0) return;
    const categoryName = catEl.first().text().trim();
    if (!categoryName || categoryName.length < 2) return;

    if (!data1[categoryName]) data1[categoryName] = [];

    $1(this).find('a[href*="/courses/grokking-coding-interview/"]').each(function () {
        const href = $1(this).attr('href') || '';
        const slug = href.split('/').pop();

        // Get problem name from the inner div
        const nameEl = $1(this).find('.content-default.text-sm.font-medium');
        let name = nameEl.text().trim();

        // Skip intro lessons (they don't have difficulty badges)
        if (!name || name.startsWith('Introduction to ')) return;

        const leetSlug = slugToLeetcode(slug);
        const leetcodeUrl = leetSlug ? `https://leetcode.com/problems/${leetSlug}/` : '';

        // Avoid duplicates within category
        if (!data1[categoryName].some(p => p.name === name)) {
            data1[categoryName].push({
                name: name,
                leetcodeUrl: leetcodeUrl,
                source: 'https://www.educative.io/courses/grokking-coding-interview',
                leetcodeId: ''
            });
            totalE1++;
            if (leetcodeUrl) withLeetcode1++;
        }
    });
});

// Clean up empty categories
for (const cat in data1) {
    if (data1[cat].length === 0) delete data1[cat];
}

// Write educative1 (Grokking Coding Interview)
const output1 = {};
for (const cat in data1) {
    output1[cat] = { 'General': data1[cat] };
}
fs.writeFileSync('data/dsa/dsa_educative1.json', JSON.stringify(output1, null, 2));
console.log(`\n=== EDUCATIVE 1 (Grokking Coding Interview) ===`);
console.log(`Total Problems: ${totalE1}`);
console.log(`With LeetCode URL: ${withLeetcode1}`);
console.log(`Categories: ${Object.keys(output1).length}`);

// ============================================================
// educative2.html — Grokking Dynamic Programming
// ============================================================
const html2 = fs.readFileSync('educative2.html', 'utf-8');
const $2 = cheerio.load(html2);

const data2 = {};
let totalE2 = 0;
let withLeetcode2 = 0;

// DP slug -> LeetCode slug mapping
const dpSlugMap = {
    'target-sum': 'target-sum',
    'subset-sum': 'partition-equal-subset-sum',
    'count-of-subset-sum': 'count-subsets-with-sum-k',
    'partition-array-into-two-arrays-to-minimize-sum-difference': 'partition-array-into-two-arrays-to-minimize-sum-difference',
    'minimum-number-of-refueling-stops': 'minimum-number-of-refueling-stops',
    'equal-sum-subarrays': 'partition-equal-subset-sum',
    'count-square-submatrices': 'count-square-submatrices-with-all-ones',
    'maximum-ribbon-cut': null,
    'rod-cutting': null,
    'minimum-coin-change': 'coin-change',
    'coin-change-ii': 'coin-change-ii',
    'fibonacci-numbers': 'fibonacci-number',
    'staircase-problem': 'climbing-stairs',
    'number-factors': null,
    'count-ways-to-score-in-a-game': null,
    'unique-paths-to-goal': 'unique-paths',
    'nth-tribonacci-number': 'n-th-tribonacci-number',
    'the-catalan-numbers': null,
    'house-thief-problem': 'house-robber',
    'minimum-jumps-to-reach-the-end': 'jump-game-ii',
    'minimum-jumps-with-fee': 'min-cost-climbing-stairs',
    'matrix-chain-multiplication': null,
    'longest-common-subsequence': 'longest-common-subsequence',
    'shortest-common-supersequence': 'shortest-common-supersequence',
    'minimum-number-of-deletions-and-insertions': 'delete-operation-for-two-strings',
    'edit-distance-problem': 'edit-distance',
    'longest-repeating-subsequence': 'longest-repeating-subsequence',
    'distinct-subsequence-pattern-matching': 'distinct-subsequences',
    'interleaving-strings': 'interleaving-string',
    'word-break-ii': 'word-break-ii',
    'longest-increasing-subsequence': 'longest-increasing-subsequence',
    'minimum-deletions-to-make-a-sequence-sorted': null,
    'maximum-sum-increasing-subsequence': null,
    'longest-bitonic-subsequence': null,
    'longest-alternating-subsequence': 'longest-turbulent-subarray',
    'building-bridges': null,
    'longest-palindromic-subsequence': 'longest-palindromic-subsequence',
    'minimum-deletions-in-a-string-to-make-it-a-palindrome': null,
    'longest-palindromic-substring': 'longest-palindromic-substring',
    'count-of-palindromic-substrings': 'palindromic-substrings',
    'palindromic-partitioning': 'palindrome-partitioning-ii',
};

// Parse educative2 categories and lessons
$2('.categoriesList_categoryContainer__dCrIf').each(function () {
    const catEl = $2(this).find('h3.PHPCategory_categoryTitleText__tyDeU').first();
    let categoryName = catEl.text().trim();
    if (!categoryName || categoryName === 'Getting Started' || categoryName === 'Conclusion') return;

    if (!data2[categoryName]) data2[categoryName] = [];

    $2(this).find('a.PHPLesson_phpLesson__OoD60').each(function () {
        const href = $2(this).attr('href') || '';
        const slug = href.split('/').pop();
        const nameEl = $2(this).find('.PHPLesson_phpLessonTitleText__lGgQh');
        let name = nameEl.text().trim();

        // Skip intro lessons and meta lessons 
        if (!name || name.startsWith('Introduction to ') || name.startsWith('Solving the ') ||
            name === 'Course Overview' || name === 'Who Should Take This Course' ||
            name === 'Where to Go from Here?') return;

        let leetcodeUrl = '';
        if (dpSlugMap[slug] !== undefined) {
            if (dpSlugMap[slug]) {
                leetcodeUrl = `https://leetcode.com/problems/${dpSlugMap[slug]}/`;
            }
        } else if (slug) {
            // Try the slug as-is for LeetCode
            leetcodeUrl = `https://leetcode.com/problems/${slug}/`;
        }

        if (!data2[categoryName].some(p => p.name === name)) {
            data2[categoryName].push({
                name: name,
                leetcodeUrl: leetcodeUrl,
                source: 'https://www.educative.io/courses/grokking-dynamic-programming-interview',
                leetcodeId: ''
            });
            totalE2++;
            if (leetcodeUrl) withLeetcode2++;
        }
    });
});

// Clean up empty categories  
for (const cat in data2) {
    if (data2[cat].length === 0) delete data2[cat];
}

// Write educative2 (Grokking DP) — wrap with subcategory
const output2 = {};
for (const cat in data2) {
    output2[cat] = { 'General': data2[cat] };
}
fs.writeFileSync('data/dsa/dsa_educative2.json', JSON.stringify(output2, null, 2));
console.log(`\n=== EDUCATIVE 2 (Grokking DP) ===`);
console.log(`Total Problems: ${totalE2}`);
console.log(`With LeetCode URL: ${withLeetcode2}`);
console.log(`Categories: ${Object.keys(output2).length}`);

console.log(`\n=== COMBINED ===`);
console.log(`Total: ${totalE1 + totalE2} problems`);
