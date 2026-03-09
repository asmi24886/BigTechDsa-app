// ============================================================
// COMPREHENSIVE PROBLEM-LEVEL RECLASSIFICATION
// Maps specific problem slugs to their correct subcategories
// within their existing parent category.
// ============================================================

const PROBLEM_RECLASSIFY = {

    // ═══════════════════════════════════════════════════════════
    // ARRAYS & HASHING
    // ═══════════════════════════════════════════════════════════

    // --- From "Simulation / General Array" (134 problems) ---
    // String/Number Manipulation
    'plus-one': 'Simulation / General Array',
    'multiply-strings': 'Simulation / General Array',
    'add-to-array-form-of-integer': 'Simulation / General Array',
    'add-binary': 'Simulation / General Array',
    'add-strings': 'Simulation / General Array',
    'string-to-integer-atoi': 'Simulation / General Array',
    'roman-to-integer': 'Simulation / General Array',
    'integer-to-roman': 'Simulation / General Array',
    'score-of-a-string': 'Simulation / General Array',

    // Palindrome related -> keep in general or move
    'palindrome-number': 'Simulation / General Array',
    'valid-palindrome': 'Simulation / General Array',
    'valid-palindrome-ii': 'Simulation / General Array',
    'shortest-palindrome': 'String Matching (KMP / Z-Function)',
    'longest-palindrome': 'Hash Map: Frequency/Counters',
    'palindrome-permutation': 'Hash Map: Frequency/Counters',

    // Cyclic Sort
    'first-missing-positive': 'Cyclic Sort',
    'find-all-duplicates-in-an-array': 'Cyclic Sort',
    'find-all-numbers-disappeared-in-an-array': 'Cyclic Sort',
    'set-mismatch': 'Cyclic Sort',
    'find-the-corrupt-pair': 'Cyclic Sort',
    'find-the-first-k-missing-positive-numbers': 'Cyclic Sort',
    'sort-array-by-parity-ii': 'Cyclic Sort',
    'cyclic-sort': 'Cyclic Sort',

    // String Matching / Pattern
    'find-the-index-of-the-first-occurrence-in-a-string': 'String Matching (KMP / Z-Function)',
    'repeated-string-match': 'String Matching (KMP / Z-Function)',
    'rotate-string': 'String Matching (KMP / Z-Function)',
    'find-beautiful-indices-in-the-given-array-ii': 'String Matching (KMP / Z-Function)',
    'repeated-substring-pattern': 'String Matching (KMP / Z-Function)',
    'string-matching-in-an-array': 'String Matching (KMP / Z-Function)',

    // Prefix Sums
    'number-of-zero-filled-subarrays': 'Prefix Sums',
    'number-of-good-ways-to-split-a-string': 'Prefix Sums',
    'number-of-ways-to-split-array': 'Prefix Sums',
    'number-of-sub-arrays-with-odd-sum': 'Prefix Sums',
    'grid-game': 'Prefix Sums',
    'minimum-penalty-for-a-shop': 'Prefix Sums',
    'make-sum-divisible-by-p': 'Prefix Sums',
    'count-vowel-strings-in-ranges': 'Prefix Sums',
    'minimum-number-of-operations-to-move-all-balls-to-each-box': 'Prefix Sums',
    'shifting-letters-ii': 'Prefix Sums',
    'number-of-submatrices-that-sum-to-target': 'Prefix Sums',
    'maximum-score-after-splitting-a-string': 'Prefix Sums',
    'brightest-position-on-street': 'Prefix Sums',

    // Hash Map: Frequency/Counters
    'number-of-good-pairs': 'Hash Map: Frequency/Counters',
    'ransom-note': 'Hash Map: Frequency/Counters',
    'maximum-number-of-balloons': 'Hash Map: Frequency/Counters',
    'find-words-that-can-be-formed-by-characters': 'Hash Map: Frequency/Counters',
    'count-the-number-of-consistent-strings': 'Hash Map: Frequency/Counters',
    'redistribute-characters-to-make-all-strings-equal': 'Hash Map: Frequency/Counters',
    'first-unique-character-in-a-string': 'Hash Map: Frequency/Counters',
    'find-common-characters': 'Hash Map: Frequency/Counters',
    'unique-email-addresses': 'Hash Map: Frequency/Counters',
    'kth-distinct-string-in-an-array': 'Hash Map: Frequency/Counters',
    'find-lucky-integer-in-an-array': 'Hash Map: Frequency/Counters',
    'divide-array-into-equal-pairs': 'Hash Map: Frequency/Counters',
    'find-the-difference-of-two-arrays': 'Hash Map: Frequency/Counters',
    'uncommon-words-from-two-sentences': 'Hash Map: Frequency/Counters',
    'word-subsets': 'Hash Map: Frequency/Counters',
    'minimum-numbers-of-operations-to-make-array-empty': 'Hash Map: Frequency/Counters',
    'minimum-number-of-operations-to-make-array-empty': 'Hash Map: Frequency/Counters',
    'unique-number-of-occurrences': 'Hash Map: Frequency/Counters',
    'bulls-and-cows': 'Hash Map: Frequency/Counters',
    'jewels-and-stones': 'Hash Map: Frequency/Counters',
    'rank-teams-by-votes': 'Hash Map: Frequency/Counters',
    'pairs-of-songs-with-total-durations-divisible-by-60': 'Hash Map: Frequency/Counters',
    'destination-city': 'Hash Map: Frequency/Counters',
    'find-duplicate-file-in-system': 'Hash Map: Frequency/Counters',
    'brick-wall': 'Hash Map: Frequency/Counters',
    'number-of-pairs-of-interchangeable-rectangles': 'Hash Map: Frequency/Counters',
    'count-number-of-bad-pairs': 'Hash Map: Frequency/Counters',
    'find-the-length-of-the-longest-common-prefix': 'Hash Map: Frequency/Counters',
    'shortest-word-distance-ii': 'Hash Map: Frequency/Counters',
    'dot-product-of-two-sparse-vectors': 'Hash Map: Frequency/Counters',
    'number-of-senior-citizens': 'Simulation / General Array',
    'find-missing-and-repeated-values': 'Hash Map: Frequency/Counters',

    // Hash Set: Lookups/Uniqueness
    'counting-elements': 'Hash Set: Lookups/Uniqueness',
    'check-if-a-string-contains-all-binary-codes-of-size-k': 'Hash Set: Lookups/Uniqueness',
    'repeated-dna-sequences': 'Hash Set: Lookups/Uniqueness',
    'path-crossing': 'Hash Set: Lookups/Uniqueness',
    'optimal-partition-of-string': 'Hash Set: Lookups/Uniqueness',
    'unique-length-3-palindromic-subsequences': 'Hash Set: Lookups/Uniqueness',

    // Subsequences / Greedy on Strings
    'increasing-triplet-subsequence': 'Simulation / General Array',
    'split-array-into-consecutive-subsequences': 'Simulation / General Array',
    'number-of-matching-subsequences': 'Simulation / General Array',
    'append-characters-to-string-to-make-subsequence': 'Simulation / General Array',
    'shortest-way-to-form-string': 'Simulation / General Array',

    // Sorting & Intervals
    'merge-sorted-array': 'Sorting & Intervals',
    'largest-number': 'Sorting & Intervals',
    'height-checker': 'Sorting & Intervals',
    'convert-an-array-into-a-2d-array-with-conditions': 'Sorting & Intervals',
    'divide-array-into-arrays-with-max-difference': 'Sorting & Intervals',
    'find-polygon-with-the-largest-perimeter': 'Sorting & Intervals',
    'non-decreasing-array': 'Sorting & Intervals',

    // Matrix Traversal & Math
    'count-unguarded-cells-in-the-grid': 'Matrix Traversal & Math',
    'sparse-matrix-multiplication': 'Matrix Traversal & Math',

    // Design / Encodings
    'logger-rate-limiter': 'Design / Encodings',
    'first-unique-number': 'Design / Encodings',
    'zigzag-iterator': 'Design / Encodings',
    'shortest-word-distance': 'Design / Encodings',
    'apply-substitutions': 'Design / Encodings',
    'text-justification': 'Simulation / General Array',
    'naming-a-company': 'Hash Set: Lookups/Uniqueness',

    // Premium / Misc
    'valid-word-square': 'Matrix Traversal & Math',
    'confusing-number': 'Simulation / General Array',
    'sentence-similarity': 'Hash Map: Frequency/Counters',
    'largest-unique-number': 'Hash Map: Frequency/Counters',
    'single-row-keyboard': 'Simulation / General Array',
    'perform-string-shifts': 'Simulation / General Array',
    'group-shifted-strings': 'Hash Map: Frequency/Counters',
    'maximum-distance-in-arrays': 'Simulation / General Array',
    'lonely-pixel-i': 'Matrix Traversal & Math',
    'candy-crush': 'Simulation / General Array',
    'find-smallest-common-element-in-all-rows': 'Simulation / General Array',
    'one-edit-distance': 'Simulation / General Array',
    'reverse-words-in-a-string-ii': 'Simulation / General Array',
    'synonymous-sentences': 'Simulation / General Array',
    'number-of-ships-in-a-rectangle': 'Simulation / General Array',
    'time-taken-to-cross-the-door': 'Simulation / General Array',
    'number-of-students-unable-to-eat-lunch': 'Simulation / General Array',
    'special-array-with-x-elements-greater-than-or-equal-x': 'Sorting & Intervals',
    'special-array-i': 'Simulation / General Array',
    'monotonic-array': 'Simulation / General Array',
    'pascals-triangle-ii': 'Simulation / General Array',
    'largest-3-same-digit-number-in-string': 'Simulation / General Array',
    'maximum-product-difference-between-two-pairs': 'Sorting & Intervals',
    'circular-sentence': 'Simulation / General Array',
    'minimum-changes-to-make-alternating-binary-string': 'Simulation / General Array',
    'largest-substring-between-two-equal-characters': 'Hash Map: Frequency/Counters',
    'average-waiting-time': 'Simulation / General Array',
    'analyze-user-website-visit-pattern': 'Hash Map: Frequency/Counters',
    'minimum-index-of-a-valid-split': 'Hash Map: Frequency/Counters',
    'push-dominoes': 'Simulation / General Array',
    'sign-of-the-product-of-an-array': 'Simulation / General Array',
    'champagne-tower': 'Simulation / General Array',
    'sequential-digits': 'Simulation / General Array',
    'convert-sorted-list-to-binary-search-tree': 'Simulation / General Array',
    'construct-quad-tree': 'Simulation / General Array',
    'maximum-binary-tree': 'Simulation / General Array',
    'concatenation-of-array': 'Simulation / General Array',
    'replace-elements-with-greatest-element-on-right-side': 'Simulation / General Array',
    'length-of-last-word': 'Simulation / General Array',
    'longest-strictly-increasing-or-strictly-decreasing-subarray': 'Simulation / General Array',
    'maximum-ascending-subarray-sum': 'Simulation / General Array',
    'array-transformation': 'Simulation / General Array',
    'can-place-flowers': 'Simulation / General Array',
    'maximum-product-of-the-length-of-two-palindromic-subsequences': 'Simulation / General Array',
    'minimum-flips-to-make-the-binary-string-alternate': 'Prefix Sums',

    // --- From "General DP" (38 problems originally in Arrays) ---
    'sum-of-mutated-array-closest-to-target': 'Sorting & Intervals',
    'maximum-number-of-integers-to-choose-from-a-range-i': 'Hash Set: Lookups/Uniqueness',
    'find-the-distance-value-between-two-arrays': 'Sorting & Intervals',
    'find-target-indices-after-sorting-array': 'Sorting & Intervals',
    'minimum-operations-to-make-all-array-elements-equal': 'Prefix Sums',
    'longest-subsequence-with-limited-sum': 'Prefix Sums',
    'minimum-space-wasted-from-packaging': 'Sorting & Intervals',
    'two-sum-less-than-k': 'Sorting & Intervals',
    'valid-triangle-number': 'Sorting & Intervals',
    'count-pairs-in-two-arrays': 'Sorting & Intervals',
    'h-index': 'Sorting & Intervals',
    'where-will-the-ball-fall': 'Matrix Traversal & Math',
    'number-of-spaces-cleaning-robot-cleaned': 'Matrix Traversal & Math',
    'count-negative-numbers-in-a-sorted-matrix': 'Matrix Traversal & Math',
    'minimum-time-takes-to-reach-destination-without-drowning': 'Matrix Traversal & Math',
    'smallest-rectangle-enclosing-black-pixels': 'Matrix Traversal & Math',
    'minimize-maximum-value-in-a-grid': 'Matrix Traversal & Math',
    'kth-smallest-number-in-multiplication-table': 'Matrix Traversal & Math',
    'fraction-to-recurring-decimal': 'Hash Map: Frequency/Counters',
    'number-of-wonderful-substrings': 'Prefix Sums',
    'total-appeal-of-a-string': 'Hash Map: Frequency/Counters',
    'find-longest-self-contained-substring': 'Hash Map: Frequency/Counters',
    'longest-palindrome-by-concatenating-two-letter-words': 'Hash Map: Frequency/Counters',
    'count-anagrams': 'Hash Map: Frequency/Counters',
    'divide-array-into-increasing-sequences': 'Sorting & Intervals',
    'challenge-yourself-introduction': 'Simulation / General Array',
    'loud-and-rich': 'Simulation / General Array',

    // --- Striver subcats: Easy, Medium, Hard Problems ---
    'check-if-array-is-sorted-and-rotated': 'Simulation / General Array',
    'longest-subarray-with-sum-k': 'Prefix Sums',
    'two-sum': 'Hash Map: Frequency/Counters',
    'majority-element': 'Hash Map: Frequency/Counters',
    'rearrange-array-elements-by-sign': 'Simulation / General Array',
    'leaders-in-an-array': 'Simulation / General Array',
    'longest-consecutive-sequence': 'Hash Set: Lookups/Uniqueness',
    'subarray-sum-equals-k': 'Prefix Sums',
    // Basic and Easy String Problems
    'remove-outermost-parentheses': 'Simulation / General Array',
    'largest-odd-number-in-string': 'Simulation / General Array',
    'longest-common-prefix': 'Simulation / General Array',
    'isomorphic-strings': 'Hash Map: Frequency/Counters',
    // Medium String Problems
    'maximum-nesting-depth-of-the-parentheses': 'Simulation / General Array',
    'count-number-of-substrings': 'Hash Map: Frequency/Counters',
    'sum-of-beauty-of-all-substrings': 'Hash Map: Frequency/Counters',
    // Hard Problems
    'count-and-say': 'Simulation / General Array',
    'z-function': 'String Matching (KMP / Z-Function)',
    'implement-strstr': 'String Matching (KMP / Z-Function)',
    'longest-happy-prefix': 'String Matching (KMP / Z-Function)',

    // ═══════════════════════════════════════════════════════════
    // TWO POINTERS
    // ═══════════════════════════════════════════════════════════

    // --- "General Two Pointers" ---
    'valid-word-abbreviation': 'In-place Array Modification',
    'merge-strings-alternately': 'In-place Array Modification',
    'find-first-palindromic-string-in-the-array': 'Expanding From Center (Palindromes)',
    'reverse-words-in-a-string-iii': 'String Reversal',
    'check-if-two-string-arrays-are-equivalent': 'In-place Array Modification',
    'apply-operations-to-an-array': 'In-place Array Modification',
    'strobogrammatic-number': 'Converging (Sorted Array Target Sum)',
    'adding-spaces-to-a-string': 'In-place Array Modification',
    'partition-array-according-to-given-pivot': 'In-place Array Modification',
    'array-with-elements-not-equal-to-average-of-neighbors': 'In-place Array Modification',
    'divide-players-into-teams-of-equal-skill': 'Converging (Sorted Array Target Sum)',
    'k-th-symbol-in-grammar': 'In-place Array Modification',
    'minimum-time-to-make-rope-colorful': 'In-place Array Modification',
    'bag-of-tokens': 'Converging (Sorted Array Target Sum)',
    'minimum-length-of-string-after-deleting-similar-ends': 'Converging (Sorted Array Target Sum)',
    'sentence-similarity-iii': 'In-place Array Modification',
    'meeting-scheduler': 'Converging (Sorted Array Target Sum)',
    'product-of-two-run-length-encoded-arrays': 'In-place Array Modification',
    'sort-transformed-array': 'Converging (Sorted Array Target Sum)',

    // --- "General DP" (in Two Pointers) ---
    'minimum-number-of-moves-to-make-palindrome': 'Converging (Sorted Array Target Sum)',
    'next-palindrome-using-same-digits': 'Expanding From Center (Palindromes)',
    'count-subarrays-with-fixed-bounds': 'In-place Array Modification',
    'find-the-lexicographically-largest-string-from-the-box-ii': 'In-place Array Modification',
    'get-the-maximum-score': 'In-place Array Modification',
    'create-maximum-number': 'In-place Array Modification',
    'circular-array-loop': 'Fast & Slow (Cycle Detection)',
    'split-a-circular-linked-list': 'Fast & Slow (Cycle Detection)',

    // ═══════════════════════════════════════════════════════════
    // SLIDING WINDOW
    // ═══════════════════════════════════════════════════════════

    // --- "General Sliding Window" ---
    'minimum-recolors-to-get-k-consecutive-black-blocks': 'Fixed Size (Subarray Calculation)',
    'minimum-difference-between-highest-and-lowest-of-k-scores': 'Fixed Size (Subarray Calculation)',
    'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold': 'Fixed Size (Subarray Calculation)',
    'grumpy-bookstore-owner': 'Fixed Size (Subarray Calculation)',
    'max-consecutive-ones-ii': 'Variable Size (Condition-Based)',
    'find-k-length-substrings-with-no-repeated-characters': 'Fixed Size (Subarray Calculation)',
    'alternating-groups-ii': 'Fixed Size (Subarray Calculation)',
    'maximum-number-of-vowels-in-a-substring-of-given-length': 'Fixed Size (Subarray Calculation)',
    'minimum-number-of-flips-to-make-the-binary-string-alternating': 'Fixed Size (Subarray Calculation)',
    'defuse-the-bomb': 'Fixed Size (Subarray Calculation)',
    'get-equal-substrings-within-budget': 'Variable Size (Condition-Based)',
    'length-of-longest-subarray-with-at-most-k-frequency': 'Variable Size (Condition-Based)',
    'count-subarrays-where-max-element-appears-at-least-k-times': 'Variable Size (Condition-Based)',
    'count-of-substrings-containing-every-vowel-and-k-consonants-ii': 'Variable Size (Condition-Based)',
    'minimum-number-of-operations-to-make-array-continuous': 'Variable Size (Condition-Based)',

    // --- "Medium Problems" (Striver) ---
    'binary-subarrays-with-sum': 'Variable Size (Condition-Based)',
    'count-number-of-nice-subarrays': 'Variable Size (Condition-Based)',
    'number-of-substrings-containing-all-three-characters': 'Variable Size (Condition-Based)',
    'maximum-points-you-can-obtain-from-cards': 'Fixed Size (Subarray Calculation)',

    // --- "Hard Problems" (Striver) ---
    'longest-substring-with-at-most-k-distinct-characters': 'Character Frequency Matching',
    'subarrays-with-k-different-integers': 'Variable Size (Condition-Based)',
    'minimum-window-subsequence': 'Variable Size (Condition-Based)',

    // --- "General Stack/Queue" (in Sliding Window) ---
    'max-value-of-equation': 'Monotonic Queue for Max/Min',

    // --- "General DP" (in Sliding Window) ---
    'diet-plan-performance': 'Fixed Size (Subarray Calculation)',
    'count-subarrays-with-score-less-than-k': 'Variable Size (Condition-Based)',
    'count-substrings-with-k-frequency-characters-ii': 'Variable Size (Condition-Based)',

    // ═══════════════════════════════════════════════════════════
    // STACK & QUEUE
    // ═══════════════════════════════════════════════════════════

    // --- "Learning" ---
    // (these are intro topics, keep as-is or move to "General Stack/Queue")

    // --- "Implementation Problems" ---
    'find-the-celebrity': 'Simulation / Backtracking Helper',
    'lru-cache': 'Min Stack Design',
    'lfu-cache': 'Min Stack Design',

    // --- "Prefix, Infix, PostFix Conversion Problems" -> Expression Evaluation
    'next-smaller-element': 'Monotonic Stack',
    'trapping-rain-water': 'Monotonic Stack',
    'sum-of-subarray-ranges': 'Monotonic Stack',

    // --- "General Stack/Queue" (19 problems) ---
    'remove-duplicate-letters': 'Monotonic Stack',
    'removing-stars-from-a-string': 'Valid Parentheses Matching',
    '132-pattern': 'Monotonic Stack',
    'number-of-visible-people-in-a-queue': 'Monotonic Stack',
    'number-of-recent-calls': 'General Stack/Queue',
    'time-needed-to-buy-tickets': 'General Stack/Queue',
    'reveal-cards-in-increasing-order': 'General Stack/Queue',
    'baseball-game': 'General Stack/Queue',
    'make-the-string-great': 'Valid Parentheses Matching',
    'validate-stack-sequences': 'General Stack/Queue',
    'reverse-substrings-between-each-pair-of-parentheses': 'Valid Parentheses Matching',
    'ternary-expression-parser': 'Expression Evaluation (RPN/Infix)',
    'find-permutation': 'Monotonic Stack',
    'max-stack': 'Min Stack Design',
    'minimum-string-length-after-removing-substrings': 'Valid Parentheses Matching',
    'clear-digits': 'Valid Parentheses Matching',
    'flatten-nested-list-iterator': 'General Stack/Queue',
    'robot-collisions': 'General Stack/Queue',
    'number-of-atoms': 'Expression Evaluation (RPN/Infix)',

    // --- "General DP" (in Stack) ---
    'exclusive-time-of-functions': 'General Stack/Queue',
    'number-of-valid-subarrays': 'Monotonic Stack',
    'next-greater-element-iv': 'Monotonic Stack',

    // ═══════════════════════════════════════════════════════════
    // BINARY SEARCH
    // ═══════════════════════════════════════════════════════════

    // --- "General DP" (6 problems) ---
    'the-k-weakest-rows-in-a-matrix': 'On Sorted Array/List',
    'maximum-value-at-a-given-index-in-a-bounded-array': 'On Answer / Condition Function',
    'count-pairs-whose-sum-is-less-than-target': 'On Sorted Array/List',
    'find-minimum-in-rotated-sorted-array-ii': 'Find Min/Max in Rotated Sorted Array',
    'maximum-running-time-of-n-computers': 'On Answer / Condition Function',
    'split-array-into-two-arrays-to-minimize-sum-difference': 'On Answer / Condition Function',

    // ═══════════════════════════════════════════════════════════
    // LINKED LIST
    // ═══════════════════════════════════════════════════════════

    // --- "Medium Problems of LL" ---
    'linked-list-cycle-ii': 'Fast & Slow (Cycle Detection)',
    'length-of-loop': 'Fast & Slow (Cycle Detection)',
    'sort-list': 'Merging Two Sorted Lists',
    'sort-ll-of-0s-1s-and-2s': 'Reordering / Partitioning',

    // --- "Medium Problems of DLL" ---
    'find-pairs-with-given-sum-in-dll': 'General Linked List',
    'remove-duplicates-from-sorted-dll': 'General Linked List',

    // --- "Hard Problems of LL" ---
    'flatten-a-linked-list': 'Merging Two Sorted Lists',

    // --- "General Linked List" ---
    'design-linked-list': 'Design / Specialized Lists',
    'remove-linked-list-elements': 'General Linked List',
    'delete-n-nodes-after-m-nodes-of-a-linked-list': 'General Linked List',
    'insert-into-a-sorted-circular-linked-list': 'General Linked List',
    'find-the-minimum-and-maximum-number-of-nodes-between-critical-points': 'General Linked List',
    'remove-nodes-from-linked-list': 'General Linked List',
    'maximum-twin-sum-of-a-linked-list': 'In-place Reversal',
    'delete-nodes-from-linked-list-present-in-array': 'General Linked List',
    'swapping-nodes-in-a-linked-list': 'General Linked List',
    'design-circular-queue': 'Design / Specialized Lists',
    'split-linked-list-in-parts': 'General Linked List',

    // --- "General DP" (in Linked List) ---
    'reverse-nodes-in-even-length-groups': 'In-place Reversal',

    // ═══════════════════════════════════════════════════════════
    // TREES
    // ═══════════════════════════════════════════════════════════

    // --- "Medium Problems" (Striver) ---
    'boundary-of-binary-tree': 'DFS - Preorder Traversal',
    'vertical-order-traversal-of-a-binary-tree': 'BFS - Level Order Traversal',
    'top-view-of-binary-tree': 'BFS - Level Order Traversal',
    'bottom-view-of-binary-tree': 'BFS - Level Order Traversal',

    // --- "Hard Problems" (Striver) ---
    'maximum-width-of-binary-tree': 'BFS - Level Order Traversal',
    'children-sum-property': 'Properties & Structural DP',
    'amount-of-time-for-binary-tree-to-be-infected': 'BFS - Level Order Traversal',
    'count-complete-tree-nodes': 'Properties & Structural DP',
    'construct-binary-tree-from-inorder-and-postorder-traversal': 'Serialization & Deserialization',

    // --- "Concepts" (BST) ---
    'search-in-a-binary-search-tree': 'BST Properties',

    // --- "Practice Problems" (BST) ---
    'floor-in-bst': 'BST Properties',
    'insert-into-a-binary-search-tree': 'BST Properties',
    'delete-node-in-a-bst': 'BST Properties',
    'construct-binary-search-tree-from-preorder-traversal': 'BST Properties',
    'inorder-successor-in-bst': 'BST Properties',
    'two-sum-iv-input-is-a-bst': 'BST Properties',
    'recover-binary-search-tree': 'BST Properties',
    'maximum-sum-bst-in-binary-tree': 'BST Properties',

    // --- "Problems" (Trie) ---
    'number-of-distinct-substrings': 'Tries',
    'maximum-xor-of-two-numbers-in-an-array': 'Tries',
    'maximum-xor-with-an-element-from-array': 'Tries',

    // --- "Path Problems" ---
    'path-sum-iii': 'Path Problems',
    'path-sum': 'Path Problems',
    'sum-root-to-leaf-numbers': 'Path Problems',

    // --- "DFS - General" (28 problems) ---
    'distribute-coins-in-binary-tree': 'Properties & Structural DP',
    'count-of-smaller-numbers-after-self': 'Segment Tree / BIT',
    'merge-two-binary-trees': 'DFS - Preorder Traversal',
    'leaf-similar-trees': 'DFS - Preorder Traversal',
    'evaluate-boolean-binary-tree': 'DFS - Postorder Traversal',
    'binary-tree-longest-consecutive-sequence': 'Path Problems',
    'binary-tree-longest-consecutive-sequence-ii': 'Path Problems',
    'find-root-of-n-ary-tree': 'DFS - Preorder Traversal',
    'nested-list-weight-sum-ii': 'DFS - Preorder Traversal',
    'encode-n-ary-tree-to-binary-tree': 'Serialization & Deserialization',
    'create-binary-tree-from-descriptions': 'DFS - Preorder Traversal',
    'reverse-odd-levels-of-binary-tree': 'BFS - Level Order Traversal',
    'minimum-number-of-operations-to-sort-a-binary-tree-by-level': 'BFS - Level Order Traversal',
    'kth-largest-sum-in-a-binary-tree': 'BFS - Level Order Traversal',
    'cousins-in-binary-tree-ii': 'BFS - Level Order Traversal',
    'linked-list-in-binary-tree': 'DFS - Preorder Traversal',
    'minimum-time-to-collect-all-apples-in-a-tree': 'DFS - Postorder Traversal',
    'check-completeness-of-a-binary-tree': 'BFS - Level Order Traversal',
    'count-good-nodes-in-binary-tree': 'DFS - Preorder Traversal',
    'number-of-good-leaf-nodes-pairs': 'DFS - Postorder Traversal',
    'flip-equivalent-binary-trees': 'DFS - Preorder Traversal',
    'operations-on-tree': 'DFS - Preorder Traversal',
    'all-possible-full-binary-trees': 'Properties & Structural DP',
    'find-bottom-left-tree-value': 'BFS - Level Order Traversal',
    'validate-binary-tree-nodes': 'DFS - Preorder Traversal',
    'even-odd-tree': 'BFS - Level Order Traversal',
    'delete-leaves-with-a-given-value': 'DFS - Postorder Traversal',
    'step-by-step-directions-from-a-binary-tree-node-to-another': 'Lowest Common Ancestor (LCA)',

    // --- "General DP" (in Trees, 12 problems) ---
    'build-binary-tree-from-preorder-and-inorder-traversal': 'Serialization & Deserialization',
    'sum-of-distances-in-a-tree': 'Properties & Structural DP',
    'connect-all-siblings-of-a-binary-tree': 'BFS - Level Order Traversal',
    'closest-node-to-path-in-tree': 'Lowest Common Ancestor (LCA)',
    'frog-position-after-t-seconds': 'BFS - Level Order Traversal',
    'average-of-levels-in-binary-tree': 'BFS - Level Order Traversal',
    'index-pairs-of-a-string': 'Tries',
    'palindrome-pairs': 'Tries',
    'longest-common-suffix-queries': 'Tries',
    'map-sum-pairs': 'Tries',
    'check-if-a-word-is-a-prefix-of-any-word-in-a-sentence': 'Tries',
    'longest-word-with-all-prefixes': 'Tries',

    // ═══════════════════════════════════════════════════════════
    // HEAP / PRIORITY QUEUE
    // ═══════════════════════════════════════════════════════════

    // --- "Medium Problems" (Striver) ---
    'sort-a-k-sorted-array': 'K-way Merge',
    'rank-transform-of-an-array': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'hand-of-straights': 'Scheduling / Minimum Cost (Greedy with PQ)',

    // --- "Hard Problems" (Striver) ---
    'design-twitter': 'Top K Elements (Selection/Frequency)',
    'minimum-cost-to-connect-sticks': 'Scheduling / Minimum Cost (Greedy with PQ)',

    // --- "General Stack/Queue" (incorrectly named, actually in Heap) ---
    'final-array-state-after-k-multiplication-operations-i': 'General Priority Queue',
    'high-five': 'Top K Elements (Selection/Frequency)',
    'campus-bikes': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'rearrange-string-k-distance-apart': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'least-number-of-unique-integers-after-k-removals': 'Top K Elements (Selection/Frequency)',
    'minimize-deviation-in-array': 'General Priority Queue',
    'maximum-subsequence-score': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'seat-reservation-manager': 'General Priority Queue',
    'find-the-kth-largest-integer-in-the-array': 'Top K Elements (Selection/Frequency)',
    'longest-happy-string': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'car-pooling': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'range-sum-of-sorted-subarray-sums': 'General Priority Queue',
    'maximum-transactions-without-negative-balance': 'General Priority Queue',
    'maximum-performance-of-a-team': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'number-of-flowers-in-full-bloom': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'constrained-subsequence-sum': 'General Priority Queue',
    'find-building-where-alice-and-bob-can-meet': 'General Priority Queue',

    // --- "General DP" (in Heap, 11 problems) ---
    'largest-number-after-digit-swaps-by-parity': 'General Priority Queue',
    'find-right-interval': 'Scheduling / Minimum Cost (Greedy with PQ)',
    'construct-target-array-with-multiple-sums': 'General Priority Queue',
    'kth-smallest-prime-fraction': 'K-way Merge',
    'super-ugly-number': 'K-way Merge',
    'third-maximum-number': 'Top K Elements (Selection/Frequency)',
    'find-subsequence-of-length-k-with-the-largest-sum': 'Top K Elements (Selection/Frequency)',
    'k-maximum-sum-combinations-from-two-arrays': 'K-way Merge',
    'k-empty-slots': 'General Priority Queue',
    'find-the-k-sum-of-an-array': 'K-way Merge',
    'maximum-product-after-k-increments': 'General Priority Queue',

    // ═══════════════════════════════════════════════════════════
    // GRAPHS
    // ═══════════════════════════════════════════════════════════

    // --- "Learning" (Striver) ---
    'cycle-detection-undirected': 'DFS - Connected Components / Island Counting',
    'word-ladder': 'BFS - Connected Components / Island Counting',
    'is-graph-bipartite': 'Bipartite Graph',

    // --- "Topo Sort and Problems" ---
    'topological-sort': 'Topological Sort (Kahn\'s Algorithm)',

    // --- "Shortest Path Algorithms and Problems" ---
    'shortest-path-undirected': 'Shortest Path (Dijkstra\'s Algorithm)',
    'shortest-path-in-dag': 'Shortest Path (Dijkstra\'s Algorithm)',
    'dijkstra-algorithm': 'Shortest Path (Dijkstra\'s Algorithm)',
    'minimum-multiplications-to-reach-end': 'Shortest Path (Bellman-Ford / BFS+K)',
    'bellman-ford': 'Shortest Path (Bellman-Ford / BFS+K)',
    'floyd-warshall': 'Shortest Path (Bellman-Ford / BFS+K)',
    'prims-algorithm': 'Minimum Spanning Tree (Kruskal / Prim)',
    'number-of-operations-to-make-network-connected': 'Union-Find (Disjoint Set Union - DSU)',
    'making-a-large-island': 'Union-Find (Disjoint Set Union - DSU)',

    // --- "General Graph Traversal" (33 problems) ---
    'find-the-town-judge': 'General Graph Traversal',
    'count-servers-that-communicate': 'DFS - Connected Components / Island Counting',
    'find-champion-ii': 'Topological Sort (Kahn\'s Algorithm)',
    'snakes-and-ladders': 'BFS - Connected Components / Island Counting',
    'check-if-move-is-legal': 'DFS - Connected Components / Island Counting',
    'shortest-bridge': 'BFS - Connected Components / Island Counting',
    'find-closest-node-to-given-two-nodes': 'Shortest Path (Dijkstra\'s Algorithm)',
    'as-far-from-land-as-possible': 'BFS - Connected Components / Island Counting',
    'minimum-fuel-cost-to-report-to-the-capital': 'DFS - Connected Components / Island Counting',
    'minimum-number-of-vertices-to-reach-all-nodes': 'Topological Sort (Kahn\'s Algorithm)',
    'count-the-number-of-complete-components': 'Union-Find (Disjoint Set Union - DSU)',
    'shortest-distance-after-road-addition-queries-i': 'BFS - Connected Components / Island Counting',
    'find-the-celebrity': 'General Graph Traversal',
    'kill-process': 'DFS - Connected Components / Island Counting',
    'web-crawler': 'DFS - Connected Components / Island Counting',
    'the-maze': 'DFS - Connected Components / Island Counting',
    'the-maze-ii': 'Shortest Path (Dijkstra\'s Algorithm)',
    'minimum-knight-moves': 'BFS - Connected Components / Island Counting',
    'the-maze-iii': 'Shortest Path (Dijkstra\'s Algorithm)',
    'shortest-distance-from-all-buildings': 'BFS - Connected Components / Island Counting',
    'nested-list-weight-sum': 'DFS - Connected Components / Island Counting',
    'maximum-number-of-k-divisible-components': 'DFS - Connected Components / Island Counting',
    'sliding-puzzle': 'BFS - Connected Components / Island Counting',
    'minimum-number-of-days-to-eat-n-oranges': 'BFS - Connected Components / Island Counting',
    'find-all-people-with-secret': 'Union-Find (Disjoint Set Union - DSU)',
    'trapping-rain-water-ii': 'BFS - Connected Components / Island Counting',
    'minimum-cost-to-convert-string-i': 'Shortest Path (Dijkstra\'s Algorithm)',
    'minimum-cost-walk-in-weighted-graph': 'Union-Find (Disjoint Set Union - DSU)',
    'maximum-employees-to-be-invited-to-a-meeting': 'Topological Sort (Kahn\'s Algorithm)',
    'remove-max-number-of-edges-to-keep-graph-fully-traversable': 'Union-Find (Disjoint Set Union - DSU)',
    'find-minimum-diameter-after-merging-two-trees': 'BFS - Connected Components / Island Counting',
    'greatest-common-divisor-traversal': 'Union-Find (Disjoint Set Union - DSU)',
    'divide-nodes-into-the-maximum-number-of-groups': 'Bipartite Graph',

    // --- "General DP" (in Graphs, 9 problems) ---
    'compilation-order': 'Topological Sort (Kahn\'s Algorithm)',
    'longest-path-with-different-adjacent-characters': 'Topological Sort (Kahn\'s Algorithm)',
    'paths-in-maze-that-lead-to-same-room': 'DFS - Connected Components / Island Counting',
    'find-center-of-star-graph': 'General Graph Traversal',
    'longest-cycle-in-a-graph': 'Cycle Detection (Directed Graph)',
    'shortest-cycle-in-a-graph': 'BFS - Connected Components / Island Counting',
    'last-day-where-you-can-still-cross': 'Union-Find (Disjoint Set Union - DSU)',
    'find-if-path-exists-in-graph': 'DFS - Connected Components / Island Counting',
    'similar-string-groups': 'Union-Find (Disjoint Set Union - DSU)',

    // ═══════════════════════════════════════════════════════════
    // BACKTRACKING
    // ═══════════════════════════════════════════════════════════

    // --- "General Backtracking" (13 problems) ---
    'letter-tile-possibilities': 'Permutations',
    'the-k-th-lexicographical-string-of-all-happy-strings-of-length-n': 'Permutations',
    'matchsticks-to-square': 'Subsets (Include/Exclude)',
    'splitting-a-string-into-descending-consecutive-values': 'Palindrome Partitioning',
    'construct-smallest-number-from-di-string': 'Permutations',
    'find-unique-binary-string': 'Subsets (Include/Exclude)',
    'split-a-string-into-the-max-number-of-unique-substrings': 'Palindrome Partitioning',
    'maximum-length-of-a-concatenated-string-with-unique-characters': 'Subsets (Include/Exclude)',
    'construct-the-lexicographically-largest-valid-sequence': 'N-Queens / Constraint Satisfaction',
    'strobogrammatic-number-ii': 'Permutations',
    'brace-expansion': 'Combination Sum',
    'n-queens-ii': 'N-Queens / Constraint Satisfaction',
    'maximum-score-words-formed-by-letters': 'Subsets (Include/Exclude)',

    // --- "General DP" (in Backtracking, 5 problems) ---
    'letter-case-permutation': 'Subsets (Include/Exclude)',
    'minimum-moves-to-spread-stones-over-grid': 'N-Queens / Constraint Satisfaction',
    'binary-watch': 'Subsets (Include/Exclude)',
    'unique-paths-iii': 'Word Search / Path Finding in Grid',
    'n-queens-b657knjdplj': 'N-Queens / Constraint Satisfaction',

    // ═══════════════════════════════════════════════════════════
    // GREEDY
    // ═══════════════════════════════════════════════════════════

    // --- "Easy Problems" (Striver) ---
    'fractional-knapsack': 'Sorting Based',
    'lemonade-change': 'General Greedy',
    'valid-parenthesis-string': 'General Greedy',
    'n-meetings-in-one-room': 'Interval Merging/Scheduling',
    'minimum-platforms': 'Interval Merging/Scheduling',
    'job-sequencing-problem': 'Task Scheduling (Frequency Based)',
    'shortest-job-first': 'Task Scheduling (Frequency Based)',
    'non-overlapping-intervals': 'Interval Merging/Scheduling',

    // --- "General Greedy" (49 problems → reclassify where suitable) ---
    'minimum-number-of-refueling-stops': 'Jump Game Reachability/Minimization',
    'buy-two-chocolates': 'Sorting Based',
    'minimum-number-of-moves-to-seat-everyone': 'Sorting Based',
    'maximum-odd-binary-number': 'General Greedy',
    'check-if-one-string-swap-can-make-strings-equal': 'General Greedy',
    'minimum-operations-to-make-binary-array-elements-equal-to-one-i': 'General Greedy',
    'buildings-with-an-ocean-view': 'General Greedy',
    'minimum-length-of-string-after-operations': 'General Greedy',
    'construct-k-palindrome-strings': 'General Greedy',
    'minimum-increment-to-make-array-unique': 'Sorting Based',
    'minimum-swaps-to-group-all-1s-together-ii': 'General Greedy',
    'longest-turbulent-subarray': 'General Greedy',
    'minimum-number-of-changes-to-make-binary-string-beautiful': 'General Greedy',
    'minimize-maximum-of-array': 'General Greedy',
    'maximize-ysum-by-picking-a-triplet-of-distinct-xvalues': 'Sorting Based',
    'minimum-difference-between-largest-and-smallest-value-in-three-moves': 'Sorting Based',
    'maximum-total-importance-of-roads': 'Sorting Based',
    'minimum-number-of-pushes-to-type-word-ii': 'Task Scheduling (Frequency Based)',
    'dota2-senate': 'General Greedy',
    'merge-triplets-to-form-target-triplet': 'General Greedy',
    'check-if-a-parentheses-string-can-be-valid': 'General Greedy',
    'eliminate-maximum-number-of-monsters': 'Sorting Based',
    'maximum-length-of-pair-chain': 'Interval Merging/Scheduling',
    'make-lexicographically-smallest-array-by-swapping-elements': 'Sorting Based',
    'minimum-deletions-to-make-character-frequencies-unique': 'Task Scheduling (Frequency Based)',
    'minimum-deletions-to-make-string-balanced': 'General Greedy',
    'remove-colored-pieces-if-both-neighbors-are-the-same-color': 'General Greedy',
    'maximum-score-from-removing-substrings': 'General Greedy',
    'maximum-element-after-decreasing-and-rearranging': 'Sorting Based',
    'number-of-laser-beams-in-a-bank': 'Sorting Based',
    'construct-string-with-repeat-limit': 'Task Scheduling (Frequency Based)',
    'find-valid-matrix-given-row-and-column-sums': 'General Greedy',
    'score-after-flipping-matrix': 'General Greedy',
    'flip-columns-for-maximum-number-of-equal-rows': 'General Greedy',
    'maximum-matrix-sum': 'General Greedy',
    'make-two-arrays-equal-by-reversing-subarrays': 'Sorting Based',
    'shortest-subarray-to-be-removed-to-make-array-sorted': 'General Greedy',
    'max-chunks-to-make-sorted': 'General Greedy',
    'maximum-swap': 'General Greedy',
    'maximal-score-after-applying-k-operations': 'General Greedy',
    'maximum-frequency-after-subarray-operation': 'General Greedy',
    'put-boxes-into-the-warehouse-i': 'Sorting Based',
    'put-marbles-in-bags': 'Sorting Based',
    'minimum-number-of-k-consecutive-bit-flips': 'General Greedy',
    'maximum-score-of-a-good-subarray': 'General Greedy',
    'find-the-maximum-sum-of-node-values': 'General Greedy',
    'minimum-number-of-increments-on-subarrays-to-form-a-target-array': 'General Greedy',
    'apply-operations-to-maximize-score': 'Sorting Based',
    'partition-labels': 'Interval Merging/Scheduling',

    // --- "General DP" (in Greedy, 4 problems) ---
    'largest-palindromic-number': 'General Greedy',
    'number-of-steps-to-reduce-a-binary-number-to-one': 'General Greedy',
    'rearranging-fruits': 'Sorting Based',
    'minimum-replacements-to-sort-the-array': 'General Greedy',

    // ═══════════════════════════════════════════════════════════
    // BIT MANIPULATION
    // ═══════════════════════════════════════════════════════════

    // --- "Interview Problems" (Striver) ---
    'minimum-bit-flips-to-convert-number': 'Counting Set Bits (Hamming Weight)',
    'xor-of-numbers-in-a-given-range': 'Bitwise XOR - Finding Single/Missing Number',
    'single-number-iii': 'Bitwise XOR - Finding Single/Missing Number',

    // --- "Math / Geometry / General" (10 problems) ---
    'shuffle-the-array': 'Bitwise XOR - Finding Single/Missing Number',
    'largest-combination-with-bitwise-and-greater-than-zero': 'Counting Set Bits (Hamming Weight)',
    'shortest-subarray-with-or-at-least-k-ii': 'Bitwise XOR - Finding Single/Missing Number',
    'find-kth-bit-in-nth-binary-string': 'Bitwise XOR - Finding Single/Missing Number',
    'minimum-array-end': 'Bitwise XOR - Finding Single/Missing Number',
    'find-if-array-can-be-sorted': 'Counting Set Bits (Hamming Weight)',
    'longest-subarray-with-maximum-bitwise-and': 'Bitwise XOR - Finding Single/Missing Number',
    'longest-nice-subarray': 'Bitwise XOR - Finding Single/Missing Number',
    'find-the-longest-substring-containing-vowels-in-even-counts': 'Bitwise XOR - Finding Single/Missing Number',
    'ip-to-cidr': 'Bitwise XOR - Finding Single/Missing Number',

    // --- "General DP" (in Bit Manipulation, 5 problems) ---
    'complement-of-base-10-integer': 'Power of Two/Four Check',
    'flipping-an-image': 'Bitwise XOR - Finding Single/Missing Number',
    'find-the-longest-substring-having-vowels-in-even-counts': 'Bitwise XOR - Finding Single/Missing Number',
    'find-the-k-th-lucky-number': 'Bitwise XOR - Finding Single/Missing Number',
    'triples-with-bitwise-and-equal-to-zero': 'Counting Set Bits (Hamming Weight)',

    // ═══════════════════════════════════════════════════════════
    // MATH & GEOMETRY
    // ═══════════════════════════════════════════════════════════

    // --- "Math / Geometry / General" (44 problems) ---
    'reverse-integer': 'Number Theory / Math',
    'valid-square': 'Coordinate Geometry',
    'minimum-area-rectangle-ii': 'Coordinate Geometry',
    'max-points-on-a-line': 'Coordinate Geometry',
    'excel-sheet-column-title': 'Number Theory / Math',
    'greatest-common-divisor-of-strings': 'Number Theory / Math',
    'insert-greatest-common-divisors-in-linked-list': 'Number Theory / Math',
    'count-odd-numbers-in-an-interval-range': 'Number Theory / Math',
    'matrix-diagonal-sum': 'Matrix / Simulation',
    'calculate-money-in-leetcode-bank': 'Number Theory / Math',
    'image-smoother': 'Matrix / Simulation',
    'count-of-matches-in-tournament': 'Number Theory / Math',
    'water-bottles': 'Number Theory / Math',
    'largest-local-values-in-a-matrix': 'Matrix / Simulation',
    'lucky-numbers-in-a-matrix': 'Matrix / Simulation',
    'armstrong-number': 'Number Theory / Math',
    'count-substrings-with-only-one-distinct-letter': 'Number Theory / Math',
    'guess-the-majority-in-a-hidden-array': 'Number Theory / Math',
    'maximum-number-of-ones': 'Number Theory / Math',
    'magic-squares-in-grid': 'Matrix / Simulation',
    'convert-1d-array-into-2d-array': 'Matrix / Simulation',
    'shift-2d-grid': 'Matrix / Simulation',
    'find-the-punishment-number-of-an-integer': 'Number Theory / Math',
    'check-if-number-is-a-sum-of-powers-of-three': 'Number Theory / Math',
    'detect-squares': 'Coordinate Geometry',
    'robot-bounded-in-circle': 'Matrix / Simulation',
    'walking-robot-simulation': 'Matrix / Simulation',
    'rotating-the-box': 'Matrix / Simulation',
    'sum-of-square-numbers': 'Number Theory / Math',
    'find-missing-observations': 'Number Theory / Math',
    'minimum-time-difference': 'Number Theory / Math',
    'minimum-operations-to-make-a-uni-value-grid': 'Number Theory / Math',
    'largest-submatrix-with-rearrangements': 'Matrix / Simulation',
    'widest-vertical-area-between-two-points-containing-no-points': 'Coordinate Geometry',
    'tuple-with-same-product': 'Number Theory / Math',
    'lexicographical-numbers': 'Number Theory / Math',
    'find-the-winner-of-the-circular-game': 'Number Theory / Math',
    'count-total-number-of-colored-cells': 'Number Theory / Math',
    'distribute-candies-among-children-ii': 'Number Theory / Math',
    'line-reflection': 'Coordinate Geometry',
    'minimum-one-bit-operations-to-make-integers-zero': 'Number Theory / Math',
    'k-th-smallest-in-lexicographical-order': 'Number Theory / Math',
    'integer-to-english-words': 'Number Theory / Math',
    'best-meeting-point': 'Coordinate Geometry',

    // --- "General DP" (in Math, 15 problems) ---
    'minimum-area-rectangle': 'Coordinate Geometry',
    'maximum-area-rectangle-with-point-constraints-i': 'Coordinate Geometry',
    'minimum-number-of-lines-to-cover-points': 'Coordinate Geometry',
    'minimize-manhattan-distances': 'Coordinate Geometry',
    'convex-polygon': 'Coordinate Geometry',
    'check-if-it-is-a-straight-line': 'Coordinate Geometry',
    'minimum-cuts-to-divide-a-circle': 'Number Theory / Math',
    'rectangle-overlap': 'Coordinate Geometry',
    'minimum-time-visiting-all-points': 'Coordinate Geometry',
    'rectangle-area': 'Coordinate Geometry',
    'queries-on-number-of-points-inside-a-circle': 'Coordinate Geometry',
    'maximum-number-of-visible-points': 'Coordinate Geometry',
    'self-crossing': 'Coordinate Geometry',
    'erect-the-fence': 'Coordinate Geometry',
    'nth-magical-number': 'Number Theory / Math',

    // ═══════════════════════════════════════════════════════════
    // DESIGN
    // ═══════════════════════════════════════════════════════════

    // --- "General DP" (4 problems) ---
    'range-module': 'Design / Encodings',
    'two-sum-iii-data-structure-design': 'Design / Encodings',
    'stream-of-characters': 'Design / Encodings',
    'all-oone-data-structure': 'Design / Encodings',

    // ═══════════════════════════════════════════════════════════
    // NAME-BASED MAPPINGS (for Striver theory items without LC URLs)
    // ═══════════════════════════════════════════════════════════

    // Arrays & Hashing: Easy/Medium/Hard (Striver theory)
    'Largest Element': 'Simulation / General Array',
    'Second Largest Element': 'Simulation / General Array',
    'Linear Search': 'Simulation / General Array',
    'Union of two sorted arrays': 'Sorting & Intervals',
    'max-consecutive-ones': 'Simulation / General Array',
    'Print subarray with maximum subarray sum (extended version of above problem)': 'Prefix Sums',
    'Hashing In Strings | Theory': 'String Matching (KMP / Z-Function)',

    // Stack & Queue: Learning
    'Implement Stack using Arrays': 'General Stack/Queue',
    'Implement Queue using Arrays': 'General Stack/Queue',
    'implement-stack-using-queues': 'General Stack/Queue',
    'implement-queue-using-stacks': 'General Stack/Queue',
    'Implement stack using Linkedlist': 'General Stack/Queue',
    'Implement queue using Linkedlist': 'General Stack/Queue',

    // Stack & Queue: Implementation Problems
    'Celebrity Problem': 'General Stack/Queue',

    // Stack & Queue: Prefix/Infix/Postfix
    'Infix to Postfix Conversion': 'Expression Evaluation (RPN/Infix)',
    'Prefix to Infix Conversion': 'Expression Evaluation (RPN/Infix)',
    'Prefix to Postfix Conversion': 'Expression Evaluation (RPN/Infix)',
    'Postfix to Prefix Conversion': 'Expression Evaluation (RPN/Infix)',
    'Postfix to Infix Conversion': 'Expression Evaluation (RPN/Infix)',
    'Infix to Prefix Conversion': 'Expression Evaluation (RPN/Infix)',

    // Linked List: Medium Problems of DLL
    'Delete all occurrences of a key in DLL': 'General Linked List',

    // Trees
    'Requirements needed to construct a unique BT': 'Serialization & Deserialization',
    'Introduction to BST': 'BST Properties',
    'Find Min/Max in BST': 'BST Properties',
    'Bit PreRequisites for TRIE Problems': 'Tries',

    // Heap Learning
    'Heaps (Theory Video)': 'General Priority Queue',
    'Implement Min Heap': 'General Priority Queue',
    'Check if an array represents a min heap': 'General Priority Queue',
    'Convert Min Heap to Max Heap': 'General Priority Queue',

    // Graphs Learning
    'Introduction to Graph': 'General Graph Traversal',
    'Graph Representation | C++': 'General Graph Traversal',
    'Graph Representation | Java': 'General Graph Traversal',
    'Connected Components': 'DFS - Connected Components / Island Counting',
    'Traversal Techniques': 'General Graph Traversal',
    'DFS': 'DFS - Connected Components / Island Counting',
    'Topo Sort': 'Topological Sort (Kahn\'s Algorithm)',
    'Why priority Queue is used in Djisktra\'s Algorithm': 'Shortest Path (Dijkstra\'s Algorithm)',
    'MST theory': 'Minimum Spanning Tree (Kruskal / Prim)',
    'Disjoint Set': 'Union-Find (Disjoint Set Union - DSU)',
    'Find the MST weight': 'Minimum Spanning Tree (Kruskal / Prim)',

    // Greedy
    'Program for Least Recently Used (LRU) Page Replacement Algorithm': 'General Greedy',

    // Backtracking
    'Learn All Patterns of Subsequences (Theory)': 'Subsets (Include/Exclude)',

    // Bit Manipulation
    'Introduction to Bits and Tricks': 'Counting Set Bits (Hamming Weight)',
    'Divisors of a Number': 'Counting Set Bits (Hamming Weight)',
    'Prime factorisation of a Number': 'Counting Set Bits (Hamming Weight)',
};

module.exports = PROBLEM_RECLASSIFY;

