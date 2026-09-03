const fs = require('fs');
const path = require('path');

const BASE = 'c:/_PERSONAL/cs-topics-organizer';
const mergedFile = path.join(BASE, 'data/dsa/merged_dsa.json');
const newProblemsFile = path.join(BASE, 'data/dsa/layrs_new_problems.json');

const mergedData = JSON.parse(fs.readFileSync(mergedFile, 'utf-8'));
const layrsNew = JSON.parse(fs.readFileSync(newProblemsFile, 'utf-8'));

// Remove any existing Layrs Additions subcategories first
for (const cat in mergedData) {
    if (mergedData[cat]['Layrs Additions']) delete mergedData[cat]['Layrs Additions'];
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFICATION RULES
// Each entry: { kws: string[], sub: string }
// First match wins. Case-insensitive substring match on problem name.
// ─────────────────────────────────────────────────────────────────────────────

const RULES = {

    // ── DYNAMIC PROGRAMMING ──────────────────────────────────────────────────
    'Dynamic Programming': [
        // Bitmask DP (game state, assignment, covering, visiting all nodes)
        { kws: ['bitmask','shortest path visiting','smallest sufficient team','maximum students','parallel courses ii','minimum xor sum','cat and mouse ii','maximize grid happiness','maximum compatibility score','find minimum time to finish','minimum cost to connect two groups','distribute repeating','find all good strings'], sub: 'Bitmask DP' },
        // Digit DP
        { kws: ['non-negative integers without consecutive','count the number of powerful','number of beautiful integers','find all good strings','numbers with repeated digits','valid permutations for di','find the count of monotonic'], sub: 'Digit DP' },
        // Stock / State Machine
        { kws: ['stock','buy and sell','best time to buy'], sub: 'Stock Problems (State Machine)' },
        // LCS family
        { kws: ['longest common','edit distance','delete operation for two','uncrossed lines','minimum ascii delete','shortest common supersequence','max dot product of two subsequences'], sub: 'Longest Common Subsequence (LCS)' },
        // LIS family
        { kws: ['longest increasing subsequence','russian doll','number of lis','longest divisible subset','patience','longest arithmetic subsequence'], sub: 'Longest Increasing Subsequence (LIS)' },
        // Knapsack / Unbounded
        { kws: ['knapsack','subset sum','partition equal','target sum','last stone weight ii','ones and zeros','coin','unbounded','minimum cost for fruits','count sub-multisets'], sub: 'Unbounded Knapsack (Coin Change Style)' },
        // String DP
        { kws: ['word break','decode ways','concatenated words','palindrome partitioning ii','palindrome partitioning iii','regular expression matching','wildcard matching','distinct subsequences ii','interleaving string','domino and tromino','minimum changes to make k semi-palindrome','minimum substring partition','construct string with minimum cost','count different palindromic','apply operations to make two strings equal','minimum cost to cut a stick','build array where you can find the maximum'], sub: 'String DP (Edit Distance / Word Break)' },
        // Tree / Graph DP
        { kws: ['binary tree cameras','house robber iii','rob house iii','time taken to mark all nodes','maximize total cost of alternating','maximum score after applying operations on a tree','find number of coins to place in tree nodes','minimum number of operations to make x and y equal'], sub: 'Tree / Graph DP' },
        // Grid / 2D DP
        { kws: ['unique paths','maximal square','cherry pickup','dungeon game','triangle','falling path','out of boundary','minimum path sum','count paths','obstacle','maximum non negative product in a matrix','number of paths with max score','largest plus sign','largest 1-bordered square','count submatrices','maximum number of moves in a grid','number of increasing paths in a grid','maximum difference score in a grid'], sub: '2D Array (Grid Unique Paths)' },
        // Interval / Partition DP
        { kws: ['interval','burst balloons','stone game v','stone game vii','guess number higher or lower ii','can i win','predict the winner','scramble string','minimum cost to merge stones','minimum score triangulation','minimum cost tree from leaf values','pizza with 3n slices','video stitching','arithmetic slices ii','k-concatenation maximum sum'], sub: 'Interval / Partition DP' },
        // Probability DP
        { kws: ['probability','soup servings','new 21 game','knight dialer','probability of a two boxes'], sub: 'Probability DP' },
        // Kadane
        { kws: ['maximum subarray','max subarray','kadane','maximum sum rectangle no larger','bitwise ors of subarrays'], sub: "Kadane's Algorithm (Max/Min Subarray)" },
        // True 1D Fibonacci style
        { kws: ['fibonacci','climbing stairs','house robber','jump game','min cost climbing','tribonacci','delete and earn','wiggle subsequence','arithmetic slices','count vowels permutation','number of ways to wear different hats','perfect squares','count of sub-multisets','divisor game','paint house iii','allocate mailboxes','super egg drop','race car','make array strictly increasing','k-concatenation'], sub: '1D Array (Fibonacci Style)' },
        // Fallback: Advanced / Miscellaneous DP
        { kws: [], sub: 'Advanced DP', fallback: true },
    ],

    // ── BINARY SEARCH ────────────────────────────────────────────────────────
    'Binary Search': [
        // BS on Answer / Decision
        { kws: ['minimum speed to arrive','maximum number of tasks you can assign','escape the spreading fire','maximum tastiness','maximize the minimum powered city','maximum number of robots','minimum absolute difference between elements with constraint','earliest second to mark indices','find the median of the uniqueness array','maximize grid happiness','maximize minimum','minimize the maximum of two arrays'], sub: 'On Answer / Condition Function' },
        // BS in 2D / Matrix
        { kws: ['rectangle no larger','count number of rectangles','maximum side length of a square with sum','find kth smallest sum of a matrix'], sub: 'BS on 2D Arrays' },
        // BS with frequency / counting
        { kws: ['range frequency','kth smallest amount','number of subarrays with and value'], sub: 'Find First/Last Occurrence' },
        // Standard sorted BS
        { kws: [], sub: 'On Sorted Array/List', fallback: true },
    ],

    // ── GRAPHS ───────────────────────────────────────────────────────────────
    'Graphs': [
        // Union Find / DSU
        { kws: ['redundant connection','smallest string with swaps','gcd sort','checking existence of edge length limited','satisfiability of equality','possible bipartition','bricks falling when hit','number of restricted paths'], sub: 'Union-Find (Disjoint Set Union - DSU)' },
        // BFS shortest path / multi-source
        { kws: ['shortest path to get all keys','minimum moves to move a box','map of highest peak','nearest exit from entrance','minimum operations to convert number','jump game iii','jump game iv','minimum jumps to reach home','maximum candies you can get from boxes'], sub: 'BFS - Connected Components / Island Counting' },
        // Topological sort / DAG
        { kws: ['all ancestors of a node in a directed acyclic','rank transform of a matrix'], sub: 'Topological Sort (Kahn\'s Algorithm)' },
        // Dijkstra / weighted shortest path
        { kws: ['reachable nodes in subdivided','design graph with shortest path calculator','find number of coins to place in tree nodes'], sub: 'Shortest Path (Dijkstra\'s Algorithm)' },
        // Game / BFS state
        { kws: ['cat and mouse','detect cycles in 2d grid','flower planting with no adjacent','minimum number of operations to make x and y equal'], sub: 'DFS - Connected Components / Island Counting' },
        // Find All Groups / Connected components
        { kws: ['find all groups of farmland'], sub: 'DFS - Connected Components / Island Counting' },
        // Fallback
        { kws: [], sub: 'General Graph Traversal', fallback: true },
    ],

    // ── GREEDY ───────────────────────────────────────────────────────────────
    'Greedy': [
        // Sorting based greedy
        { kws: ['advantage shuffle','reduce array size','maximum bags','mice and cheese','maximum matching of players','minimum score by changing two elements','maximum elegance','count k-subsequences','maximum size of a set after removals','minimum rectangles to cover points','minimum cost to equalize','minimum cost for cutting cake'], sub: 'Sorting Based' },
        // Frequency / task scheduling
        { kws: ['group the people given the group size','divide array in sets of k consecutive','reducing dishes','maximum number of coins you can get','minimum rounds to complete all tasks','shortest impossible sequence'], sub: 'Task Scheduling (Frequency Based)' },
        // Interval-adjacent greedy (wrongly tagged as Intervals & Advanced Trees before)
        { kws: ['create sorted array through instructions','count good triplets in an array','longest substring of one repeating character','handling sum queries after update','maximum sum of subsequence with non-adjacent','peaks in array'], sub: 'General Greedy' },
        // Jump / reachability
        { kws: ['patching array','wiggle subsequence','super washing machines'], sub: 'Jump Game Reachability/Minimization' },
        // String manipulation greedy
        { kws: ['string without aaa or bbb','longest chunked palindrome','check if a string can break','lexicographically smallest beautiful string','lexicographically smallest string after substring','shortest string that contains three strings','count k-subsequences of a string','stamping the sequence'], sub: 'General Greedy' },
        // Swap / permutation greedy
        { kws: ['previous permutation with one swap','minimum swaps to make strings equal'], sub: 'General Greedy' },
        // Chip / position
        { kws: ['minimum cost to move chips','minimum time to type word','minimum number of operations to convert time','minimum operations to make array equal ii','minimum operations to make arrays similar','minimum amount of time to fill cups'], sub: 'General Greedy' },
        // Fallback
        { kws: [], sub: 'General Greedy', fallback: true },
    ],

    // ── BIT MANIPULATION ─────────────────────────────────────────────────────
    'Bit Manipulation': [
        // XOR tricks
        { kws: ['xor sum','decode xored','find xor sum','find the original array of prefix xor','maximum xor product','minimum operations to make array xor equal','shortest subarray with or at least','find subarray with bitwise or closest','bitwise ors of subarrays'], sub: 'Bitwise XOR - Finding Single/Missing Number' },
        // Bitmask DP / subset enumeration
        { kws: ['maximum achievable transfer requests','maximum compatibility score sum','number of possible sets of closing branches','minimum operations to form subsequence with target sum'], sub: 'Advanced Maths' },
        // Counting bits / hamming
        { kws: ['total hamming distance','minimum flips to make a or b equal','maximum or','minimize or of remaining','count paths that can form a palindrome'], sub: 'Counting Set Bits (Hamming Weight)' },
        // Gray code / encoding
        { kws: ['gray code','utf-8 validation'], sub: 'Learn Bit Manipulation' },
        // Number complement / properties
        { kws: ['number complement','find a value of a mysterious function','find longest awesome substring'], sub: 'Power of Two/Four Check' },
        // Fallback
        { kws: [], sub: 'Bit Manipulation', fallback: true },
    ],

    // ── STACK & QUEUE ────────────────────────────────────────────────────────
    'Stack & Queue': [
        // Monotonic stack
        { kws: ['sum of total strength','beautiful towers','find the number of subarrays where boundary elements are maximum','car fleet ii'], sub: 'Monotonic Stack' },
        // Parentheses
        { kws: ['score of parentheses','maximum nesting depth of two valid parentheses','minimum insertions to balance a parentheses'], sub: 'Valid Parentheses Matching' },
        // Expression evaluation
        { kws: ['basic calculator iv'], sub: 'Expression Evaluation (RPN/Infix)' },
        // Design
        { kws: ['dinner plate stacks'], sub: 'Min Stack Design' },
        // Array / simulation
        { kws: ['smallest subsequence of distinct','replace non-coprime numbers'], sub: 'General Stack/Queue' },
        // Fallback
        { kws: [], sub: 'General Stack/Queue', fallback: true },
    ],

    // ── MATH & GEOMETRY ──────────────────────────────────────────────────────
    'Math & Geometry': [
        // Geometry / coordinate
        { kws: ['largest triangle area','mirror reflection','circle and rectangle overlapping','maximum number of darts inside','count lattice points inside','minimum lines to represent','find the largest area of square inside two rectangles'], sub: 'Coordinate Geometry' },
        // Number theory / combinatorics
        { kws: ['nim game','power of three','minimum non-zero product','count the number of ideal arrays','number of ways to reorder array to get same bst','kth smallest instructions','number of strings which can be rearranged','count the number of infection sequences','find the winning player in coin game','find number of ways to reach the k-th stair'], sub: 'Number Theory / Math' },
        // Probability / randomized
        { kws: ['linked list random node','generate random point','airplane seat assignment probability','number of burgers with no waste'], sub: 'Maths / Geometry' },
        // Combinatorics
        { kws: ['least operators to express number'], sub: 'Number Theory / Math' },
        // Fallback
        { kws: [], sub: 'Maths / Geometry', fallback: true },
    ],

    // ── ARRAYS & HASHING ─────────────────────────────────────────────────────
    'Arrays & Hashing': [
        { kws: [], sub: 'Simulation / General Array', fallback: true },
    ],

    // ── TREES ────────────────────────────────────────────────────────────────
    'Trees': [
        { kws: ['trie','word dictionary','prefix','implement magic dictionary'], sub: 'Tries' },
        { kws: [], sub: 'Binary Tree', fallback: true },
    ],

    // ── BACKTRACKING ─────────────────────────────────────────────────────────
    'Backtracking': [
        { kws: ['non-decreasing subsequences'], sub: 'Subsequences Pattern' },
        { kws: ['beautiful arrangement'], sub: 'N-Queens / Constraint Satisfaction' },
        { kws: ['numbers with same consecutive differences'], sub: 'Combinations / Permutations' },
        { kws: ['tiling a rectangle'], sub: 'N-Queens / Constraint Satisfaction' },
        { kws: [], sub: 'Backtracking', fallback: true },
    ],

    // Passthrough for these (already have specific layrs-to-sub mapping)
    'Two Pointers': [{ kws: [], sub: 'Two Pointers', fallback: true }],
    'Sliding Window': [{ kws: [], sub: 'Variable Size (Condition-Based)', fallback: true }],
    'Linked List': [{ kws: [], sub: 'General Linked List', fallback: true }],
    'Heap / Priority Queue': [{ kws: [], sub: 'General Priority Queue', fallback: true }],
    'Design': [{ kws: [], sub: 'Design / Encodings', fallback: true }],
};

// ─────────────────────────────────────────────────────────────────────────────
function classify(p) {
    const cat = p.canonicalCategory;
    const name = p.name.toLowerCase();
    const rules = RULES[cat];
    if (!rules) {
        // Last resort: use layrsCategory as subcategory name
        return p.layrsCategory;
    }
    for (const rule of rules) {
        if (rule.fallback) return rule.sub;
        if (rule.kws.some(k => name.includes(k.toLowerCase()))) return rule.sub;
    }
    return p.layrsCategory; // absolute fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// Insert all 407 new Layrs problems
// ─────────────────────────────────────────────────────────────────────────────
let added = 0;
const distribution = {};

for (const p of layrsNew.problems) {
    const cat = p.canonicalCategory;
    const sub = classify(p);
    const key = `${cat} -> ${sub}`;
    distribution[key] = (distribution[key] || 0) + 1;

    if (!mergedData[cat]) mergedData[cat] = {};
    if (!mergedData[cat][sub]) mergedData[cat][sub] = [];

    mergedData[cat][sub].push({
        name: p.name,
        leetcodeUrl: p.leetcodeUrl,
        leetcodeId: p.id,
        sources: ['https://layrs.ai'],
        difficulty: p.difficulty,
        isBigTechDsa: false,
    });
    added++;
}

console.log(`\nAdded ${added} problems.\n\nDistribution:`);
for (const k of Object.keys(distribution).sort()) {
    console.log(`  [${distribution[k]}] ${k}`);
}

fs.writeFileSync(mergedFile, JSON.stringify(mergedData, null, 2), 'utf-8');
const publicFile = path.join(BASE, 'web/public/merged_dsa.json');
fs.writeFileSync(publicFile, JSON.stringify(mergedData, null, 2), 'utf-8');
console.log('\nDone. Both files updated.');
