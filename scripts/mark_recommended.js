/**
 * mark_recommended.js
 * 
 * Pipeline Step 4: Adds "recommended: true" to ~399 hand-curated problems in merged_dsa.json.
 * These are the "BigTechDsa Picks" — the essential problems for cracking senior/staff
 * DSA interviews at FAANG and top tech companies.
 * 
 * Selection criteria:
 * 1. Pattern teachers (canonical problem per sub-pattern)
 * 2. FAANG interview staples (highest frequency across interview reports)
 * 3. Key variants (follow-ups that test deeper understanding)
 * 4. Multi-source overlap (appearing in 3+ curated lists is strong signal)
 * 5. Difficulty coverage (mix of E/M/H with emphasis on Medium)
 * 
 * Run: node scripts/mark_recommended.js
 * After: enrich_data.js → mark_recommended.js
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// ============================================================
// CURATED SLUG LIST — 399 problems for Senior/Staff FAANG prep
// Organized by canonical category for maintainability.
// Slugs match the path segment in leetcode.com/problems/<slug>/
// Non-LC problems use their exact name.
// ============================================================

const RECOMMENDED_SLUGS = new Set([
    // =========================================================
    // ARRAYS & HASHING  (~58 problems)
    // =========================================================
    'two-sum',
    'contains-duplicate',
    'valid-anagram',
    'group-anagrams',
    'top-k-frequent-elements',
    'product-of-array-except-self',
    'longest-consecutive-sequence',
    'encode-and-decode-strings',
    'move-zeroes',
    'majority-element',
    'rotate-image',
    'rotate-array',
    'spiral-matrix',
    'set-matrix-zeroes',
    'merge-sorted-array',
    'remove-duplicates-from-sorted-array',
    'best-time-to-buy-and-sell-stock',
    'pascals-triangle',
    'sort-colors',
    'find-the-duplicate-number',
    'missing-number',
    'first-missing-positive',
    'subarray-sum-equals-k',
    'range-sum-query-immutable',
    'find-pivot-index',
    'contiguous-array',
    'continuous-subarray-sum',
    'string-to-integer-atoi',
    'roman-to-integer',
    'integer-to-roman',
    'valid-palindrome',
    'is-subsequence',
    'longest-common-prefix',
    'reverse-words-in-a-string',
    'string-compression',
    'multiply-strings',
    'game-of-life',
    'plus-one',
    'insert-delete-getrandom-o1',    // in Arrays, not Design
    'next-permutation',
    'isomorphic-strings',
    'word-pattern',
    'increasing-triplet-subsequence',
    'ransom-note',
    'longest-palindromic-substring',
    'design-hashmap',
    'encode-and-decode-tinyurl',
    'sort-characters-by-frequency',
    'transpose-matrix',
    'find-all-numbers-disappeared-in-array',
    'add-binary',
    'palindrome-number',
    'repeated-substring-pattern',
    'find-the-index-of-the-first-occurrence-in-a-string',
    'number-of-submatrices-that-sum-to-target',
    'sort-list',
    'kth-largest-element-in-an-array',
    'maximum-gap',
    'can-place-flowers',
    'valid-sudoku',
    'maximum-number-of-balloons',
    'reverse-pairs',
    'shortest-unsorted-continuous-subarray',
    'greatest-common-divisor-of-strings',
    'reverse-integer',

    // =========================================================
    // TWO POINTERS  (~18 problems)
    // =========================================================
    'two-sum-ii-input-array-is-sorted',
    '3sum',
    'container-with-most-water',
    'trapping-rain-water',
    '4sum',
    'remove-duplicates-from-sorted-array-ii',
    'valid-palindrome-ii',
    'squares-of-a-sorted-array',
    'remove-element',
    'linked-list-cycle',
    'linked-list-cycle-ii',
    'happy-number',
    'middle-of-the-linked-list',
    'backspace-string-compare',
    'intersection-of-two-linked-lists',
    'sort-array-by-parity',
    'boats-to-save-people',
    'longest-mountain-in-array',

    // =========================================================
    // SLIDING WINDOW  (~16 problems)
    // =========================================================
    'longest-substring-without-repeating-characters',
    'longest-repeating-character-replacement',
    'minimum-window-substring',
    'permutation-in-string',
    'find-all-anagrams-in-a-string',
    'sliding-window-maximum',
    'minimum-size-subarray-sum',
    'max-consecutive-ones-iii',
    'fruit-into-baskets',
    'grumpy-bookstore-owner',
    'maximum-average-subarray-i',
    'substring-with-concatenation-of-all-words',
    'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit',
    'maximum-sum-of-distinct-subarrays-with-length-k',
    'count-number-of-nice-subarrays',
    'subarrays-with-k-different-integers',

    // =========================================================
    // STACK & QUEUE  (~20 problems)
    // =========================================================
    'valid-parentheses',
    'min-stack',
    'evaluate-reverse-polish-notation',
    'daily-temperatures',
    'next-greater-element-i',
    'next-greater-element-ii',
    'largest-rectangle-in-histogram',
    'simplify-path',
    'basic-calculator',
    'basic-calculator-ii',
    'asteroid-collision',
    'remove-k-digits',
    'longest-valid-parentheses',
    'online-stock-span',
    'decode-string',
    '132-pattern',
    'implement-queue-using-stacks',
    'implement-stack-using-queues',
    'remove-all-adjacent-duplicates-in-string',
    'car-fleet',

    // =========================================================
    // BINARY SEARCH  (~20 problems)
    // =========================================================
    'binary-search',
    'search-in-rotated-sorted-array',
    'find-minimum-in-rotated-sorted-array',
    'search-a-2d-matrix',
    'find-first-and-last-position-of-element-in-sorted-array',
    'search-insert-position',
    'koko-eating-bananas',
    'median-of-two-sorted-arrays',
    'find-peak-element',
    'capacity-to-ship-packages-within-d-days',
    'split-array-largest-sum',
    'time-based-key-value-store',    // in Binary Search, not Design
    'single-element-in-a-sorted-array',
    'find-minimum-in-rotated-sorted-array-ii',
    'search-in-rotated-sorted-array-ii',
    'peak-index-in-a-mountain-array',
    'random-pick-with-weight',
    'minimum-number-of-days-to-make-m-bouquets',
    'magnetic-force-between-two-balls',
    'search-a-2d-matrix-ii',

    // =========================================================
    // LINKED LIST  (~16 problems)
    // =========================================================
    'reverse-linked-list',
    'merge-two-sorted-lists',
    'remove-nth-node-from-end-of-list',
    'add-two-numbers',
    'palindrome-linked-list',
    'reorder-list',
    'copy-list-with-random-pointer',
    'merge-k-sorted-lists',
    'swap-nodes-in-pairs',
    'reverse-linked-list-ii',
    'reverse-nodes-in-k-group',
    'odd-even-linked-list',
    'lru-cache',
    'remove-duplicates-from-sorted-list',
    'flatten-a-multilevel-doubly-linked-list',
    'rotate-list',

    // =========================================================
    // TREES  (~45 problems)
    // =========================================================
    'binary-tree-inorder-traversal',
    'binary-tree-preorder-traversal',
    'binary-tree-postorder-traversal',
    'binary-tree-level-order-traversal',
    'binary-tree-zigzag-level-order-traversal',
    'maximum-depth-of-binary-tree',
    'same-tree',
    'invert-binary-tree',
    'symmetric-tree',
    'balanced-binary-tree',
    'diameter-of-binary-tree',
    'binary-tree-maximum-path-sum',
    'path-sum',
    'path-sum-ii',
    'path-sum-iii',
    'lowest-common-ancestor-of-a-binary-tree',
    'lowest-common-ancestor-of-a-binary-search-tree',
    'validate-binary-search-tree',
    'kth-smallest-element-in-a-bst',
    'binary-tree-right-side-view',
    'construct-binary-tree-from-preorder-and-inorder-traversal',
    'construct-binary-tree-from-inorder-and-postorder-traversal',
    'serialize-and-deserialize-binary-tree',
    'flatten-binary-tree-to-linked-list',
    'populating-next-right-pointers-in-each-node',
    'binary-search-tree-iterator',
    'convert-sorted-array-to-binary-search-tree',
    'insert-into-a-binary-search-tree',
    'delete-node-in-a-bst',
    'all-nodes-distance-k-in-binary-tree',
    'implement-trie-prefix-tree',
    'design-add-and-search-words-data-structure',
    'word-search-ii',
    'count-complete-tree-nodes',
    'subtree-of-another-tree',
    'merge-two-binary-trees',
    'sum-root-to-leaf-numbers',
    'binary-tree-cameras',
    'recover-binary-search-tree',
    'unique-binary-search-trees',
    'unique-binary-search-trees-ii',
    'maximum-width-of-binary-tree',
    'vertical-order-traversal-of-a-binary-tree',
    'construct-bst-from-preorder-traversal',
    'trim-a-binary-search-tree',
    'check-completeness-of-a-binary-tree',
    'house-robber-iii',

    // =========================================================
    // HEAP / PRIORITY QUEUE  (~17 problems)
    // =========================================================
    'find-median-from-data-stream',
    'top-k-frequent-words',
    'k-closest-points-to-origin',
    'task-scheduler',
    'reorganize-string',
    'meeting-rooms-ii',
    'meeting-rooms',
    'last-stone-weight',
    'kth-smallest-element-in-a-sorted-matrix',
    'smallest-range-covering-elements-from-k-lists',
    'ipo',
    'merge-k-sorted-lists',  // also in LL, dedup handled
    'ugly-number-ii',
    'find-k-pairs-with-smallest-sums',
    'sliding-window-median',
    'minimum-cost-to-hire-k-workers',

    // =========================================================
    // GRAPHS  (~50 problems)
    // =========================================================
    'number-of-islands',
    'clone-graph',
    'course-schedule',
    'course-schedule-ii',
    'pacific-atlantic-water-flow',
    'number-of-connected-components-in-an-undirected-graph',
    'graph-valid-tree',
    'surrounded-regions',
    'rotting-oranges',
    'walls-and-gates',
    'word-ladder',
    'word-search',
    'shortest-path-in-binary-matrix',
    'max-area-of-island',
    'redundant-connection',
    'accounts-merge',
    'is-graph-bipartite',
    'network-delay-time',
    'cheapest-flights-within-k-stops',
    'min-cost-to-connect-all-points',
    'swim-in-rising-water',
    'alien-dictionary',
    'longest-increasing-path-in-a-matrix',
    'evaluate-division',
    'snakes-and-ladders',
    'open-the-lock',
    'bus-routes',
    'making-a-large-island',
    'critical-connections-in-a-network',
    'shortest-bridge',
    'number-of-enclaves',
    'regions-cut-by-slashes',
    '01-matrix',
    'shortest-path-with-alternating-colors',
    'path-with-minimum-effort',
    'find-eventual-safe-states',
    'keys-and-rooms',
    'all-paths-from-source-to-target',
    'minimum-height-trees',
    'reconstruct-itinerary',
    'number-of-provinces',
    'course-schedule-iv',
    'find-if-path-exists-in-graph',
    'detonate-the-maximum-bombs',
    'count-sub-islands',
    'minimum-number-of-vertices-to-reach-all-nodes',
    'parallel-courses',
    'as-far-from-land-as-possible',
    'time-needed-to-inform-all-employees',
    'number-of-operations-to-make-network-connected',

    // =========================================================
    // DYNAMIC PROGRAMMING  (~60 problems)
    // =========================================================
    'climbing-stairs',
    'fibonacci-number',
    'house-robber',
    'house-robber-ii',
    'coin-change',
    'coin-change-ii',
    'longest-increasing-subsequence',
    'longest-common-subsequence',
    'edit-distance',
    'unique-paths',
    'unique-paths-ii',
    'minimum-path-sum',
    'maximum-subarray',
    'maximum-product-subarray',
    'word-break',
    'decode-ways',
    'partition-equal-subset-sum',
    'target-sum',
    'palindrome-partitioning-ii',
    'longest-palindromic-subsequence',
    'best-time-to-buy-and-sell-stock-with-cooldown',
    'best-time-to-buy-and-sell-stock-ii',
    'best-time-to-buy-and-sell-stock-iii',
    'best-time-to-buy-and-sell-stock-iv',
    'interleaving-string',
    'regular-expression-matching',
    'wildcard-matching',
    'burst-balloons',
    'maximal-square',
    'perfect-squares',
    'triangle',
    'longest-string-chain',
    'delete-operation-for-two-strings',
    'distinct-subsequences',
    'stone-game',
    'stone-game-ii',
    'minimum-cost-for-tickets',
    'knight-dialer',
    'count-vowels-permutation',
    'number-of-dice-rolls-with-target-sum',
    'paint-house',
    'paint-fence',
    'integer-break',
    'maximum-profit-in-job-scheduling',
    'jump-game',
    'jump-game-ii',
    'minimum-difficulty-of-a-job-schedule',
    'ones-and-zeroes',
    'maximal-rectangle',
    'count-square-submatrices-with-all-ones',
    'best-sightseeing-pair',
    'maximum-sum-circular-subarray',
    'russian-doll-envelopes',
    'dungeon-game',
    'cherry-pickup',
    'cherry-pickup-ii',
    'uncrossed-lines',
    'minimum-falling-path-sum',
    'number-of-longest-increasing-subsequence',
    'longest-string-chain',
    'profitable-schemes',
    'word-break-ii',
    'best-team-with-no-conflicts',

    // =========================================================
    // BACKTRACKING  (~20 problems)
    // =========================================================
    'subsets',
    'subsets-ii',
    'permutations',
    'permutations-ii',
    'combination-sum',
    'combination-sum-ii',
    'combination-sum-iii',
    'letter-combinations-of-a-phone-number',
    'generate-parentheses',
    'palindrome-partitioning',
    'n-queens',
    'n-queens-ii',
    'sudoku-solver',
    'word-search',  // also in Graphs, dedup handled
    'combinations',
    'restore-ip-addresses',
    'partition-to-k-equal-sum-subsets',
    'splitting-a-string-into-descending-consecutive-values',
    'find-unique-binary-string',

    // =========================================================
    // GREEDY  (~22 problems)
    // =========================================================
    'jump-game',  // also in DP, dedup handled
    'jump-game-ii',  // also in DP, dedup handled
    'gas-station',
    'candy',
    'merge-intervals',
    'non-overlapping-intervals',
    'minimum-number-of-arrows-to-burst-balloons',
    'insert-interval',
    'meeting-rooms',  // also in Heap, dedup handled
    'meeting-rooms-ii',  // also in Heap, dedup handled
    'queue-reconstruction-by-height',
    'partition-labels',
    'hand-of-straights',
    'valid-parenthesis-string',
    'task-scheduler',  // also in Heap, dedup handled
    'assign-cookies',
    'lemonade-change',
    'two-city-scheduling',
    'maximum-length-of-pair-chain',
    'remove-covered-intervals',
    'minimum-number-of-swaps-to-make-the-string-balanced',
    'car-pooling',
    'minimum-deletions-to-make-character-frequencies-unique',
    'reorganize-string',  // also in Heap, dedup handled

    // =========================================================
    // BIT MANIPULATION  (~12 problems)
    // =========================================================
    'single-number',
    'single-number-ii',
    'single-number-iii',
    'number-of-1-bits',
    'counting-bits',
    'reverse-bits',
    'sum-of-two-integers',
    'missing-number',  // also in Arrays, dedup handled
    'power-of-two',
    'bitwise-and-of-numbers-range',
    'subsets',  // also in Backtracking, dedup handled
    'divide-two-integers',

    // =========================================================
    // MATH & GEOMETRY  (~15 problems)
    // =========================================================
    'happy-number',  // also in Two Pointers, dedup handled
    'count-primes',
    'plus-one',  // also in Arrays, dedup handled
    'excel-sheet-column-title',
    'factorial-trailing-zeroes',
    'sqrtx',
    'max-points-on-a-line',
    'robot-bounded-in-circle',
    'rotate-string',
    'detect-squares',
    'multiply-strings',  // also in Arrays, dedup handled
    'reverse-integer',  // also in Arrays, dedup handled
    'valid-square',
    'rectangle-overlap',
    'check-if-it-is-a-straight-line',
    'sum-of-square-numbers',
    'minimum-time-difference',
    'matrix-diagonal-sum',
    'image-smoother',
    'greatest-common-divisor-of-strings', // also in Arrays, dedup handled
    'ugly-number',
    'find-the-winner-of-the-circular-game',

    // =========================================================
    // DESIGN — excluded per user request (kept design-pattern
    // slugs that live in other categories like LL, Stack, Trees)
    // Redistributed 8 picks to DP, Graphs, Trees, Greedy below
    // =========================================================
    'lru-cache',  // lives in Linked List
    'lfu-cache',  // lives in Linked List
    'implement-trie-prefix-tree',  // lives in Trees
    'min-stack',  // lives in Stack
    'design-twitter',  // lives in Heap / Priority Queue
    'design-linked-list',  // lives in Linked List

    // =========================================================
    // BATCH 2: +101 problems to reach 500 total
    // Excludes Math & Geometry and Bit Manipulation per user request
    // =========================================================

    // --- Arrays & Hashing (+20) ---
    'spiral-matrix-ii',
    'diagonal-traverse',
    'range-sum-query-2d-immutable',
    'number-of-zero-filled-subarrays',
    'contains-duplicate-ii',
    'add-to-array-form-of-integer',
    'add-strings',
    'zigzag-conversion',
    'minimum-penalty-for-a-shop',
    'grid-game',
    'number-of-good-ways-to-split-a-string',
    'maximum-score-after-splitting-a-string',
    'make-sum-divisible-by-p',
    'longest-subarray-with-sum-k',
    'find-all-anagrams-in-a-string',     // dedup handled
    'design-hashset',
    'text-justification',
    'naming-a-company',
    'number-of-ways-to-split-array',
    'shifting-letters-ii',
    'append-characters-to-string-to-make-subsequence',

    // --- Two Pointers (+5) ---
    '3sum-closest',
    'shortest-word-distance',
    'number-of-subsequences-that-satisfy-the-given-sum-condition',
    'minimum-difference-between-highest-and-lowest-of-k-scores',
    'palindrome-linked-list',     // dedup handled

    // --- Sliding Window (+5) ---
    'binary-subarrays-with-sum',
    'minimum-window-substring',     // dedup handled
    'frequency-of-the-most-frequent-element',
    'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold',
    'minimum-operations-to-reduce-x-to-zero',

    // --- Stack & Queue (+5) ---
    'maximum-frequency-stack',
    'trapping-rain-water',     // dedup handled
    'maximal-rectangle',     // dedup handled
    'number-of-visible-people-in-a-queue',
    'sum-of-subarray-minimums',

    // --- Binary Search (+5) ---
    'count-of-smaller-numbers-after-self',
    'arranging-coins',
    'find-the-smallest-divisor-given-a-threshold',
    'search-a-2d-matrix-ii',     // dedup handled
    'successful-pairs-of-spells-and-potions',

    // --- Linked List (+5) ---
    'sort-list',     // dedup handled
    'delete-node-in-a-linked-list',
    'partition-list',
    'linked-list-in-binary-tree',
    'insertion-sort-list',

    // --- Trees (+15) ---
    'average-of-levels-in-binary-tree',
    'populating-next-right-pointers-in-each-node-ii',
    'find-bottom-left-tree-value',
    'minimum-absolute-difference-in-bst',
    'range-sum-of-bst',
    'two-sum-iv-input-is-a-bst',
    'inorder-successor-in-bst',
    'find-duplicate-subtrees',
    'map-sum-pairs',
    'flip-equivalent-binary-trees',
    'step-by-step-directions-from-a-binary-tree-node-to-another',
    'count-good-nodes-in-binary-tree',
    'leaf-similar-trees',
    'boundary-of-binary-tree',
    'even-odd-tree',
    'operations-on-tree',

    // --- Heap / Priority Queue (+5) ---
    'sort-characters-by-frequency',     // dedup handled
    'design-a-food-rating-system',
    'furthest-building-you-can-reach',
    'seat-reservation-manager',
    'single-threaded-cpu',

    // --- Graphs (+12) ---
    'word-ladder-ii',
    'the-maze',
    'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
    'graph-valid-tree',     // dedup handled
    'verifying-an-alien-dictionary',
    'optimize-water-distribution-in-a-village',
    'the-earliest-moment-when-everyone-become-friends',
    'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree',
    'largest-color-value-in-a-directed-graph',
    'clone-n-ary-tree',
    'minimum-obstacle-removal-to-reach-corner',
    'cheapest-flights-within-k-stops',     // dedup handled
    'second-minimum-time-to-reach-destination',
    'shortest-path-with-alternating-colors',     // dedup handled

    // --- Dynamic Programming (+10) ---
    'min-cost-climbing-stairs',
    'shortest-common-supersequence',
    'delete-and-earn',
    'combination-sum-iv',
    'last-stone-weight-ii',
    'minimum-insertion-steps-to-make-a-string-palindrome',
    'minimum-cost-to-cut-a-stick',
    'different-ways-to-add-parentheses',
    'largest-divisible-subset',
    'shortest-path-visiting-all-nodes',
    'n-th-tribonacci-number',
    'frog-jump',
    'maximum-absolute-sum-of-any-subarray',
    'partition-array-for-maximum-sum',
    'minimum-number-of-removals-to-make-mountain-array',

    // --- Backtracking (+5) ---
    'matchsticks-to-square',
    'letter-tile-possibilities',
    'remove-invalid-parentheses',
    'unique-paths-iii',
    'permutation-sequence',

    // --- Greedy (+7) ---
    'employee-free-time',
    'interval-list-intersections',
    'minimum-number-of-refueling-stops',
    'maximum-swap',
    'divide-intervals-into-minimum-number-of-groups',
    'longest-turbulent-subarray',
    'put-marbles-in-bags',
    'count-days-without-meetings',
    'minimum-number-of-pushes-to-type-word-ii',
    'flip-columns-for-maximum-number-of-equal-rows',
    'data-stream-as-disjoint-intervals',
    'maximum-number-of-events-that-can-be-attended',

    // --- Redistributed from Design (+8 → DP, Graphs, Trees, Greedy) ---
    'n-th-tribonacci-number',     // dedup handled
    'find-the-safest-path-in-a-grid',
    'minimize-malware-spread',
    'maximum-number-of-points-with-cost',

]);


// ============================================================
// PROCESSING: Mark problems in merged_dsa.json
// ============================================================
let totalMarked = 0;
let totalProblems = 0;
const matchedSlugs = new Set();
const categoryStats = {};

for (const cat in data) {
    let catMarked = 0;
    let catTotal = 0;

    for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
            totalProblems++;
            catTotal++;

            // Extract slug from leetcodeUrl
            let slug = null;
            if (p.leetcodeUrl && p.leetcodeUrl.includes('leetcode.com/problems/')) {
                const match = p.leetcodeUrl.match(/leetcode\.com\/problems\/([^\/\?]+)/);
                if (match) slug = match[1].toLowerCase();
            }

            // Check if this problem is recommended
            const isRecommended = (slug && RECOMMENDED_SLUGS.has(slug)) || RECOMMENDED_SLUGS.has(p.name);

            if (isRecommended) {
                p.recommended = true;
                totalMarked++;
                catMarked++;
                if (slug) matchedSlugs.add(slug);
                else matchedSlugs.add(p.name);
            } else {
                // Ensure field exists (set to false or remove)
                if (p.recommended) delete p.recommended;
            }
        }
    }

    categoryStats[cat] = { marked: catMarked, total: catTotal };
}

// Write back
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// ============================================================
// REPORT
// ============================================================
console.log('\n=== BigTechDsa Picks — Marking Complete ===\n');
console.log(`Total problems in dataset: ${totalProblems}`);
console.log(`Problems marked as recommended: ${totalMarked}`);
console.log(`Target: 500\n`);

console.log('--- By Category ---');
for (const cat in categoryStats) {
    const s = categoryStats[cat];
    const pct = ((s.marked / s.total) * 100).toFixed(1);
    console.log(`  ${cat}: ${s.marked} / ${s.total} (${pct}%)`);
}

// Find unmatched slugs
const unmatchedSlugs = [];
for (const slug of RECOMMENDED_SLUGS) {
    if (!matchedSlugs.has(slug)) {
        unmatchedSlugs.push(slug);
    }
}

if (unmatchedSlugs.length > 0) {
    console.log(`\n--- WARNING: ${unmatchedSlugs.length} slugs not found in dataset ---`);
    unmatchedSlugs.forEach(s => console.log(`  ✗ ${s}`));
}

// Difficulty distribution of recommended
let recEasy = 0, recMedium = 0, recHard = 0, recUnknown = 0;
for (const cat in data) {
    for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
            if (p.recommended) {
                if (p.difficulty === 'Easy') recEasy++;
                else if (p.difficulty === 'Medium') recMedium++;
                else if (p.difficulty === 'Hard') recHard++;
                else recUnknown++;
            }
        }
    }
}
console.log(`\n--- Difficulty Distribution (Recommended) ---`);
console.log(`  Easy: ${recEasy}  Medium: ${recMedium}  Hard: ${recHard}  Unknown: ${recUnknown}`);
console.log(`\nOutput: ${dataFile}`);
