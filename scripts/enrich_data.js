const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dataDir = path.join(__dirname, '../data/dsa');
const mergedPath = path.join(dataDir, 'merged_dsa.json');
const merged = JSON.parse(fs.readFileSync(mergedPath, 'utf-8'));

// ============================================================
// STEP 1: Extract difficulties from educative1.html (has badges)
// ============================================================
const edu1Html = fs.readFileSync(path.join(__dirname, '../educative1.html'), 'utf-8');
const $ = cheerio.load(edu1Html);
const eduDiffMap = {}; // slug -> difficulty

$('a[href*="/courses/grokking-coding-interview/"]').each(function () {
    const href = $(this).attr('href') || '';
    const slug = href.split('/').pop();
    const badges = $(this).find('.rounded-full');
    badges.each(function () {
        const t = $(this).text().trim();
        if (t === 'Easy' || t === 'Medium' || t === 'Hard') {
            eduDiffMap[slug] = t;
        }
    });
});

console.log(`Extracted ${Object.keys(eduDiffMap).length} difficulties from educative1.html`);

// ============================================================
// STEP 2: Comprehensive LeetCode slug → difficulty map
// From pretrained knowledge of LeetCode problem difficulties
// ============================================================
const DIFFICULTY_MAP = {
    // ---- EASY ----
    "two-sum": "Easy", "valid-anagram": "Easy", "contains-duplicate": "Easy", "best-time-to-buy-and-sell-stock": "Easy",
    "valid-palindrome": "Easy", "valid-parentheses": "Easy", "merge-two-sorted-lists": "Easy", "linked-list-cycle": "Easy",
    "reverse-linked-list": "Easy", "maximum-depth-of-binary-tree": "Easy", "same-tree": "Easy", "subtree-of-another-tree": "Easy",
    "invert-binary-tree": "Easy", "lowest-common-ancestor-of-a-binary-search-tree": "Easy", "climbing-stairs": "Easy",
    "min-cost-climbing-stairs": "Easy", "counting-bits": "Easy", "number-of-1-bits": "Easy", "reverse-bits": "Easy",
    "missing-number": "Easy", "single-number": "Easy", "happy-number": "Easy", "plus-one": "Easy", "palindrome-number": "Easy",
    "fizz-buzz": "Easy", "power-of-three": "Easy", "power-of-two": "Easy", "sqrtx": "Easy",
    "binary-search": "Easy", "first-bad-version": "Easy", "search-insert-position": "Easy",
    "flood-fill": "Easy", "island-perimeter": "Easy", "maximum-subarray": "Easy",
    "merge-sorted-array": "Easy", "move-zeroes": "Easy", "remove-duplicates-from-sorted-array": "Easy",
    "remove-element": "Easy", "intersection-of-two-arrays-ii": "Easy", "majority-element": "Easy",
    "roman-to-integer": "Easy", "longest-common-prefix": "Easy", "valid-palindrome-ii": "Easy",
    "implement-strstr": "Easy", "length-of-last-word": "Easy", "ransom-note": "Easy",
    "isomorphic-strings": "Easy", "word-pattern": "Easy", "is-subsequence": "Easy",
    "diameter-of-binary-tree": "Easy", "balanced-binary-tree": "Easy",
    "symmetric-tree": "Easy", "binary-tree-paths": "Easy", "path-sum": "Easy",
    "convert-sorted-array-to-binary-search-tree": "Easy", "kth-largest-element-in-a-stream": "Easy",
    "last-stone-weight": "Easy", "fibonacci-number": "Easy", "n-th-tribonacci-number": "Easy",
    "pascals-triangle": "Easy", "pascals-triangle-ii": "Easy",
    "squares-of-a-sorted-array": "Easy", "reverse-string": "Easy", "intersection-of-two-linked-lists": "Easy",
    "middle-of-the-linked-list": "Easy", "palindrome-linked-list": "Easy",
    "implement-queue-using-stacks": "Easy", "implement-stack-using-queues": "Easy",
    "baseball-baseball": "Easy", "next-greater-element-i": "Easy",
    "maximum-average-subarray-i": "Easy", "find-all-numbers-disappeared-in-an-array": "Easy",
    "meeting-rooms": "Easy", "remove-linked-list-elements": "Easy", "remove-duplicates-from-sorted-list": "Easy",
    "add-binary": "Easy", "excel-sheet-column-number": "Easy", "excel-sheet-column-title": "Easy",
    "backspace-string-compare": "Easy", "strobogrammatic-number": "Easy", "valid-word-abbreviation": "Easy",
    "third-maximum-number": "Easy", "assign-cookies": "Easy", "can-place-flowers": "Easy",
    "largest-odd-number-in-string": "Easy", "the-k-weakest-rows-in-a-matrix": "Easy",
    "count-pairs-whose-sum-is-less-than-target": "Easy", "find-subsequence-of-length-k-with-the-largest-sum": "Easy",
    "largest-number-after-digit-swaps-by-parity": "Easy", "design-hashmap": "Easy", "design-hashset": "Easy",
    "maximum-number-of-balloons": "Easy", "jewels-and-stones": "Easy",
    "find-the-difference": "Easy", "sort-array-by-parity": "Easy",
    "string-compression": "Medium", "rotate-array": "Medium",
    "diet-plan-performance": "Easy", "delete-n-nodes-after-m-nodes-of-a-linked-list": "Easy",
    "find-pivot-index": "Easy", "range-sum-query-immutable": "Easy",
    "maximum-product-after-k-increments": "Medium",
    "final-array-state-after-k-multiplication-operations-i": "Easy",
    "rank-transform-of-an-array": "Easy",

    // ---- MEDIUM ----
    "group-anagrams": "Medium", "top-k-frequent-elements": "Medium", "encode-and-decode-strings": "Medium",
    "product-of-array-except-self": "Medium", "longest-consecutive-sequence": "Medium",
    "3sum": "Medium", "container-with-most-water": "Medium", "two-sum-ii-input-array-is-sorted": "Medium",
    "longest-substring-without-repeating-characters": "Medium", "permutation-in-string": "Medium",
    "minimum-window-substring": "Hard", "sliding-window-maximum": "Hard",
    "longest-repeating-character-replacement": "Medium", "minimum-size-subarray-sum": "Medium",
    "evaluate-reverse-polish-notation": "Medium", "generate-parentheses": "Medium", "daily-temperatures": "Medium",
    "car-fleet": "Medium", "min-stack": "Medium", "online-stock-span": "Medium",
    "find-minimum-in-rotated-sorted-array": "Medium", "search-in-rotated-sorted-array": "Medium",
    "koko-eating-bananas": "Medium", "search-a-2d-matrix": "Medium",
    "time-based-key-value-store": "Medium", "find-peak-element": "Medium",
    "reorder-list": "Medium", "remove-nth-node-from-end-of-list": "Medium",
    "copy-list-with-random-pointer": "Medium", "add-two-numbers": "Medium",
    "lru-cache": "Medium", "find-the-duplicate-number": "Medium",
    "binary-tree-level-order-traversal": "Medium", "binary-tree-right-side-view": "Medium",
    "count-good-nodes-in-binary-tree": "Medium", "validate-binary-search-tree": "Medium",
    "kth-smallest-element-in-a-bst": "Medium", "construct-binary-tree-from-preorder-and-inorder-traversal": "Medium",
    "binary-tree-zigzag-level-order-traversal": "Medium", "populating-next-right-pointers-in-each-node-ii": "Medium",
    "lowest-common-ancestor-of-a-binary-tree": "Medium",
    "number-of-islands": "Medium", "clone-graph": "Medium", "pacific-atlantic-water-flow": "Medium",
    "course-schedule": "Medium", "course-schedule-ii": "Medium", "graph-valid-tree": "Medium",
    "number-of-connected-components-in-an-undirected-graph": "Medium",
    "redundant-connection": "Medium", "walls-and-gates": "Medium", "rotting-oranges": "Medium",
    "surrounded-regions": "Medium",
    "house-robber": "Medium", "house-robber-ii": "Medium", "longest-palindromic-substring": "Medium",
    "palindromic-substrings": "Medium", "decode-ways": "Medium", "coin-change": "Medium",
    "maximum-product-subarray": "Medium", "word-break": "Medium", "longest-increasing-subsequence": "Medium",
    "unique-paths": "Medium", "longest-common-subsequence": "Medium", "target-sum": "Medium",
    "partition-equal-subset-sum": "Medium", "edit-distance": "Hard",
    "combination-sum": "Medium", "combination-sum-ii": "Medium", "permutations": "Medium",
    "subsets": "Medium", "subsets-ii": "Medium", "word-search": "Medium",
    "letter-combinations-of-a-phone-number": "Medium", "palindrome-partitioning": "Medium",
    "jump-game": "Medium", "jump-game-ii": "Medium", "gas-station": "Medium",
    "hand-of-straights": "Medium", "merge-intervals": "Medium", "insert-interval": "Medium",
    "non-overlapping-intervals": "Medium", "meeting-rooms-ii": "Medium",
    "task-scheduler": "Medium", "rotate-image": "Medium", "spiral-matrix": "Medium",
    "set-matrix-zeroes": "Medium", "sort-colors": "Medium", "next-permutation": "Medium",
    "powx-n": "Medium", "multiply-strings": "Medium", "detect-squares": "Medium",
    "reverse-integer": "Medium", "string-to-integer-atoi": "Medium",
    "implement-trie-prefix-tree": "Medium", "design-add-and-search-words-data-structure": "Medium",
    "kth-largest-element-in-an-array": "Medium", "k-closest-points-to-origin": "Medium",
    "find-k-closest-elements": "Medium", "single-element-in-a-sorted-array": "Medium",
    "accounts-merge": "Medium", "min-cost-to-connect-all-points": "Medium",
    "network-delay-time": "Medium", "cheapest-flights-within-k-stops": "Medium",
    "swim-in-rising-water": "Hard", "reconstruct-itinerary": "Hard",
    "coin-change-ii": "Medium", "interleaving-string": "Medium",
    "distinct-subsequences": "Hard", "best-time-to-buy-and-sell-stock-with-cooldown": "Medium",
    "longest-palindromic-subsequence": "Medium", "shortest-common-supersequence": "Hard",
    "delete-operation-for-two-strings": "Medium",
    "maximum-length-of-repeated-subarray": "Medium",
    "cherry-pickup-ii": "Hard",
    "fruit-into-baskets": "Medium", "frequency-of-the-most-frequent-element": "Medium",
    "repeated-dna-sequences": "Medium", "binary-subarrays-with-sum": "Medium",
    "interval-list-intersections": "Medium", "remove-covered-intervals": "Medium",
    "count-days-without-meetings": "Medium", "car-pooling": "Medium",
    "reverse-linked-list-ii": "Medium", "swap-nodes-in-pairs": "Medium",
    "swapping-nodes-in-a-linked-list": "Medium", "odd-even-linked-list": "Medium",
    "rotate-list": "Medium", "split-linked-list-in-parts": "Medium",
    "insert-into-a-sorted-circular-linked-list": "Medium",
    "reverse-nodes-in-even-length-groups": "Medium",
    "find-median-from-data-stream": "Hard", "sliding-window-median": "Hard",
    "meeting-rooms-iii": "Hard", "minimum-cost-to-connect-sticks": "Medium",
    "longest-happy-string": "Medium", "maximum-average-pass-ratio": "Medium",
    "the-number-of-the-smallest-unoccupied-chair": "Medium",
    "find-right-interval": "Medium", "construct-target-array-with-multiple-sums": "Hard",
    "kth-smallest-element-in-a-sorted-matrix": "Medium", "kth-smallest-prime-fraction": "Medium",
    "super-ugly-number": "Medium",
    "search-in-rotated-sorted-array-ii": "Medium",
    "maximum-value-at-a-given-index-in-a-bounded-array": "Medium",
    "reorganize-string": "Medium", "maximal-score-after-applying-k-operations": "Medium",
    "find-the-kth-largest-integer-in-the-array": "Medium",
    "least-number-of-unique-integers-after-k-removals": "Medium",
    "minimum-cost-to-hire-k-workers": "Hard",
    "maximum-performance-of-a-team": "Hard",
    "letter-case-permutation": "Medium", "letter-tile-possibilities": "Medium",
    "boats-to-save-people": "Medium", "two-city-scheduling": "Medium",
    "largest-palindromic-number": "Medium", "remove-k-digits": "Medium",
    "largest-number": "Medium", "sort-an-array": "Medium",
    "best-time-to-buy-and-sell-stock-ii": "Medium", "maximum-swap": "Medium",
    "number-of-steps-to-reduce-a-binary-number-to-one": "Medium",
    "circular-array-loop": "Medium", "maximum-twin-sum-of-a-linked-list": "Medium",
    "split-a-circular-linked-list": "Medium", "partition-labels": "Medium",
    "append-characters-to-string-to-make-subsequence": "Medium",
    "word-search-ii": "Hard", "n-queens": "Hard", "n-queens-ii": "Hard",
    "sudoku-solver": "Hard", "expression-add-operators": "Hard",
    "restore-ip-addresses": "Medium", "matchsticks-to-square": "Medium",
    "unique-paths-ii": "Medium", "unique-paths-iii": "Hard",
    "path-sum-ii": "Medium", "path-sum-iii": "Medium",
    "flatten-binary-tree-to-linked-list": "Medium",
    "sum-root-to-leaf-numbers": "Medium",
    "binary-tree-maximum-path-sum": "Hard",
    "serialize-and-deserialize-binary-tree": "Hard",
    "all-nodes-distance-k-in-binary-tree": "Medium",
    "amount-of-time-for-binary-tree-to-be-infected": "Medium",
    "vertical-order-traversal-of-a-binary-tree": "Hard",
    "delete-node-in-a-bst": "Medium", "insert-into-a-binary-search-tree": "Medium",
    "recover-binary-search-tree": "Medium",
    "word-ladder": "Hard", "word-ladder-ii": "Hard",
    "alien-dictionary": "Hard", "minimum-height-trees": "Medium",
    "open-the-lock": "Medium", "snakes-and-ladders": "Medium",
    "shortest-path-in-binary-matrix": "Medium",
    "critical-connections-in-a-network": "Hard",
    "longest-string-chain": "Medium", "maximum-length-of-pair-chain": "Medium",
    "russian-doll-envelopes": "Hard", "number-of-longest-increasing-subsequence": "Medium",
    "burst-balloons": "Hard", "minimum-cost-tree-from-leaf-values": "Medium",
    "stone-game": "Medium", "stone-game-ii": "Medium",
    "triangle": "Medium", "minimum-path-sum": "Medium",
    "maximal-square": "Medium", "largest-plus-sign": "Medium",
    "ones-and-zeroes": "Medium", "profitable-schemes": "Hard",
    "trapping-rain-water": "Hard", "largest-rectangle-in-histogram": "Hard",
    "maximal-rectangle": "Hard", "basic-calculator": "Hard", "basic-calculator-ii": "Medium",
    "asteroid-collision": "Medium", "decode-string": "Medium",
    "remove-all-adjacent-duplicates-in-string-ii": "Medium",
    "simplify-path": "Medium", "binary-tree-inorder-traversal": "Easy",
    "binary-tree-preorder-traversal": "Easy", "binary-tree-postorder-traversal": "Easy",
    "reverse-words-in-a-string": "Medium",
    "find-first-and-last-position-of-element-in-sorted-array": "Medium",
    "minimum-number-of-arrows-to-burst-balloons": "Medium",
    "minimum-number-of-refueling-stops": "Hard",
    "text-justification": "Hard", "candy": "Hard",
    "minimum-replacements-to-sort-the-array": "Hard",
    "wildcard-matching": "Hard", "rearranging-fruits": "Hard",
    "employee-free-time": "Hard", "data-stream-as-disjoint-intervals": "Hard",
    "minimum-interval-to-include-each-query": "Hard",
    "reverse-nodes-in-k-group": "Hard", "merge-k-sorted-lists": "Hard",
    "smallest-range-covering-elements-from-k-lists": "Hard",
    "split-array-largest-sum": "Hard",
    "find-minimum-in-rotated-sorted-array-ii": "Hard",
    "maximum-running-time-of-n-computers": "Hard",
    "minimize-max-distance-to-gas-station": "Hard",
    "divide-chocolate": "Hard", "split-array-into-two-arrays-to-minimize-sum-difference": "Hard",
    "number-of-flowers-in-full-bloom": "Hard",
    "subarrays-with-k-different-integers": "Hard",
    "count-subarrays-with-score-less-than-k": "Hard",
    "substring-with-concatenation-of-all-words": "Hard",
    "minimum-window-subsequence": "Hard",
    "count-subarrays-with-fixed-bounds": "Hard",
    "get-the-maximum-score": "Hard", "create-maximum-number": "Hard",
    "minimum-number-of-moves-to-make-palindrome": "Hard",
    "next-palindrome-using-same-digits": "Hard",
    "count-substrings-with-k-frequency-characters-ii": "Hard",
    "k-empty-slots": "Hard", "find-the-k-sum-of-an-array": "Hard",
    "k-maximum-sum-combinations-from-two-arrays": "Hard",
    "ipo": "Hard", "magnetic-force-between-two-balls": "Medium",
    "frog-jump": "Hard", "shortest-palindrome": "Hard",
    "median-of-two-sorted-arrays": "Hard",

    // More common problems
    "two-sum-ii": "Medium", "3sum-closest": "Medium", "4sum": "Medium",
    "sort-list": "Medium", "linked-list-cycle-ii": "Medium",
    "flatten-nested-list-iterator": "Medium", "lfu-cache": "Hard",
    "trapping-rain-water-ii": "Hard",
    "regular-expression-matching": "Hard",
    "longest-valid-parentheses": "Hard",
    "maximal-network-rank": "Medium",
    "is-graph-bipartite": "Medium",
    "possible-bipartition": "Medium",
    "evaluate-division": "Medium",
    "max-area-of-island": "Medium",
    "01-matrix": "Medium",
    "shortest-bridge": "Medium",
    "shortest-path-with-alternating-colors": "Medium",
    "parallel-courses": "Medium",
    "parallel-courses-ii": "Hard",
    "all-paths-from-source-to-target": "Medium",
    "keys-and-rooms": "Medium",
    "find-eventual-safe-states": "Medium",
    "longest-path-with-different-adjacent-characters": "Hard",
    "count-unreachable-pairs-of-nodes-in-an-undirected-graph": "Medium",
    "word-break-ii": "Hard",
    "palindrome-partitioning-ii": "Hard",
    "maximum-profit-in-job-scheduling": "Hard",
    "best-time-to-buy-and-sell-stock-iii": "Hard",
    "best-time-to-buy-and-sell-stock-iv": "Hard",
    "number-of-dice-rolls-with-target-sum": "Medium",
    "integer-break": "Medium",
    "perfect-squares": "Medium",
    "ugly-number": "Easy", "ugly-number-ii": "Medium",
    "count-sorted-vowel-strings": "Medium",
    "maximum-alternating-subsequence-sum": "Medium",
    "dungeon-game": "Hard",
    "scramble-string": "Hard",
    "minimum-difficulty-of-a-job-schedule": "Hard",
    "count-square-submatrices-with-all-ones": "Medium",
    "unique-binary-search-trees": "Medium",
    "unique-binary-search-trees-ii": "Medium",
    "partition-array-into-two-arrays-to-minimize-sum-difference": "Hard",
    "longest-turbulent-subarray": "Medium",

    // Design problems
    "design-twitter": "Medium", "design-browser-history": "Medium",
    "design-underground-system": "Medium",
    "lru-cache": "Medium", "lfu-cache": "Hard",
    "design-circular-queue": "Medium",

    // Math & Geometry
    "happy-number": "Easy", "count-primes": "Medium",
    "robot-bounded-in-circle": "Medium",
    "minimum-moves-to-equal-array-elements-ii": "Medium",
};

// Additional difficulties for remaining problems (batch 2)
const ADDITIONAL = {
    // Arrays & Hashing extras
    "spiral-matrix-iii": "Medium", "spiral-matrix-iv": "Medium", "diagonal-traverse": "Medium",
    "longest-mountain-in-array": "Medium", "range-sum-query-2d-immutable": "Medium", "range-sum-query-2d-mutable": "Hard",
    "add-to-array-form-of-integer": "Easy", "integer-to-roman": "Medium",
    "find-the-index-of-the-first-occurrence-in-a-string": "Easy", "repeated-string-match": "Medium",
    "rotate-string": "Easy", "find-beautiful-indices-in-the-given-array-ii": "Hard",
    "repeated-substring-pattern": "Easy", "number-of-zero-filled-subarrays": "Medium",
    "increasing-triplet-subsequence": "Medium", "number-of-good-pairs": "Easy",
    "split-array-into-consecutive-subsequences": "Medium", "number-of-matching-subsequences": "Medium",
    "number-of-good-ways-to-split-a-string": "Medium", "convert-sorted-list-to-binary-search-tree": "Medium",
    "construct-quad-tree": "Medium", "maximum-binary-tree": "Medium",
    "score-of-a-string": "Easy", "concatenation-of-array": "Easy",
    "replace-elements-with-greatest-element-on-right-side": "Easy",
    "valid-word-square": "Easy", "confusing-number": "Easy", "sentence-similarity": "Easy",
    "largest-unique-number": "Easy", "single-row-keyboard": "Easy", "counting-elements": "Easy",
    "perform-string-shifts": "Easy", "group-shifted-strings": "Medium",
    "maximum-distance-in-arrays": "Medium", "lonely-pixel-i": "Medium",
    "sparse-matrix-multiplication": "Medium", "candy-crush": "Medium",
    "find-smallest-common-element-in-all-rows": "Medium", "one-edit-distance": "Medium",
    "reverse-words-in-a-string-ii": "Medium", "shortest-way-to-form-string": "Medium",
    "first-unique-number": "Medium", "zigzag-iterator": "Medium",
    "number-of-senior-citizens": "Easy", "string-matching-in-an-array": "Easy",
    "unique-email-addresses": "Easy", "longest-strictly-increasing-or-strictly-decreasing-subarray": "Easy",
    "maximum-ascending-subarray-sum": "Easy", "kth-distinct-string-in-an-array": "Easy",
    "find-missing-and-repeated-values": "Easy", "height-checker": "Easy",
    "find-lucky-integer-in-an-array": "Easy", "special-array-i": "Easy",
    "monotonic-array": "Easy", "divide-array-into-equal-pairs": "Easy",
    "find-words-that-can-be-formed-by-characters": "Easy",
    "count-the-number-of-consistent-strings": "Easy",
    "largest-3-same-digit-number-in-string": "Easy", "destination-city": "Easy",
    "maximum-product-difference-between-two-pairs": "Easy", "circular-sentence": "Easy",
    "maximum-score-after-splitting-a-string": "Easy", "path-crossing": "Easy",
    "minimum-changes-to-make-alternating-binary-string": "Easy",
    "redistribute-characters-to-make-all-strings-equal": "Easy",
    "largest-substring-between-two-equal-characters": "Easy", "set-mismatch": "Easy",
    "find-common-characters": "Easy", "number-of-students-unable-to-eat-lunch": "Easy",
    "special-array-with-x-elements-greater-than-or-equal-x": "Easy",
    "array-transformation": "Easy", "shortest-word-distance": "Easy",
    "count-vowel-strings-in-ranges": "Medium", "average-waiting-time": "Medium",
    "analyze-user-website-visit-pattern": "Medium",
    "minimum-number-of-operations-to-move-all-balls-to-each-box": "Medium",
    "brick-wall": "Medium", "minimum-index-of-a-valid-split": "Medium",
    "make-sum-divisible-by-p": "Medium", "unique-length-3-palindromic-subsequences": "Medium",
    "number-of-sub-arrays-with-odd-sum": "Medium",
    "number-of-pairs-of-interchangeable-rectangles": "Medium",
    "maximum-product-of-the-length-of-two-palindromic-subsequences": "Medium",
    "grid-game": "Medium", "push-dominoes": "Medium",
    "check-if-a-string-contains-all-binary-codes-of-size-k": "Medium",
    "non-decreasing-array": "Medium", "number-of-ways-to-split-array": "Medium",
    "sign-of-the-product-of-an-array": "Easy",
    "find-the-difference-of-two-arrays": "Easy",
    "uncommon-words-from-two-sentences": "Easy",
    "shifting-letters-ii": "Medium", "word-subsets": "Medium",
    "optimal-partition-of-string": "Medium", "minimum-penalty-for-a-shop": "Medium",
    "champagne-tower": "Medium", "convert-an-array-into-a-2d-array-with-conditions": "Medium",
    "minimum-number-of-operations-to-make-array-empty": "Medium",
    "divide-array-into-arrays-with-max-difference": "Medium", "sequential-digits": "Medium",
    "number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold": "Medium",
    "grumpy-bookstore-owner": "Medium", "maximum-number-of-vowels-in-a-substring-of-given-length": "Medium",
    "max-consecutive-ones-iii": "Medium", "get-equal-substrings-within-budget": "Medium",
    "count-number-of-nice-subarrays": "Medium", "take-k-of-each-character-from-left-and-right": "Medium",
    "contains-duplicate-ii": "Easy", "contains-duplicate-iii": "Hard",
    "find-all-duplicates-in-an-array": "Medium", "first-missing-positive": "Hard",
    "subarray-sum-equals-k": "Medium", "continuous-subarray-sum": "Medium",
    "contiguous-array": "Medium", "longest-palindrome": "Easy",

    // Two Pointers extras
    "bag-of-tokens": "Medium", "trapping-rain-water": "Hard",
    "4sum-ii": "Medium",

    // Stack extras
    "next-greater-element-ii": "Medium", "number-of-visible-people-in-a-queue": "Hard",
    "longest-valid-parentheses": "Hard", "car-fleet-ii": "Hard",
    "sum-of-subarray-minimums": "Medium", "sum-of-subarray-ranges": "Medium",
    "132-pattern": "Medium", "final-prices-with-a-special-discount-in-a-shop": "Easy",
    "maximum-width-ramp": "Medium", "remove-duplicate-letters": "Medium",
    "buildings-with-an-ocean-view": "Medium",
    "minimum-add-to-make-parentheses-valid": "Medium",
    "minimum-string-length-after-removing-substrings": "Easy",
    "crawler-log-folder": "Easy", "clear-digits": "Easy",
    "make-the-string-great": "Easy", "removing-stars-from-a-string": "Medium",
    "validate-stack-sequences": "Medium", "flatten-deeply-nested-array": "Medium",
    "number-of-atoms": "Hard",

    // Binary Search extras
    "median-of-two-sorted-arrays": "Hard",
    "find-the-smallest-divisor-given-a-threshold": "Medium",
    "capacity-to-ship-packages-within-d-days": "Medium",
    "successful-pairs-of-spells-and-potions": "Medium",
    "count-negative-numbers-in-a-sorted-matrix": "Easy",
    "check-if-a-number-is-majority-element-in-a-sorted-array": "Easy",
    "peak-index-in-a-mountain-array": "Medium",
    "minimum-speed-to-arrive-on-time": "Medium",
    "minimum-number-of-days-to-make-m-bouquets": "Medium",
    "arranging-coins": "Easy",

    // Linked List extras
    "merge-in-between-linked-lists": "Medium",
    "partition-list": "Medium", "design-linked-list": "Medium",
    "plus-one-linked-list": "Medium", "add-two-numbers-ii": "Medium",
    "delete-node-in-a-linked-list": "Medium",
    "remove-duplicates-from-sorted-list-ii": "Medium",

    // Trees extras  
    "count-complete-tree-nodes": "Easy", "average-of-levels-in-binary-tree": "Easy",
    "minimum-absolute-difference-in-bst": "Easy", "range-sum-of-bst": "Easy",
    "univalued-binary-tree": "Easy", "leaf-similar-trees": "Easy",
    "binary-tree-level-order-traversal-ii": "Medium",
    "n-ary-tree-level-order-traversal": "Medium",
    "maximum-level-sum-of-a-binary-tree": "Medium",
    "even-odd-tree": "Medium", "deepest-leaves-sum": "Medium",
    "add-one-row-to-tree": "Medium", "complete-binary-tree-inserter": "Medium",
    "maximum-width-of-binary-tree": "Medium",
    "cousins-in-binary-tree": "Easy", "cousins-in-binary-tree-ii": "Medium",
    "flip-equivalent-binary-trees": "Medium",
    "step-by-step-directions-from-a-binary-tree-node-to-another": "Medium",
    "find-bottom-left-tree-value": "Medium",
    "most-frequent-subtree-sum": "Medium",
    "find-largest-value-in-each-tree-row": "Medium",
    "check-completeness-of-a-binary-tree": "Medium",
    "distribute-coins-in-binary-tree": "Medium",
    "house-robber-iii": "Medium",
    "smallest-subtree-with-all-the-deepest-nodes": "Medium",
    "longest-zigzag-path-in-a-binary-tree": "Medium",
    "boundary-of-binary-tree": "Medium",
    "verify-preorder-serialization-of-a-binary-tree": "Medium",
    "construct-binary-tree-from-inorder-and-postorder-traversal": "Medium",
    "construct-binary-search-tree-from-preorder-traversal": "Medium",
    "binary-search-tree-iterator": "Medium",
    "closest-binary-search-tree-value": "Easy",
    "closest-binary-search-tree-value-ii": "Hard",
    "inorder-successor-in-bst": "Medium", "inorder-successor-in-bst-ii": "Medium",
    "two-sum-iv-input-is-a-bst": "Easy",
    "convert-bst-to-greater-tree": "Medium",
    "search-in-a-binary-search-tree": "Easy",
    "trim-a-binary-search-tree": "Medium",
    "map-sum-pairs": "Medium", "replace-words": "Medium",
    "search-suggestions-system": "Medium",
    "extra-characters-in-a-string": "Medium",
    "word-search-ii": "Hard",
    "maximum-xor-of-two-numbers-in-an-array": "Medium",
    "maximum-xor-with-an-element-from-array": "Hard",
    "count-prefix-and-suffix-pairs-ii": "Hard",
    "longest-word-in-dictionary": "Medium",
    "palindrome-pairs": "Hard",
    "design-in-memory-file-system": "Hard",

    // Heap extras
    "sort-characters-by-frequency": "Medium",
    "top-k-frequent-words": "Medium",
    "relative-sort-array": "Easy",
    "seat-reservation-manager": "Medium",
    "minimum-operations-to-halve-array-sum": "Medium",
    "total-cost-to-hire-k-workers": "Medium",
    "process-tasks-using-servers": "Medium",
    "design-a-food-rating-system": "Medium",

    // Graph extras
    "find-if-path-exists-in-graph": "Easy",
    "number-of-provinces": "Medium",
    "number-of-enclaves": "Medium",
    "count-sub-islands": "Medium",
    "word-search": "Medium",
    "minimum-obstacle-removal-to-reach-corner": "Hard",
    "path-with-minimum-effort": "Medium",
    "most-stones-removed-with-at-least-one-same-row-or-column": "Medium",
    "satisfiability-of-equality-equations": "Medium",
    "regions-cut-by-slashes": "Medium",
    "making-a-large-island": "Hard",
    "similar-string-groups": "Hard",
    "reachable-nodes-in-subdivided-graph": "Hard",
    "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance": "Medium",
    "graph-coloring": "Medium",
    "the-earliest-moment-when-everyone-become-friends": "Medium",
    "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree": "Hard",
    "connecting-cities-with-minimum-cost": "Medium",
    "number-of-operations-to-make-network-connected": "Medium",
    "maximum-number-of-non-overlapping-substrings": "Hard",
    "cracking-the-safe": "Hard",
    "count-servers-that-communicate": "Medium", "find-champion-ii": "Medium",
    "check-if-move-is-legal": "Medium",
    "find-closest-node-to-given-two-nodes": "Medium",
    "as-far-from-land-as-possible": "Medium",
    "minimum-fuel-cost-to-report-to-the-capital": "Medium",
    "minimum-number-of-vertices-to-reach-all-nodes": "Medium",
    "count-the-number-of-complete-components": "Medium",
    "shortest-distance-after-road-addition-queries-i": "Medium",
    "find-the-celebrity": "Medium", "kill-process": "Medium",
    "web-crawler": "Medium", "the-maze": "Medium", "the-maze-ii": "Medium",
    "minimum-knight-moves": "Medium", "the-maze-iii": "Hard",
    "shortest-distance-from-all-buildings": "Hard",
    "nested-list-weight-sum": "Medium",
    "maximum-number-of-k-divisible-components": "Hard",
    "sliding-puzzle": "Hard",
    "minimum-number-of-days-to-eat-n-oranges": "Hard",
    "find-all-people-with-secret": "Hard",
    "minimum-cost-to-convert-string-i": "Medium",
    "minimum-cost-walk-in-weighted-graph": "Hard",
    "maximum-employees-to-be-invited-to-a-meeting": "Hard",
    "remove-max-number-of-edges-to-keep-graph-fully-traversable": "Hard",
    "greatest-common-divisor-traversal": "Hard",
    "divide-nodes-into-the-maximum-number-of-groups": "Hard",

    // DP extras
    "delete-and-earn": "Medium", "length-of-longest-fibonacci-subsequence": "Medium",
    "maximum-sum-circular-subarray": "Medium", "maximum-absolute-sum-of-any-subarray": "Medium",
    "best-sightseeing-pair": "Medium", "maximum-subarray-min-product": "Medium",
    "combination-sum-iv": "Medium", "last-stone-weight-ii": "Medium",
    "minimum-ascii-delete-sum-for-two-strings": "Medium",
    "valid-palindrome-iii": "Hard",
    "minimum-insertion-steps-to-make-a-string-palindrome": "Hard",
    "minimum-falling-path-sum": "Medium", "remove-boxes": "Hard",
    "different-ways-to-add-parentheses": "Medium",
    "minimum-number-of-removals-to-make-mountain-array": "Hard",
    "longest-increasing-subsequence-ii": "Hard",
    "number-of-music-playlists": "Hard",
    "coin-change-2": "Medium",
    "best-time-to-buy-and-sell-stock-with-transaction-fee": "Medium",
    "largest-divisible-subset": "Medium",
    "minimum-cost-to-cut-a-stick": "Hard",
    "partition-array-for-maximum-sum": "Medium",
    "maximum-number-of-points-with-cost": "Medium",
    "minimum-number-of-work-sessions-to-finish-the-tasks": "Medium",
    "fair-distribution-of-cookies": "Medium",
    "knight-probability-in-chessboard": "Medium",
    "soup-servings": "Medium", "new-21-game": "Medium",
    "paint-house": "Medium", "paint-fence": "Medium",
    "4-keys-keyboard": "Medium", "handshakes-that-dont-cross": "Hard",
    "filling-bookcase-shelves": "Medium",
    "check-if-there-is-a-valid-partition-for-the-array": "Medium",
    "minimum-cost-for-tickets": "Medium", "stickers-to-spell-word": "Hard",
    "uncrossed-lines": "Medium", "solving-questions-with-brainpower": "Medium",
    "count-ways-to-build-good-strings": "Medium",
    "best-team-with-no-conflicts": "Hard", "knight-dialer": "Medium",
    "count-strictly-increasing-subarrays": "Medium",
    "sentence-screen-fitting": "Medium", "stone-game-iii": "Hard",
    "concatenated-words": "Hard", "maximize-score-after-n-operations": "Hard",
    "find-the-longest-valid-obstacle-course-at-each-position": "Hard",
    "count-all-valid-pickup-and-delivery-options": "Hard",
    "number-of-ways-to-divide-a-long-corridor": "Hard",
    "maximum-sum-of-3-non-overlapping-subarrays": "Hard",
    "student-attendance-record-ii": "Hard",
    "encode-string-with-shortest-length": "Hard",
    "2-keys-keyboard": "Medium", "out-of-boundary-paths": "Medium",
    "longest-ideal-subsequence": "Medium", "count-number-of-teams": "Medium",
    "count-vowels-permutation": "Hard",
    "number-of-ways-to-rearrange-sticks-with-k-sticks-visible": "Hard",
    "flip-string-to-monotone-increasing": "Medium",
    "maximum-value-of-k-coins-from-piles": "Hard",
    "number-of-ways-to-form-a-target-string-given-a-dictionary": "Hard",
    "painting-the-walls": "Hard",
    "number-of-ways-to-stay-in-the-same-place-after-some-steps": "Hard",
    "string-compression-ii": "Hard",
    "arithmetic-slices-ii-subsequence": "Hard",
    "k-inverse-pairs-array": "Hard",
    "minimum-falling-path-sum-ii": "Hard", "freedom-trail": "Hard",
    "split-array-with-same-average": "Hard", "paint-house-ii": "Hard",
    "sum-of-distances-in-tree": "Hard",
    "count-numbers-with-unique-digits": "Medium",
    "number-of-digit-one": "Hard", "numbers-at-most-n-given-digit-set": "Hard",

    // Backtracking extras
    "partition-to-k-equal-sum-subsets": "Medium",
    "the-number-of-beautiful-subsets": "Medium",
    "count-number-of-maximum-bitwise-or-subsets": "Medium",
    "permutation-sequence": "Hard", "factor-combinations": "Medium",
    "check-if-word-can-be-placed-in-crossword": "Medium",
    "robot-room-cleaner": "Hard",
    "pseudo-palindromic-paths-in-a-binary-tree": "Medium",
    "count-good-numbers": "Medium",
    "combination-sum-iii": "Medium",
    "the-k-th-lexicographical-string-of-all-happy-strings-of-length-n": "Medium",
    "splitting-a-string-into-descending-consecutive-values": "Medium",
    "construct-smallest-number-from-di-string": "Medium",
    "find-unique-binary-string": "Medium",
    "maximum-length-of-a-concatenated-string-with-unique-characters": "Medium",
    "construct-the-lexicographically-largest-valid-sequence": "Medium",
    "strobogrammatic-number-ii": "Medium", "brace-expansion": "Medium",
    "maximum-score-words-formed-by-letters": "Hard",

    // Greedy extras
    "divide-intervals-into-minimum-number-of-groups": "Medium",
    "maximum-number-of-events-that-can-be-attended": "Medium",
    "missing-ranges": "Easy", "remove-interval": "Medium",
    "add-bold-tag-in-string": "Medium",
    "check-if-grid-can-be-cut-into-sections": "Medium",
    "jump-game-vii": "Medium", "distant-barcodes": "Medium",
    "queue-reconstruction-by-height": "Medium",
    "valid-parenthesis-string": "Medium",
    "buy-two-chocolates": "Easy",
    "minimum-number-of-moves-to-seat-everyone": "Easy",
    "maximum-odd-binary-number": "Easy",
    "check-if-one-string-swap-can-make-strings-equal": "Easy",
    "minimum-operations-to-make-binary-array-elements-equal-to-one-i": "Medium",
    "minimum-length-of-string-after-operations": "Medium",
    "construct-k-palindrome-strings": "Medium",
    "minimum-increment-to-make-array-unique": "Medium",
    "minimum-swaps-to-group-all-1s-together-ii": "Medium",
    "minimum-number-of-changes-to-make-binary-string-beautiful": "Medium",
    "minimize-maximum-of-array": "Medium",
    "minimum-difference-between-largest-and-smallest-value-in-three-moves": "Medium",
    "maximum-total-importance-of-roads": "Medium",
    "dota2-senate": "Medium", "merge-triplets-to-form-target-triplet": "Medium",
    "check-if-a-parentheses-string-can-be-valid": "Medium",
    "eliminate-maximum-number-of-monsters": "Medium",
    "make-lexicographically-smallest-array-by-swapping-elements": "Medium",
    "minimum-deletions-to-make-character-frequencies-unique": "Medium",
    "minimum-deletions-to-make-string-balanced": "Medium",
    "remove-colored-pieces-if-both-neighbors-are-the-same-color": "Medium",
    "maximum-score-from-removing-substrings": "Medium",
    "maximum-element-after-decreasing-and-rearranging": "Medium",
    "number-of-laser-beams-in-a-bank": "Medium",
    "construct-string-with-repeat-limit": "Medium",
    "find-valid-matrix-given-row-and-column-sums": "Medium",
    "score-after-flipping-matrix": "Medium", "maximum-matrix-sum": "Medium",
    "make-two-arrays-equal-by-reversing-subarrays": "Easy",
    "shortest-subarray-to-be-removed-to-make-array-sorted": "Medium",
    "max-chunks-to-make-sorted": "Medium",
    "maximum-frequency-after-subarray-operation": "Medium",
    "put-boxes-into-the-warehouse-i": "Medium",
    "maximum-score-of-a-good-subarray": "Hard",
    "find-the-maximum-sum-of-node-values": "Hard",
    "minimum-number-of-increments-on-subarrays-to-form-a-target-array": "Hard",
    "apply-operations-to-maximize-score": "Hard",

    // Bit Manipulation extras
    "bitwise-and-of-numbers-range": "Medium",
    "bitwise-xor-of-all-pairings": "Medium",
    "xor-queries-of-a-subarray": "Medium",
    "maximum-xor-for-each-query": "Medium",
    "neighboring-bitwise-xor": "Medium", "minimize-xor": "Medium",
    "power-of-four": "Easy", "divide-two-integers": "Medium",
    "minimum-bit-flips-to-convert-number": "Easy",
    "single-number-iii": "Medium",
    "shuffle-the-array": "Easy",
    "largest-combination-with-bitwise-and-greater-than-zero": "Medium",
    "shortest-subarray-with-or-at-least-k-ii": "Medium",
    "find-kth-bit-in-nth-binary-string": "Medium",
    "minimum-array-end": "Medium", "find-if-array-can-be-sorted": "Medium",
    "longest-nice-subarray": "Medium",
    "find-the-longest-substring-containing-vowels-in-even-counts": "Medium",
    "ip-to-cidr": "Medium",

    // Math & Geometry extras
    "minimum-area-rectangle-ii": "Medium",
    "greatest-common-divisor-of-strings": "Easy",
    "insert-greatest-common-divisors-in-linked-list": "Medium",
    "count-odd-numbers-in-an-interval-range": "Easy",
    "matrix-diagonal-sum": "Easy", "calculate-money-in-leetcode-bank": "Easy",
    "image-smoother": "Easy", "count-of-matches-in-tournament": "Easy",
    "water-bottles": "Easy", "largest-local-values-in-a-matrix": "Easy",
    "armstrong-number": "Easy", "count-substrings-with-only-one-distinct-letter": "Easy",
    "guess-the-majority-in-a-hidden-array": "Medium",
    "maximum-number-of-ones": "Hard", "magic-squares-in-grid": "Medium",
    "shift-2d-grid": "Easy",
    "find-the-punishment-number-of-an-integer": "Medium",
    "check-if-number-is-a-sum-of-powers-of-three": "Medium",
    "walking-robot-simulation": "Medium", "rotating-the-box": "Medium",
    "sum-of-square-numbers": "Medium", "find-missing-observations": "Medium",
    "minimum-time-difference": "Medium",
    "minimum-operations-to-make-a-uni-value-grid": "Medium",
    "largest-submatrix-with-rearrangements": "Medium",
    "widest-vertical-area-between-two-points-containing-no-points": "Medium",
    "tuple-with-same-product": "Medium",
    "find-the-winner-of-the-circular-game": "Medium",
    "count-total-number-of-colored-cells": "Medium",
    "distribute-candies-among-children-ii": "Medium",
    "line-reflection": "Medium",
    "factorial-trailing-zeroes": "Medium",
    "prime-subtraction-operation": "Medium",
    "closest-prime-numbers-in-range": "Medium",

    // Striver non-LC slugs (GFG/platform problems)
    "search-insert-position": "Easy",
    "find-first-and-last-position-of-element-in-sorted-array": "Medium",
    "largest-subarray-with-0-sum": "Medium",
    "count-number-of-subarrays-with-given-xor-k": "Medium",
    "nth-root-of-a-number": "Medium",

    // Educative extras with LC slugs
    "lowest-common-ancestor-of-a-binary-tree-iii": "Medium",
    "find-the-lexicographically-largest-string-from-the-box-ii": "Hard",
};

// Merge additional into main map
for (const k in ADDITIONAL) {
    if (!DIFFICULTY_MAP[k]) DIFFICULTY_MAP[k] = ADDITIONAL[k];
}

// Batch 3 — final remaining slugs
const BATCH_3 = {
    // Arrays & Hashing remaining
    "sort-array-by-increasing-frequency": "Easy", "check-if-array-is-sorted-and-rotated": "Easy",
    "longest-subarray-with-sum-k": "Medium", "rearrange-array-elements-by-sign": "Medium",
    "leaders-in-an-array": "Easy", "majority-element-ii": "Medium",
    "find-the-repeating-and-missing-number": "Medium", "count-inversions": "Hard",
    "remove-outermost-parentheses": "Easy", "maximum-nesting-depth-of-the-parentheses": "Easy",
    "count-number-of-substrings": "Medium", "sum-of-beauty-of-all-substrings": "Medium",
    "z-function": "Medium", "zigzag-conversion": "Medium",
    "guess-the-word": "Hard", "encode-and-decode-tinyurl": "Medium",
    "design-compressed-string-iterator": "Easy", "design-snake-game": "Medium",
    "design-a-leaderboard": "Medium", "design-parking-system": "Easy", "design-hit-counter": "Medium",
    "design-excel-sum-formula": "Hard",
    "subarray-sums-divisible-by-k": "Medium", "longest-duplicate-substring": "Hard",
    "maximum-gap": "Medium", "sort-the-people": "Easy", "wiggle-sort": "Medium",
    "sum-of-absolute-differences-in-a-sorted-array": "Medium",
    "sort-the-jumbled-numbers": "Medium",
    "challenge-yourself-introduction": "Easy",
    "3sum-smaller": "Medium", "merge-two-2d-arrays-by-summing-values": "Easy",
    "number-of-subsequences-that-satisfy-the-given-sum-condition": "Medium",

    // Linked List remaining
    "delete-the-middle-node-of-a-linked-list": "Medium",
    "remove-duplicates-from-sorted-array-ii": "Medium",
    "move-pieces-to-obtain-a-string": "Medium",
    "separate-black-and-white-balls": "Medium",
    "reverse-vowels-of-a-string": "Easy", "reverse-string-ii": "Easy",
    "merge-strings-alternately": "Easy",
    "find-first-palindromic-string-in-the-array": "Easy",
    "reverse-words-in-a-string-iii": "Easy",
    "check-if-two-string-arrays-are-equivalent": "Easy",
    "apply-operations-to-an-array": "Easy", "adding-spaces-to-a-string": "Medium",
    "partition-array-according-to-given-pivot": "Medium",
    "array-with-elements-not-equal-to-average-of-neighbors": "Medium",
    "divide-players-into-teams-of-equal-skill": "Medium",
    "k-th-symbol-in-grammar": "Medium",
    "minimum-time-to-make-rope-colorful": "Medium",
    "minimum-length-of-string-after-deleting-similar-ends": "Medium",
    "sentence-similarity-iii": "Medium",
    "meeting-scheduler": "Medium", "product-of-two-run-length-encoded-arrays": "Medium",
    "sort-transformed-array": "Medium", "calculate-compressed-mean": "Easy",

    // Sliding Window remaining
    "find-the-power-of-k-size-subarrays-i": "Medium",
    "find-x-sum-of-all-k-long-subarrays-i": "Easy",
    "subarray-product-less-than-k": "Medium",
    "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit": "Medium",
    "longest-subarray-of-1s-after-deleting-one-element": "Medium",
    "minimum-operations-to-reduce-x-to-zero": "Medium",
    "maximum-sum-of-distinct-subarrays-with-length-k": "Medium",
    "continuous-subarrays": "Medium",
    "maximum-beauty-of-an-array-after-applying-operation": "Medium",
    "find-longest-special-substring-that-occurs-thrice-i": "Medium",
    "maximum-good-subarray-sum": "Medium",
    "maximum-frequency-of-an-element-after-performing-operations-i": "Medium",
    "maximum-frequency-of-an-element-after-performing-operations-ii": "Hard",
    "longest-substring-with-at-most-two-distinct-characters": "Medium",
    "shortest-subarray-with-sum-at-least-k": "Hard",
    "jump-game-vi": "Medium",
    "number-of-substrings-containing-all-three-characters": "Medium",
    "maximum-points-you-can-obtain-from-cards": "Medium",
    "longest-substring-with-at-most-k-distinct-characters": "Medium",
    "max-value-of-equation": "Hard",
    "minimum-recolors-to-get-k-consecutive-black-blocks": "Easy",
    "minimum-difference-between-highest-and-lowest-of-k-scores": "Easy",
    "max-consecutive-ones-ii": "Medium",
    "find-k-length-substrings-with-no-repeated-characters": "Medium",
    "alternating-groups-ii": "Medium",
    "minimum-number-of-flips-to-make-the-binary-string-alternating": "Medium",
    "defuse-the-bomb": "Easy",
    "length-of-longest-subarray-with-at-most-k-frequency": "Medium",
    "count-subarrays-where-max-element-appears-at-least-k-times": "Medium",
    "count-of-substrings-containing-every-vowel-and-k-consonants-ii": "Medium",
    "minimum-number-of-operations-to-make-array-continuous": "Hard",

    // Stack remaining
    "minimum-number-of-swaps-to-make-the-string-balanced": "Medium",
    "find-the-most-competitive-subsequence": "Medium",
    "basic-calculator-iii": "Hard", "next-smaller-element": "Easy",
    "number-of-recent-calls": "Easy", "time-needed-to-buy-tickets": "Easy",
    "reveal-cards-in-increasing-order": "Medium", "baseball-game": "Easy",
    "reverse-substrings-between-each-pair-of-parentheses": "Medium",
    "ternary-expression-parser": "Medium", "find-permutation": "Medium",
    "robot-collisions": "Hard",

    // Binary Search remaining
    "guess-number-higher-or-lower": "Easy", "kth-missing-positive-number": "Easy",
    "random-pick-with-weight": "Medium", "valid-perfect-square": "Easy",
    "missing-number-in-arithmetic-progression": "Medium",
    "missing-element-in-sorted-array": "Medium",
    "find-the-index-of-the-large-integer": "Medium",
    "maximum-average-subarray-ii": "Hard",
    "house-robber-iv": "Medium", "minimize-the-maximum-difference-of-pairs": "Medium",
    "minimum-time-to-repair-cars": "Medium",
    "maximum-number-of-removable-characters": "Medium",
    "most-beautiful-item-for-each-query": "Medium",
    "count-the-number-of-fair-pairs": "Medium",
    "binary-searchable-numbers-in-an-unsorted-array": "Medium",
    "leftmost-column-with-at-least-a-one": "Medium",
    "kth-smallest-product-of-two-sorted-arrays": "Hard",
    "find-in-mountain-array": "Hard",
    "minimum-limit-of-balls-in-a-bag": "Medium",
    "minimized-maximum-of-products-distributed-to-any-store": "Medium",
    "maximum-candies-allocated-to-k-children": "Medium",
    "kth-element-of-two-sorted-arrays": "Medium",
    "find-the-row-with-maximum-number-of-1s": "Easy",
    "search-a-2d-matrix-ii": "Medium", "find-a-peak-element-ii": "Hard",
    "matrix-median": "Medium",

    // Linked List remaining
    "print-immutable-linked-list-in-reverse": "Medium",
    "merge-nodes-in-between-zeros": "Medium", "insertion-sort-list": "Medium",
    "minimum-index-sum-of-two-lists": "Easy", "length-of-loop": "Easy",
    "sort-ll-of-0s-1s-and-2s": "Medium",
    "find-pairs-with-given-sum-in-dll": "Easy",
    "remove-duplicates-from-sorted-dll": "Easy",
    "flatten-a-linked-list": "Medium",
    "find-the-minimum-and-maximum-number-of-nodes-between-critical-points": "Medium",
    "remove-nodes-from-linked-list": "Medium",
    "delete-nodes-from-linked-list-present-in-array": "Medium",
    "flatten-a-multilevel-doubly-linked-list": "Medium",

    // Trees remaining
    "binary-tree-vertical-order-traversal": "Medium",
    "smallest-string-starting-from-leaf": "Medium",
    "n-ary-tree-postorder-traversal": "Easy",
    "construct-binary-tree-from-preorder-and-postorder-traversal": "Medium",
    "find-mode-in-binary-search-tree": "Easy",
    "find-leaves-of-binary-tree": "Medium",
    "maximum-difference-between-node-and-ancestor": "Medium",
    "find-duplicate-subtrees": "Medium",
    "serialize-and-deserialize-n-ary-tree": "Hard",
    "construct-string-from-binary-tree": "Medium",
    "word-squares": "Hard", "design-search-autocomplete-system": "Hard",
    "prefix-and-suffix-search": "Hard",
    "count-prefix-and-suffix-pairs-i": "Easy",
    "counting-words-with-a-given-prefix": "Easy",
    "remove-sub-folders-from-the-filesystem": "Medium",
    "sum-of-prefix-scores-of-strings": "Hard",
    "top-view-of-binary-tree": "Medium", "bottom-view-of-binary-tree": "Medium",
    "children-sum-property": "Medium", "floor-in-bst": "Easy",
    "maximum-sum-bst-in-binary-tree": "Hard",
    "number-of-distinct-substrings": "Medium",
    "minimum-distance-between-bst-nodes": "Easy",
    "my-calendar-i": "Medium", "my-calendar-ii": "Medium",
    "stock-price-fluctuation": "Medium",
    "verify-preorder-sequence-in-binary-search-tree": "Medium",
    "two-sum-bsts": "Medium", "largest-bst-subtree": "Medium",
    "count-of-smaller-numbers-after-self": "Hard",
    "merge-two-binary-trees": "Easy", "evaluate-boolean-binary-tree": "Easy",
    "binary-tree-longest-consecutive-sequence": "Medium",
    "binary-tree-longest-consecutive-sequence-ii": "Medium",
    "find-root-of-n-ary-tree": "Medium",
    "encode-n-ary-tree-to-binary-tree": "Hard",
    "create-binary-tree-from-descriptions": "Medium",
    "reverse-odd-levels-of-binary-tree": "Medium",
    "minimum-number-of-operations-to-sort-a-binary-tree-by-level": "Medium",
    "kth-largest-sum-in-a-binary-tree": "Medium",
    "linked-list-in-binary-tree": "Medium",
    "minimum-time-to-collect-all-apples-in-a-tree": "Medium",
    "number-of-good-leaf-nodes-pairs": "Medium",
    "operations-on-tree": "Medium", "all-possible-full-binary-trees": "Medium",
    "validate-binary-tree-nodes": "Medium",
    "delete-leaves-with-a-given-value": "Medium",
    "range-sum-query-mutable": "Medium", "count-univalue-subtrees": "Medium",
    "maximum-average-subtree": "Medium", "diameter-of-n-ary-tree": "Medium",

    // Heap remaining
    "relative-ranks": "Easy", "take-gifts-from-the-richest-pile": "Easy",
    "furthest-building-you-can-reach": "Medium", "single-threaded-cpu": "Medium",
    "sort-a-k-sorted-array": "Medium", "campus-bikes": "Medium",
    "rearrange-string-k-distance-apart": "Hard",
    "minimize-deviation-in-array": "Hard",
    "maximum-subsequence-score": "Medium",
    "maximum-transactions-without-negative-balance": "Medium",
    "constrained-subsequence-sum": "Hard",
    "find-building-where-alice-and-bob-can-meet": "Hard",

    // Graphs remaining
    "number-of-closed-islands": "Medium",
    "time-needed-to-inform-all-employees": "Medium",
    "employee-importance": "Medium", "maximum-number-of-fish-in-a-grid": "Medium",
    "minimum-score-of-a-path-between-two-cities": "Medium",
    "path-with-maximum-gold": "Medium",
    "most-profitable-path-in-a-tree": "Medium",
    "maximum-number-of-points-from-grid-queries": "Hard",
    "number-of-distinct-islands-ii": "Hard", "number-of-good-paths": "Hard",
    "minimum-number-of-days-to-disconnect-island": "Hard",
    "shortest-path-in-a-grid-with-obstacles-elimination": "Hard",
    "all-paths-from-source-lead-to-destination": "Medium",
    "sequence-reconstruction": "Medium",
    "largest-color-value-in-a-directed-graph": "Hard",
    "course-schedule-iv": "Medium", "clone-n-ary-tree": "Medium",
    "number-of-ways-to-arrive-at-destination": "Medium",
    "second-minimum-time-to-reach-destination": "Hard",
    "minimum-weighted-subgraph-with-the-required-paths": "Hard",
    "minimum-time-to-visit-a-cell-in-a-grid": "Hard",
    "find-the-safest-path-in-a-grid": "Medium",
    "sentence-similarity-ii": "Medium",
    "largest-component-size-by-common-factor": "Hard",

    // Striver/GFG specific slugs (best-effort difficulty guess)
    "cycle-detection-undirected": "Medium", "topological-sort": "Medium",
    "shortest-path-undirected": "Medium", "shortest-path-in-dag": "Medium",
    "dijkstra-algorithm": "Medium", "minimum-multiplications-to-reach-end": "Medium",
    "bellman-ford": "Medium", "floyd-warshall": "Medium",
    "prims-algorithm": "Medium", "articulation-point": "Hard",
    "ninjas-training": "Medium", "unbounded-knapsack": "Medium",
    "rod-cutting": "Medium", "longest-bitonic-subsequence": "Medium",
    "matrix-chain-multiplication": "Hard",
    "longest-repeating-subsequence": "Medium",
    "sort-a-stack-using-recursion": "Easy", "reverse-a-stack": "Medium",
    "generate-binary-strings-without-adjacent-zeros": "Medium",
    "count-subsets-with-sum-k": "Medium",
    "rat-in-a-maze": "Medium", "m-coloring-problem": "Medium",
    "n-queens-b657knjdplj": "Hard",
    "fractional-knapsack": "Medium",
    "n-meetings-in-one-room": "Easy", "minimum-platforms": "Medium",
    "job-sequencing-problem": "Medium", "shortest-job-first": "Easy",
    "maximize-ysum-by-picking-a-triplet-of-distinct-xvalues": "Medium",

    // Bit manipulation GFG
    "check-ith-bit": "Easy", "check-number-odd": "Easy",
    "set-rightmost-unset-bit": "Easy", "swap-two-numbers": "Easy",
    "xor-of-numbers-in-a-given-range": "Medium",
    "prime-factors": "Easy",
};

for (const k in BATCH_3) {
    if (!DIFFICULTY_MAP[k]) DIFFICULTY_MAP[k] = BATCH_3[k];
}

// Batch 4 — final remaining 13 slugs
const BATCH_4 = {
    "find-polygon-with-the-largest-perimeter": "Medium",
    "count-number-of-bad-pairs": "Medium",
    "find-the-length-of-the-longest-common-prefix": "Medium",
    "count-unguarded-cells-in-the-grid": "Medium",
    "brightest-position-on-street": "Medium",
    "apply-substitutions": "Medium",
    "synonymous-sentences": "Medium",
    "naming-a-company": "Hard",
    "number-of-submatrices-that-sum-to-target": "Hard",
    "number-of-ships-in-a-rectangle": "Hard",
    "time-taken-to-cross-the-door": "Hard",
    "find-anagram-mappings": "Easy",
    "maximum-difference-between-even-and-odd-frequency-i": "Easy",
};

for (const k in BATCH_4) {
    if (!DIFFICULTY_MAP[k]) DIFFICULTY_MAP[k] = BATCH_4[k];
}

// ============================================================
// STEP 3: Merge educative difficulties into main map
// ============================================================
for (const slug in eduDiffMap) {
    if (!DIFFICULTY_MAP[slug]) {
        DIFFICULTY_MAP[slug] = eduDiffMap[slug];
    }
}

// ============================================================
// STEP 4: Walk through merged data, add difficulty, audit dedup
// ============================================================
let totalProblems = 0;
let withDifficulty = 0;
let withoutDifficulty = [];
let withLeetcode = 0;
let withoutLeetcode = 0;
const seenSlugs = {};
const duplicates = [];
const sourceProblems = {};
const overlapCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
const diffCounts = { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 };
const categoryStats = {};

for (const cat in merged) {
    categoryStats[cat] = { total: 0, subcategories: 0 };
    for (const sub in merged[cat]) {
        categoryStats[cat].subcategories++;
        for (const p of merged[cat][sub]) {
            totalProblems++;
            categoryStats[cat].total++;

            // Count sources
            p.sources.forEach(s => {
                if (!sourceProblems[s]) sourceProblems[s] = 0;
                sourceProblems[s]++;
            });
            overlapCounts[p.sources.length] = (overlapCounts[p.sources.length] || 0) + 1;

            // LeetCode URL stats
            if (p.leetcodeUrl) withLeetcode++;
            else withoutLeetcode++;

            // Extract slug for difficulty lookup
            let slug = '';
            if (p.leetcodeUrl && p.leetcodeUrl.includes('leetcode.com/problems/')) {
                const m = p.leetcodeUrl.match(/leetcode\.com\/problems\/([^\/\?]+)/);
                if (m) slug = m[1].toLowerCase();
            }

            // Check for duplicate slugs across categories
            if (slug && seenSlugs[slug]) {
                duplicates.push({
                    name: p.name,
                    slug: slug,
                    location1: seenSlugs[slug],
                    location2: `${cat} > ${sub}`
                });
            } else if (slug) {
                seenSlugs[slug] = `${cat} > ${sub}`;
            }

            // Assign difficulty
            let diff = DIFFICULTY_MAP[slug] || '';
            if (!diff && slug) {
                // Try educative map
                diff = eduDiffMap[slug] || '';
            }
            p.difficulty = diff || 'Unknown';

            if (p.difficulty !== 'Unknown') {
                withDifficulty++;
                diffCounts[p.difficulty]++;
            } else {
                diffCounts.Unknown++;
                withoutDifficulty.push({ name: p.name, slug: slug, cat, sub });
            }
        }
    }
}

// ============================================================
// STEP 5: Write enriched data back
// ============================================================
fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 2));
console.log(`\nEnriched data written to ${mergedPath}`);

// ============================================================
// STEP 6: Print comprehensive statistics
// ============================================================
console.log(`\n${'='.repeat(60)}`);
console.log(`  FINAL DATASET STATISTICS`);
console.log(`${'='.repeat(60)}`);

console.log(`\n--- Overall ---`);
console.log(`Total Unique Problems: ${totalProblems}`);
console.log(`With LeetCode URL: ${withLeetcode} (${(withLeetcode / totalProblems * 100).toFixed(1)}%)`);
console.log(`Without LeetCode URL: ${withoutLeetcode}`);
console.log(`Categories: ${Object.keys(merged).length}`);
let totalSubs = 0;
for (const c in merged) totalSubs += Object.keys(merged[c]).length;
console.log(`Sub-categories: ${totalSubs}`);

console.log(`\n--- Difficulty Distribution ---`);
console.log(`Easy: ${diffCounts.Easy} (${(diffCounts.Easy / totalProblems * 100).toFixed(1)}%)`);
console.log(`Medium: ${diffCounts.Medium} (${(diffCounts.Medium / totalProblems * 100).toFixed(1)}%)`);
console.log(`Hard: ${diffCounts.Hard} (${(diffCounts.Hard / totalProblems * 100).toFixed(1)}%)`);
console.log(`Unknown: ${diffCounts.Unknown} (${(diffCounts.Unknown / totalProblems * 100).toFixed(1)}%)`);
console.log(`Coverage: ${withDifficulty}/${totalProblems} (${(withDifficulty / totalProblems * 100).toFixed(1)}%)`);

console.log(`\n--- By Source ---`);
Object.entries(sourceProblems).sort((a, b) => b[1] - a[1]).forEach(([src, count]) => {
    const shortName = src.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
    console.log(`  ${shortName}: ${count} problems`);
});

console.log(`\n--- Overlap ---`);
for (let i = 1; i <= 6; i++) {
    if (overlapCounts[i]) console.log(`  In ${i} source(s): ${overlapCounts[i]} problems`);
}
console.log(`  Multi-source total: ${totalProblems - overlapCounts[1]} problems (${((totalProblems - overlapCounts[1]) / totalProblems * 100).toFixed(1)}%)`);

console.log(`\n--- Categories ---`);
for (const cat in categoryStats) {
    console.log(`  ${cat}: ${categoryStats[cat].total} problems, ${categoryStats[cat].subcategories} sub-categories`);
}

console.log(`\n--- Deduplication Issues ---`);
if (duplicates.length === 0) {
    console.log(`No duplicates found! All problems are unique by LeetCode slug.`);
} else {
    console.log(`Found ${duplicates.length} potential duplicates:`);
    duplicates.forEach(d => {
        console.log(`  "${d.name}" (${d.slug})`);
        console.log(`    -> ${d.location1}`);
        console.log(`    -> ${d.location2}`);
    });
}

if (withoutDifficulty.length > 0) {
    console.log(`\n--- Problems Missing Difficulty (${withoutDifficulty.length}) ---`);
    withoutDifficulty.forEach(p => {
        console.log(`  [${p.cat} > ${p.sub}] ${p.name} (${p.slug || 'no-slug'})`);
    });
}
