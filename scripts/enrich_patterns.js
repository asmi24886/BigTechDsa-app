const fs = require('fs')
const path = require('path')

const MERGED_FILE = path.join(__dirname, '../data/dsa/merged_dsa.json')

// A comprehensive map of LeetCode slugs to alternate patterns
// Based on well-known DSA problem characteristics.
const ALTERNATE_PATTERNS = {
    // Arrays & Hashing
    'two-sum': ['Hash Map', 'Two Pointers (if sorted)'],
    'two-sum-ii-input-array-is-sorted': ['Two Pointers', 'Binary Search'],
    '3sum': ['Two Pointers', 'Hash Map'],
    '4sum': ['Two Pointers', 'Hash Map'],
    'group-anagrams': ['Hash Map', 'Sorting'],
    'top-k-frequent-elements': ['Hash Map', 'Heap', 'Bucket Sort', 'Quick Select'],
    'product-of-array-except-self': ['Prefix Sum'],
    'longest-consecutive-sequence': ['Hash Map', 'Union Find', 'Sorting'],
    'valid-sudoku': ['Hash Map', 'Matrix'],

    // Two Pointers & Sliding Window
    'trapping-rain-water': ['Two Pointers', 'Stack (Monotonic)', 'Dynamic Programming'],
    'container-with-most-water': ['Two Pointers', 'Greedy'],
    'valid-palindrome': ['Two Pointers'],
    'best-time-to-buy-and-sell-stock': ['Sliding Window', 'Dynamic Programming', 'Math'],
    'longest-substring-without-repeating-characters': ['Sliding Window', 'Hash Map'],
    'longest-repeating-character-replacement': ['Sliding Window', 'Hash Map'],
    'minimum-window-substring': ['Sliding Window', 'Hash Map'],
    'sliding-window-maximum': ['Sliding Window', 'Deque', 'Heap'],
    'permutation-in-string': ['Sliding Window', 'Hash Map'],

    // Stack
    'valid-parentheses': ['Stack'],
    'min-stack': ['Stack', 'Design'],
    'evaluate-reverse-polish-notation': ['Stack', 'Math'],
    'generate-parentheses': ['Backtracking', 'Dynamic Programming'],
    'daily-temperatures': ['Stack (Monotonic)', 'Array'],
    'car-fleet': ['Stack', 'Sorting', 'Math'],
    'largest-rectangle-in-histogram': ['Stack (Monotonic)', 'Divide & Conquer', 'Segment Tree'],

    // Binary Search
    'binary-search': ['Binary Search'],
    'search-a-2d-matrix': ['Binary Search', 'Matrix'],
    'koko-eating-bananas': ['Binary Search on Answer', 'Math'],
    'find-minimum-in-rotated-sorted-array': ['Binary Search'],
    'search-in-rotated-sorted-array': ['Binary Search'],
    'time-based-key-value-store': ['Design', 'Hash Map', 'Binary Search'],
    'median-of-two-sorted-arrays': ['Heap', 'Divide & Conquer', 'Two Pointers'],

    // Linked List
    'reverse-linked-list': ['Linked List', 'Recursion'],
    'merge-two-sorted-lists': ['Linked List', 'Recursion'],
    'reorder-list': ['Linked List', 'Two Pointers', 'Stack'],
    'remove-nth-node-from-end-of-list': ['Linked List', 'Two Pointers'],
    'copy-list-with-random-pointer': ['Linked List', 'Hash Map'],
    'add-two-numbers': ['Linked List', 'Math'],
    'linked-list-cycle': ['Linked List', 'Fast & Slow Pointers', 'Hash Map'],
    'find-the-duplicate-number': ['Fast & Slow Pointers', 'Binary Search', 'Bit Manipulation'],
    'lru-cache': ['Design', 'Hash Map', 'Doubly Linked List'],
    'merge-k-sorted-lists': ['Heap', 'Divide & Conquer', 'Linked List'],
    'reverse-nodes-in-k-group': ['Linked List', 'Recursion'],

    // Trees
    'invert-binary-tree': ['Tree', 'DFS', 'BFS'],
    'maximum-depth-of-binary-tree': ['Tree', 'DFS', 'BFS'],
    'diameter-of-binary-tree': ['Tree', 'DFS'],
    'balanced-binary-tree': ['Tree', 'DFS'],
    'same-tree': ['Tree', 'DFS', 'BFS'],
    'subtree-of-another-tree': ['Tree', 'DFS', 'String Matching', 'Hash'],
    'lowest-common-ancestor-of-a-binary-search-tree': ['Tree', 'DFS'],
    'binary-tree-level-order-traversal': ['Tree', 'BFS'],
    'binary-tree-right-side-view': ['Tree', 'BFS', 'DFS'],
    'count-good-nodes-in-binary-tree': ['Tree', 'DFS', 'BFS'],
    'validate-binary-search-tree': ['Tree', 'DFS'],
    'kth-smallest-element-in-a-bst': ['Tree', 'DFS'],
    'construct-binary-tree-from-preorder-and-inorder-traversal': ['Tree', 'DFS', 'Hash Map', 'Divide & Conquer'],
    'binary-tree-maximum-path-sum': ['Tree', 'DFS', 'Dynamic Programming'],
    'serialize-and-deserialize-binary-tree': ['Tree', 'String', 'DFS', 'BFS', 'Design'],

    // Tries
    'implement-trie-prefix-tree': ['Trie', 'Design', 'Hash Map'],
    'design-add-and-search-words-data-structure': ['Trie', 'Design', 'DFS'],
    'word-search-ii': ['Trie', 'Backtracking', 'DFS'],

    // Heap / Priority Queue
    'kth-largest-element-in-a-stream': ['Heap', 'Design'],
    'last-stone-weight': ['Heap', 'Array'],
    'k-closest-points-to-origin': ['Heap', 'Sorting', 'Math', 'Quick Select'],
    'kth-largest-element-in-an-array': ['Heap', 'Quick Select', 'Sorting'],
    'task-scheduler': ['Heap', 'Greedy', 'Hash Map', 'Math'],
    'design-twitter': ['Design', 'Hash Map', 'Heap'],
    'find-median-from-data-stream': ['Heap', 'Design', 'Two Pointers'],

    // Backtracking
    'subsets': ['Backtracking', 'Bit Manipulation'],
    'combination-sum': ['Backtracking', 'Array'],
    'permutations': ['Backtracking'],
    'subsets-ii': ['Backtracking', 'Sorting'],
    'combination-sum-ii': ['Backtracking', 'Sorting'],
    'word-search': ['Backtracking', 'DFS', 'Matrix'],
    'palindrome-partitioning': ['Backtracking', 'Dynamic Programming', 'String'],
    'letter-combinations-of-a-phone-number': ['Backtracking', 'Hash Map', 'String'],
    'n-queens': ['Backtracking', 'Array'],

    // Graphs
    'number-of-islands': ['Graph', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    'max-area-of-island': ['Graph', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    'clone-graph': ['Graph', 'DFS', 'BFS', 'Hash Map'],
    'walls-and-gates': ['Graph', 'BFS', 'Matrix'],
    'rotting-oranges': ['Graph', 'BFS', 'Matrix'],
    'pacific-atlantic-water-flow': ['Graph', 'DFS', 'BFS', 'Matrix'],
    'surrounded-regions': ['Graph', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    'course-schedule': ['Graph', 'Topological Sort', 'DFS', 'BFS'],
    'course-schedule-ii': ['Graph', 'Topological Sort', 'DFS', 'BFS'],
    'redundant-connection': ['Graph', 'Union Find', 'DFS', 'BFS'],
    'number-of-connected-components-in-an-undirected-graph': ['Graph', 'Union Find', 'DFS', 'BFS'],
    'graph-valid-tree': ['Graph', 'Union Find', 'DFS', 'BFS'],
    'word-ladder': ['Graph', 'BFS', 'Hash Map', 'String'],

    // Advanced Graphs
    'reconstruct-itinerary': ['Graph', 'DFS', 'Eulerian Circuit'],
    'min-cost-to-connect-all-points': ['Graph', 'Minimum Spanning Tree', 'Union Find'],
    'network-delay-time': ['Graph', 'Dijkstra', 'Shortest Path'],
    'swim-in-rising-water': ['Graph', 'Binary Search', 'Dijkstra', 'Union Find'],
    'alien-dictionary': ['Graph', 'Topological Sort', 'String'],
    'cheapest-flights-within-k-stops': ['Graph', 'Dijkstra', 'Bellman-Ford', 'Shortest Path'],

    // 1D Dynamic Programming
    'climbing-stairs': ['Dynamic Programming', 'Math'],
    'min-cost-climbing-stairs': ['Dynamic Programming'],
    'house-robber': ['Dynamic Programming'],
    'house-robber-ii': ['Dynamic Programming'],
    'longest-palindromic-substring': ['Dynamic Programming', 'Two Pointers (Expand from Center)', 'String'],
    'palindromic-substrings': ['Dynamic Programming', 'Two Pointers (Expand from Center)', 'String'],
    'decode-ways': ['Dynamic Programming', 'String'],
    'coin-change': ['Dynamic Programming', 'BFS'],
    'maximum-product-subarray': ['Dynamic Programming', 'Array'],
    'word-break': ['Dynamic Programming', 'Trie', 'Hash Map', 'String'],
    'longest-increasing-subsequence': ['Dynamic Programming', 'Binary Search'],
    'partition-equal-subset-sum': ['Dynamic Programming', 'Backtracking'],

    // 2D Dynamic Programming
    'unique-paths': ['Dynamic Programming', 'Math', 'Combinatorics'],
    'longest-common-subsequence': ['Dynamic Programming', 'String'],
    'best-time-to-buy-and-sell-stock-with-cooldown': ['Dynamic Programming', 'State Machine'],
    'coin-change-ii': ['Dynamic Programming'],
    'target-sum': ['Dynamic Programming', 'Backtracking'],
    'interleaving-string': ['Dynamic Programming', 'String'],
    'longest-increasing-path-in-a-matrix': ['Dynamic Programming', 'DFS', 'Graph', 'Topological Sort', 'Matrix'],
    'distinct-subsequences': ['Dynamic Programming', 'String'],
    'edit-distance': ['Dynamic Programming', 'String'],
    'burst-balloons': ['Dynamic Programming', 'Divide & Conquer', 'Array'],
    'regular-expression-matching': ['Dynamic Programming', 'String', 'Recursion'],

    // Greedy
    'maximum-subarray': ['Greedy (Kadane)', 'Dynamic Programming', 'Divide & Conquer'],
    'jump-game': ['Greedy', 'Dynamic Programming'],
    'jump-game-ii': ['Greedy', 'Dynamic Programming', 'BFS'],
    'gas-station': ['Greedy', 'Array'],
    'hand-of-straights': ['Greedy', 'Hash Map', 'Sorting'],
    'merge-triplets-to-form-target-triplet': ['Greedy', 'Array'],
    'partition-labels': ['Greedy', 'Hash Map', 'Two Pointers'],
    'valid-parenthesis-string': ['Greedy', 'Dynamic Programming', 'Stack'],

    // Intervals
    'insert-interval': ['Intervals', 'Array'],
    'merge-intervals': ['Intervals', 'Sorting', 'Array'],
    'non-overlapping-intervals': ['Intervals', 'Greedy', 'Sorting'],
    'meeting-rooms': ['Intervals', 'Sorting'],
    'meeting-rooms-ii': ['Intervals', 'Sorting', 'Heap'],
    'minimum-interval-to-include-each-query': ['Intervals', 'Sorting', 'Heap', 'Binary Search'],

    // Math & Geometry
    'rotate-image': ['Math', 'Matrix'],
    'spiral-matrix': ['Math', 'Matrix', 'Simulation'],
    'set-matrix-zeroes': ['Math', 'Matrix', 'Hash Map'],
    'happy-number': ['Math', 'Hash Map', 'Fast & Slow Pointers'],
    'plus-one': ['Math', 'Array'],
    'powx-n': ['Math', 'Divide & Conquer'],
    'multiply-strings': ['Math', 'String', 'Simulation'],
    'detect-squares': ['Design', 'Hash Map', 'Math'],

    // Bit Manipulation
    'single-number': ['Bit Manipulation', 'Hash Map', 'Math'],
    'number-of-1-bits': ['Bit Manipulation', 'Math'],
    'counting-bits': ['Bit Manipulation', 'Dynamic Programming'],
    'reverse-bits': ['Bit Manipulation', 'Divide & Conquer'],
    'missing-number': ['Bit Manipulation', 'Math', 'Hash Map', 'Sorting'],
    'sum-of-two-integers': ['Bit Manipulation', 'Math'],
    'reverse-integer': ['Math']
}

function enrichPatterns() {
    if (!fs.existsSync(MERGED_FILE)) {
        console.error(`File not found: ${MERGED_FILE}`)
        process.exit(1)
    }

    const data = JSON.parse(fs.readFileSync(MERGED_FILE, 'utf-8'))
    let totalProblems = 0
    let enrichedCount = 0

    for (const cat in data) {
        for (const sub in data[cat]) {
            const problems = data[cat][sub]
            for (const p of problems) {
                totalProblems++
                p.alternatePatterns = [] // Initialize

                // Extract sluggish name from LC URL
                if (p.leetcodeUrl) {
                    const match = p.leetcodeUrl.match(/problems\/([^\/]+)/)
                    if (match && match[1]) {
                        const slug = match[1]
                        if (ALTERNATE_PATTERNS[slug]) {
                            // Filter out patterns that are intrinsically part of the current category/subcategory
                            const catLower = cat.toLowerCase()
                            const subLower = sub.toLowerCase()

                            p.alternatePatterns = ALTERNATE_PATTERNS[slug].filter(pat => {
                                const patLower = pat.toLowerCase()
                                // E.g., if pat is 'Binary Search' and cat is 'Binary Search', exclude it.
                                // Or if pat is 'Prefix Sum' and sub is 'Prefix Sums', exclude it.
                                return !(catLower.includes(patLower) || patLower.includes(catLower) ||
                                    subLower.includes(patLower) || patLower.includes(subLower))
                            })

                            if (p.alternatePatterns.length > 0) {
                                enrichedCount++
                            } else {
                                // If all patterns were filtered out, remove the array to keep json clean
                                delete p.alternatePatterns
                            }
                        }
                    }
                }
            }
        }
    }

    fs.writeFileSync(MERGED_FILE, JSON.stringify(data, null, 2))
    console.log(`\n=== Alternate Patterns Enrichment Complete ===`)
    console.log(`Total problems: ${totalProblems}`)
    console.log(`Problems enriched with alternate patterns: ${enrichedCount} (${((enrichedCount / totalProblems) * 100).toFixed(1)}%)`)
}

enrichPatterns()
