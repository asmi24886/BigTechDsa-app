const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('striver.html', 'utf-8');
const $ = cheerio.load(html);

const data = {};
let currentCategory = "General";
let currentSubCategory = "General";
let totalCount = 0;
let withLeetcode = 0;
let constructedLeetcode = 0;
let noLeetcode = 0;

// Comprehensive map of Striver problem names to LeetCode slugs 
// (for problems that don't have a LeetCode link in the HTML)
const NAME_TO_SLUG = {
    // Sorting
    "Selection Sort": null,
    "Bubble Sort": null,
    "Insertion Sorting": null,
    "Merge Sorting": null,
    "Recursive Bubble Sort": null,
    "Recursive Insertion Sort": null,
    "Quick Sorting": null,

    // Arrays Easy
    "Largest Element": null,
    "Second Largest Element": null,
    "Check if the Array is Sorted II": "check-if-array-is-sorted-and-rotated",
    "Remove duplicates from Sorted array": "remove-duplicates-from-sorted-array",
    "Left Rotate Array by One": "rotate-array",
    "Left Rotate Array by K Places": "rotate-array",
    "Move Zeros to End": "move-zeroes",
    "Linear Search": null,
    "Union of two sorted arrays": null,
    "Find missing number": "missing-number",
    "Maximum Consecutive Ones": "max-consecutive-ones",
    "Find the number that appears once, and other numbers twice.": "single-number",
    "Longest subarray with given sum K(positives)": "longest-subarray-with-sum-k",
    "Longest subarray with sum K": "longest-subarray-with-sum-k",

    // Arrays Medium
    "Two Sum": "two-sum",
    "Sort an array of 0's 1's and 2's": "sort-colors",
    "Majority Element-I": "majority-element",
    "Maximum subarray sum (Kadane's algorithm)": "maximum-subarray",
    "Stock Buy and Sell": "best-time-to-buy-and-sell-stock",
    "Rearrange elements by Sign": "rearrange-array-elements-by-sign",
    "Next permutation": "next-permutation",
    "Leaders in an Array": "leaders-in-an-array",
    "Longest Consecutive Sequence": "longest-consecutive-sequence",
    "Set Matrix Zeroes": "set-matrix-zeroes",
    "Rotate Image by 90 degree": "rotate-image",
    "Print the matrix in Spiral manner": "spiral-matrix",
    "Count subarray sum equals K": "subarray-sum-equals-k",
    "Pascal's Triangle": "pascals-triangle",

    // Arrays Hard
    "3 Sum": "3sum",
    "4 Sum": "4sum",
    "Largest Subarray with 0 Sum": "largest-subarray-with-0-sum",
    "Count number of subarrays with given xor K": "count-number-of-subarrays-with-given-xor-k",
    "Merge Overlapping Subintervals": "merge-intervals",
    "Merge two sorted arrays without extra space": "merge-sorted-array",
    "Find the repeating and missing number": "find-the-repeating-and-missing-number",
    "Count Inversions": "count-inversions",
    "Reverse Pairs": "reverse-pairs",
    "Maximum Product Subarray": "maximum-product-subarray",

    // Binary Search
    "Binary Search to find X in sorted array": "binary-search",
    "Implement Lower Bound": "search-insert-position",
    "Implement Upper Bound": "search-insert-position",
    "Search Insert Position": "search-insert-position",
    "Floor/Ceil in Sorted Array": "search-insert-position",
    "Find the first or last occurrence of a given number in a sorted array": "find-first-and-last-position-of-element-in-sorted-array",
    "Count occurrences of a number in a sorted array with duplicates": "find-first-and-last-position-of-element-in-sorted-array",
    "Search in Rotated Sorted Array I": "search-in-rotated-sorted-array",
    "Search in Rotated Sorted Array II": "search-in-rotated-sorted-array-ii",
    "Find minimum in Rotated Sorted Array": "find-minimum-in-rotated-sorted-array",
    "Find out how many times has an array been rotated": null,
    "Single element in a Sorted Array": "single-element-in-a-sorted-array",
    "Find peak element": "find-peak-element",
    "Square root of a number": "sqrtx",
    "Find the Nth root of a number": "nth-root-of-a-number",
    "Koko Eating Bananas": "koko-eating-bananas",
    "Minimum days to make M bouquets": "minimum-number-of-days-to-make-m-bouquets",
    "Find the smallest Divisor Given a Threshold": "find-the-smallest-divisor-given-a-threshold",
    "Capacity to Ship Packages within D Days": "capacity-to-ship-packages-within-d-days",
    "Aggressive Cows": "magnetic-force-between-two-balls",
    "Allocate Minimum Number of Pages": "split-array-largest-sum",
    "Split Array – Largest Sum": "split-array-largest-sum",
    "Painter's Partition": "split-array-largest-sum",
    "Minimize Max Distance to Gas Station": "minimize-max-distance-to-gas-station",
    "Median of 2 Sorted Arrays": "median-of-two-sorted-arrays",
    "Kth element of 2 sorted arrays": "kth-element-of-two-sorted-arrays",
    "Find the row with maximum number of 1's": "find-the-row-with-maximum-number-of-1s",
    "Search in a 2D Matrix": "search-a-2d-matrix",
    "Search in a row and column wise sorted matrix": "search-a-2d-matrix-ii",
    "Find Peak Element (2D Matrix)": "find-a-peak-element-ii",
    "Matrix Median": "matrix-median",

    // Strings
    "Remove outermost Parentheses": "remove-outermost-parentheses",
    "Reverse Words in a String": "reverse-words-in-a-string",
    "Largest Odd Number in String": "largest-odd-number-in-string",
    "Longest Common Prefix": "longest-common-prefix",
    "Isomorphic Strings": "isomorphic-strings",
    "Check whether one string is a rotation of another": "rotate-string",
    "Check if two strings are anagram of each other": "valid-anagram",
    "Sort Characters by Frequency": "sort-characters-by-frequency",
    "Maximum Nesting Depth of the Parentheses": "maximum-nesting-depth-of-the-parentheses",
    "Roman To Integer": "roman-to-integer",
    "Integer to Roman": "integer-to-roman",
    "Atoi": "string-to-integer-atoi",
    "Count Number of Substrings": "count-number-of-substrings",
    "Longest Palindromic Substring": "longest-palindromic-substring",
    "Sum of Beauty of All Substrings": "sum-of-beauty-of-all-substrings",
    "Reverse Every Word in A String": "reverse-words-in-a-string",

    // Linked List
    "Introduction to LinkedList": null,
    "Inserting a node in LinkedList": null,
    "Deleting a node in LinkedList": null,
    "Length of LinkedList": null,
    "Search an element in a Linked List": null,
    "Introduction to DLL": null,
    "Insert a node in DLL": null,
    "Delete a node in DLL": null,
    "Reverse a DLL": null,
    "Delete the Middle Node of a Linked List": "delete-the-middle-node-of-a-linked-list",
    "Reverse a LinkedList [Iterative]": "reverse-linked-list",
    "Reverse a LinkedList [Recursive]": "reverse-linked-list",
    "Detect a loop in LL": "linked-list-cycle",
    "Find the starting point in LL": "linked-list-cycle-ii",
    "Length of loop": "length-of-loop",
    "Check if LL is palindrome or not": "palindrome-linked-list",
    "Segregate odd and even nodes in LL": "odd-even-linked-list",
    "Remove Nth node from the back of the LL": "remove-nth-node-from-end-of-list",
    "Delete middle node of LL": "delete-the-middle-node-of-a-linked-list",
    "Sort LL": "sort-list",
    "Sort LL of 0's 1's and 2's": "sort-ll-of-0s-1s-and-2s",
    "Find the intersection point of Y LL": "intersection-of-two-linked-lists",
    "Add 1 to a number represented by LL": "plus-one-linked-list",
    "Add 2 numbers in LL": "add-two-numbers",
    "Delete all occurrences of a key in DLL": null,
    "Find pairs with given sum in DLL": null,
    "Remove duplicates from sorted DLL": null,
    "Reverse LL in group of given size K": "reverse-nodes-in-k-group",
    "Rotate a LL": "rotate-list",
    "Flattening of LL": "flatten-a-linked-list",
    "Clone a Linked List with random and next pointer": "copy-list-with-random-pointer",

    // Recursion / Backtracking
    "Recursion on Subsequences": null,
    "Merge Sort": null,
    "Quick Sort": null,
    "Print all Subsequences": null,
    "Count Subsequences with sum K": null,
    "Check if there exists a subsequence with sum K": null,
    "Combination Sum": "combination-sum",
    "Combination Sum-II": "combination-sum-ii",
    "Subset Sum-I": "subsets",
    "Subset Sum-II": "subsets-ii",
    "Combination Sum III": "combination-sum-iii",
    "Letter Combinations of a Phone": "letter-combinations-of-a-phone-number",
    "Generate all binary strings": null,
    "Generate Parentheses": "generate-parentheses",
    "Print all Permutations of a String/Array": "permutations",
    "N Queens": "n-queens",
    "Sudoku Solver": "sudoku-solver",
    "M Coloring Problem": "m-coloring-problem",
    "Rat in a Maze": "rat-in-a-maze",
    "Word Search": "word-search",
    "Palindrome Partitioning": "palindrome-partitioning",
    "Word Break": "word-break",
    "Expression Add Operators": "expression-add-operators",

    // Stacks & Queues
    "Implement Stack Using Arrays": null,
    "Implement Queue Using Arrays": null,
    "Implement Stack using Queue": "implement-stack-using-queues",
    "Implement Queue using Stack": "implement-queue-using-stacks",
    "Implement Stack using Linked List": null,
    "Implement Queue using Linked List": null,
    "Check for Balanced Parentheses": "valid-parentheses",
    "Implement Min Stack": "min-stack",
    "Infix to Postfix Conversion": null,
    "Prefix to Infix Conversion": null,
    "Prefix to Postfix Conversion": null,
    "Postfix to Prefix Conversion": null,
    "Postfix to Infix Conversion": null,
    "Infix to Prefix Conversion": null,
    "Next Greater Element-I": "next-greater-element-i",
    "Next Greater Element-II": "next-greater-element-ii",
    "Next Smaller Element": null,
    "Number of NGE's to the right": null,
    "Trapping Rain Water": "trapping-rain-water",
    "Sum of subarray minimums": "sum-of-subarray-minimums",
    "Asteroid Collision": "asteroid-collision",
    "Sum of subarray ranges": "sum-of-subarray-ranges",
    "Remove K Digits": "remove-k-digits",
    "Largest Rectangle in a Histogram": "largest-rectangle-in-histogram",
    "Maximal Rectangle": "maximal-rectangle",
    "Sliding Window Maximum": "sliding-window-maximum",
    "Stock span problem": "online-stock-span",
    "The Celebrity Problem": "the-celebrity-problem",
    "Implement LRU Cache": "lru-cache",
    "Implement LFU Cache": "lfu-cache",

    // Trees
    "Introduction to Trees": null,
    "Introduction to Binary Tree": null,
    "Binary Tree Traversals in Binary Tree": null,
    "Preorder Traversal of Binary Tree": "binary-tree-preorder-traversal",
    "Inorder Traversal of Binary Tree": "binary-tree-inorder-traversal",
    "Post-order Traversal of Binary Tree": "binary-tree-postorder-traversal",
    "Level order Traversal /  Level order traversal in spiral form": "binary-tree-level-order-traversal",
    "Iterative Preorder Traversal of Binary Tree": "binary-tree-preorder-traversal",
    "Iterative Inorder Traversal of Binary Tree": "binary-tree-inorder-traversal",
    "Post-order Traversal of Binary Tree using 2 stacks": "binary-tree-postorder-traversal",
    "Post-order Traversal of Binary Tree using 1 stack": "binary-tree-postorder-traversal",
    "All Traversals in One Traversal": null,
    "Height of a Binary Tree": "maximum-depth-of-binary-tree",
    "Check if the Binary tree is height-balanced or not": "balanced-binary-tree",
    "Diameter of Binary Tree": "diameter-of-binary-tree",
    "Maximum path sum": "binary-tree-maximum-path-sum",
    "Check if two trees are identical or not": "same-tree",
    "Zig Zag Traversal Of Binary Tree": "binary-tree-zigzag-level-order-traversal",
    "Boundary Traversal of Binary Tree": null,
    "Vertical Order Traversal of Binary Tree": "vertical-order-traversal-of-a-binary-tree",
    "Top View of Binary Tree": null,
    "Bottom View of Binary Tree": null,
    "Right/Left view of Binary Tree": "binary-tree-right-side-view",
    "Symmetric Binary Tree": "symmetric-tree",
    "Root to Node path in Binary Tree": null,
    "Lowest Common Ancestor for two given Nodes": "lowest-common-ancestor-of-a-binary-tree",
    "Maximum Width of Binary Tree": "maximum-width-of-binary-tree",
    "Check for Children Sum Property": null,
    "Print Nodes at Distance K in a Binary Tree": "all-nodes-distance-k-in-binary-tree",
    "Minimum time taken to BURN the Binary Tree from a Node": null,
    "Count total Nodes in a Complete Binary Tree": "count-complete-tree-nodes",
    "Requirements needed to construct a Unique Binary Tree | Theory": null,
    "Construct Binary Tree from Inorder and Preorder": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "Construct Binary Tree From Inorder and Postorder": "construct-binary-tree-from-inorder-and-postorder-traversal",
    "Serialize and Deserialize Binary Tree": "serialize-and-deserialize-binary-tree",
    "Morris Preorder Traversal of a Binary Tree": "binary-tree-preorder-traversal",
    "Morris Inorder Traversal of a Binary Tree": "binary-tree-inorder-traversal",
    "Flatten Binary Tree to Linked List": "flatten-binary-tree-to-linked-list",

    // BST
    "Introduction to Binary Search Tree": null,
    "Search in a BST": "search-in-a-binary-search-tree",
    "Find Min/Max in BST": null,
    "Ceil in a BST": null,
    "Floor in a BST": null,
    "Insert a given Node in Binary Search Tree": "insert-into-a-binary-search-tree",
    "Delete Node in BST": "delete-node-in-a-bst",
    "Find Kth Smallest/Largest element in BST": "kth-smallest-element-in-a-bst",
    "Check if a tree is a BST or BT": "validate-binary-search-tree",
    "LCA in Binary Search Tree": "lowest-common-ancestor-of-a-binary-search-tree",
    "Construct a BST from a preorder traversal": "construct-binary-search-tree-from-preorder-traversal",
    "Inorder Successor/Predecessor in BST": "inorder-successor-in-bst",
    "Binary Search Tree iterator": "binary-search-tree-iterator",
    "Two Sum In BST": "two-sum-iv-input-is-a-bst",
    "Recover BST": "recover-binary-search-tree",
    "Largest BST in Binary Tree": "largest-bst-in-binary-tree",

    // Graphs
    "Introduction to Graph": null,
    "BFS": null,
    "DFS": null,
    "Number of provinces": "number-of-provinces",
    "Number of Islands": "number-of-islands",
    "Flood Fill": "flood-fill",
    "Rotten Oranges": "rotting-oranges",
    "Detect a Cycle in an Undirected Graph (BFS)": null,
    "Detect a Cycle in an Undirected Graph (DFS)": null,
    "0/1 Matrix (BFS)": "01-matrix",
    "Surrounded Regions": "surrounded-regions",
    "Number of Enclaves": "number-of-enclaves",
    "Number of Distinct Islands": "number-of-distinct-islands",
    "Bipartite Graph (BFS)": "is-graph-bipartite",
    "Bipartite Graph (DFS)": "is-graph-bipartite",
    "Detect cycle in a directed graph (DFS)": null,
    "Topological Sort (DFS)": null,
    "Kahn's Algorithm (BFS)": null,
    "Detect a Cycle in Directed Graph (BFS)": null,
    "Course Schedule I and II": "course-schedule",
    "Find Eventual Safe States (BFS)": "find-eventual-safe-states",
    "Find Eventual Safe States (DFS)": "find-eventual-safe-states",
    "Alien Dictionary": "alien-dictionary",
    "Shortest path in DAG": null,
    "Shortest Path in Undirected Graph with unit weights": null,
    "Word Ladder-I": "word-ladder",
    "Word Ladder - II": "word-ladder-ii",
    "Dijkstra's Algorithm": null,
    "Print Shortest Path": null,
    "Shortest Distance in a Binary Maze": "shortest-path-in-binary-matrix",
    "Path with Minimum Effort": "path-with-minimum-effort",
    "Cheapest Flights Within K Stops": "cheapest-flights-within-k-stops",
    "Network Delay Time": "network-delay-time",
    "Number of Ways to Arrive at Destination": "number-of-ways-to-arrive-at-destination",
    "Minimum Multiplications to reach End": "minimum-multiplications-to-reach-end",
    "Bellman Ford Algorithm": null,
    "Floyd Warshall Algorithm": null,
    "Find the City With the Smallest Number of Neighbours at a Threshold Distance": "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
    "Minimum Spanning Tree": null,
    "Prim's Algorithm": null,
    "Disjoint Set [Union by Rank]": null,
    "Disjoint Set [Union by Size]": null,
    "Kruskal's Algorithm": null,
    "Number of Operations to Make Network Connected": "number-of-operations-to-make-network-connected",
    "Most Stones Removed with Same Row or Column": "most-stones-removed-with-same-row-or-column",
    "Accounts Merge": "accounts-merge",
    "Number of Islands - II – Online Queries": "number-of-islands-ii",
    "Making a Large Island": "making-a-large-island",
    "Swim in Rising Water": "swim-in-rising-water",
    "Bridges in Graph": "critical-connections-in-a-network",
    "Articulation Point": null,
    "Strongly Connected Components": null,

    // Dynamic Programming
    "Climbing Stairs": "climbing-stairs",
    "Frog Jump": "frog-jump",
    "Frog Jump with k distances": "frog-jump",
    "Maximum sum of non-adjacent elements": "house-robber",
    "House Robber II": "house-robber-ii",
    "Ninja's Training": null,
    "Grid Unique Paths": "unique-paths",
    "Grid Unique Paths 2": "unique-paths-ii",
    "Minimum Path Sum in Grid": "minimum-path-sum",
    "Minimum path sum in Triangular Grid": "triangle",
    "Minimum/Maximum Falling Path Sum": "minimum-falling-path-sum",
    "Chocolate Pickup | 3D DP": "cherry-pickup-ii",
    "Subset sum equal to target": "partition-equal-subset-sum",
    "Partition Equal Subset Sum": "partition-equal-subset-sum",
    "Partition Set Into 2 Subsets With Min Absolute Sum Diff": "last-stone-weight-ii",
    "Count Subsets with Sum K": "count-subsets-with-sum-k",
    "Count Partitions with Given Difference": "target-sum",
    "0/1 Knapsack": null,
    "Assign Cookies": "assign-cookies",
    "Minimum Coins": "coin-change",
    "Target Sum": "target-sum",
    "Coin Change 2": "coin-change-ii",
    "Unbounded Knapsack": "unbounded-knapsack",
    "Rod Cutting Problem": "rod-cutting",
    "Longest Common Subsequence": "longest-common-subsequence",
    "Print Longest Common Subsequence": "longest-common-subsequence",
    "Longest Common Substring": "maximum-length-of-repeated-subarray",
    "Longest Palindromic Subsequence": "longest-palindromic-subsequence",
    "Minimum insertions to make string palindrome": "minimum-insertion-steps-to-make-a-string-palindrome",
    "Minimum Insertions/Deletions to Convert String": "delete-operation-for-two-strings",
    "Shortest Common Supersequence": "shortest-common-supersequence",
    "Distinct Subsequences": "distinct-subsequences",
    "Edit Distance": "edit-distance",
    "Wildcard Matching": "wildcard-matching",
    "Best Time to Buy and Sell Stock": "best-time-to-buy-and-sell-stock",
    "Buy and Sell Stock – II": "best-time-to-buy-and-sell-stock-ii",
    "Buy and Sell Stocks III": "best-time-to-buy-and-sell-stock-iii",
    "Buy and Stock Sell IV": "best-time-to-buy-and-sell-stock-iv",
    "Buy and Sell Stock with Cooldown": "best-time-to-buy-and-sell-stock-with-cooldown",
    "Buy and sell stocks with transaction fee": "best-time-to-buy-and-sell-stock-with-transaction-fee",
    "Longest Increasing Subsequence": "longest-increasing-subsequence",
    "Print Longest Increasing Subsequence": "longest-increasing-subsequence",
    "Longest Increasing Subsequence using Binary Search": "longest-increasing-subsequence",
    "Largest Divisible Subset": "largest-divisible-subset",
    "Longest String Chain": "longest-string-chain",
    "Longest Bitonic Subsequence": "longest-bitonic-subsequence",
    "Number of Longest Increasing Subsequences": "number-of-longest-increasing-subsequence",
    "Matrix Chain Multiplication": "matrix-chain-multiplication",
    "Minimum Cost to Cut the stick": "minimum-cost-to-cut-a-stick",
    "Burst Balloons": "burst-balloons",
    "Evaluate Boolean Expression to True": "parsing-a-boolean-expression",
    "Palindrome Partitioning-II": "palindrome-partitioning-ii",
    "Partition Array for Maximum Sum": "partition-array-for-maximum-sum",
    "Maximum Rectangle Area with all 1's": "maximal-rectangle",
    "Count Square Submatrices with All Ones": "count-square-submatrices-with-all-ones",

    // Greedy
    "Assign Cookies": "assign-cookies",
    "Fractional Knapsack": null,
    "Greedy algorithm to find minimum number of coins": "coin-change",
    "Lemonade Change": "lemonade-change",
    "Valid Parenthesis String": "valid-parenthesis-string",
    "N meetings in one room": "n-meetings-in-one-room",
    "Jump Game": "jump-game",
    "Jump Game II": "jump-game-ii",
    "Minimum number of platforms required for a railway": "minimum-platforms",
    "Job sequencing Problem": "job-sequencing-problem",
    "Candy": "candy",
    "Insert Interval": "insert-interval",
    "Merge Interval": "merge-intervals",
    "Non-overlapping Intervals": "non-overlapping-intervals",

    // Bit Manipulation
    "Introduction to Bit Manipulation": null,
    "Check if the i-th bit is set or not": null,
    "Check if a number is odd or not": null,
    "Check if a number is a power of 2": "power-of-two",
    "Count the number of set bits": "number-of-1-bits",
    "Set/Unset the rightmost set bit of a number": null,
    "Swap two numbers": null,
    "Divide Two Integers": "divide-two-integers",
    "Count number of bits to be flipped to convert A to B": "minimum-bit-flips-to-convert-number",
    "Find the number that appears odd number of times": "single-number",
    "Power Set": "subsets",
    "Single Number-II": "single-number-ii",
    "Single Number-III": "single-number-iii",
    "XOR of Numbers in a given range": "xor-of-numbers-in-a-given-range",
    "Two numbers with odd occurrences": "two-numbers-with-odd-occurrences",

    // Heaps
    "Introduction to Priority Queues": null,
    "Min Heap and Max Heap Implementation": null,
    "Check if an array represents Heap": null,
    "Convert min Heap to max Heap": null,
    "Kth Largest Element in an Array": "kth-largest-element-in-an-array",
    "Kth Smallest Element": "kth-smallest-element-in-a-sorted-matrix",
    "Sort a K sorted array": "sort-a-k-sorted-array",
    "Merge M sorted Lists": "merge-k-sorted-lists",
    "Replace each array element by its corresponding rank": "rank-transform-of-an-array",
    "Task Scheduler": "task-scheduler",
    "Hands of Straights / Group Cards": "hand-of-straights",
    "Design Twitter": "design-twitter",
    "Connect n ropes with minimum cost": "minimum-cost-to-connect-sticks",
    "Kth Largest Element in a Stream": "kth-largest-element-in-a-stream",
    "Maximum Sum Combination": "find-k-pairs-with-smallest-sums",
    "Find Median from Data Stream": "find-median-from-data-stream",
    "K Most Frequent Elements": "top-k-frequent-elements",

    // Tries
    "Implement TRIE | INSERT | SEARCH | STARTSWITH": "implement-trie-prefix-tree",
    "Implement Trie - II (Prefix Tree)": null,
    "Longest String with All Prefixes": null,
    "Number of Distinct Substrings in a String": null,
    "Power Set (this is an only C++ problem)": "subsets",
    "Count Distinct Substrings": null,
    "Maximum XOR of two numbers in an array": "maximum-xor-of-two-numbers-in-an-array",
    "Maximum XOR With an Element From Array": "maximum-xor-with-an-element-from-array",

    // Additional exact-match names from the HTML
    "Largest Subarray with Sum 0": "largest-subarray-with-0-sum",
    "Count subarrays with given xor K": "count-number-of-subarrays-with-given-xor-k",
    "Lower Bound": "search-insert-position",
    "Upper Bound": "search-insert-position",
    "Floor and Ceil in Sorted Array": "search-insert-position",
    "Count Occurrences in a Sorted Array": "find-first-and-last-position-of-element-in-sorted-array",
    "Find out how many times the array is rotated": "find-minimum-in-rotated-sorted-array",
    "Find square root of a number": "sqrtx",
    "Find Nth root of a number": "nth-root-of-a-number",
    "Book Allocation Problem": "split-array-largest-sum",
    "Find row with maximum 1's": "find-the-row-with-maximum-number-of-1s",

    // Linked List exact HTML names
    "Length of loop in LL": "length-of-loop",
    "Sort a Linked List of 0's 1's and 2's": "sort-ll-of-0s-1s-and-2s",
    "Add one to a number represented by LL": "plus-one-linked-list",
    "Find Pairs with Given Sum in Doubly Linked List": "find-pairs-with-given-sum-in-dll",
    "Remove duplicated from sorted DLL": "remove-duplicates-from-sorted-dll",
    "Reverse a Doubly Linked List": "reverse-linked-list",

    // Backtracking exact HTML names
    "Subsets I": "subsets",
    "Palindrome partitioning": "palindrome-partitioning",
    "Generate Binary Strings Without Consecutive 1s": "generate-binary-strings-without-adjacent-zeros",
    "Sort a stack using recursion": "sort-a-stack-using-recursion",
    "Reverse a Stack": "reverse-a-stack",
    "Count all subsequences with sum K": "count-subsets-with-sum-k",
    "Check if there exists a subsequence with sum K": "partition-equal-subset-sum",

    // Bit Manipulation exact HTML names
    "Count the Number of Set Bits": "number-of-1-bits",
    "Check if the i-th bit is Set or Not": "check-ith-bit",
    "Check if a Number is Odd or Not": "check-number-odd",
    "XOR of numbers in a given range": "xor-of-numbers-in-a-given-range",
    "Single Number - III": "single-number-iii",
    "Swap Two Numbers": "swap-two-numbers",
    "Print Prime Factors of a Number": "prime-factors",
    "Set/Unset the rightmost unset bit": "set-rightmost-unset-bit",

    // Stacks exact HTML names
    "Next Smaller Element": "next-smaller-element",
    "Number of Greater Elements to the Right": "next-greater-element-i",
    "LRU Cache": "lru-cache",

    // Sliding Window
    "Fruit Into Baskets": "fruit-into-baskets",

    // Heaps exact HTML names
    "K-th Largest element in an array": "kth-largest-element-in-an-array",
    "Kth smallest element in an array [use priority queue]": "kth-smallest-element-in-a-sorted-matrix",
    "Sort K sorted array": "sort-a-k-sorted-array",
    "Replace Elements by Their Rank": "rank-transform-of-an-array",
    "Minimum Cost to Connect Sticks": "minimum-cost-to-connect-sticks",
    "Maximum Sum Combination": "find-k-pairs-with-smallest-sums",

    // Greedy exact HTML names
    "Fractional Knapsack": "fractional-knapsack",
    "Shortest Job First": "shortest-job-first",

    // Trees exact HTML names
    "Top View of BT": "top-view-of-binary-tree",
    "Bottom view of BT": "bottom-view-of-binary-tree",
    "Print root to leaf path in BT": "binary-tree-paths",
    "Children Sum Property in Binary Tree": "children-sum-property",
    "Minimum time taken to burn the BT from a given Node": "amount-of-time-for-binary-tree-to-be-infected",
    "Floor and Ceil in a BST": "floor-in-bst",
    "Floor in a Binary Search Tree": "floor-in-bst",

    // Graphs exact HTML names
    "Connected Components Problem in Matrix": "number-of-islands",
    "Cycle Detection in Undirected Graph (bfs)": "cycle-detection-undirected",
    "Topo Sort": "topological-sort",
    "Topological sort or Kahn's algorithm": "topological-sort",
    "Shortest path in undirected graph with unit weights": "shortest-path-undirected",
    "Shortest path in DAG": "shortest-path-in-dag",
    "Djisktra's Algorithm": "dijkstra-algorithm",
    "Minimum multiplications to reach end": "minimum-multiplications-to-reach-end",
    "Bellman Ford Algorithm": "bellman-ford",
    "Floyd warshall algorithm": "floyd-warshall",
    "Prim's Algorithm": "prims-algorithm",
    "Articulation point in graph": "articulation-point",

    // DP exact HTML names
    "Frog jump with K distances": "frog-jump",
    "Ninja's training": "ninjas-training",
    "Ninja and his Friends": "cherry-pickup-ii",
    "Subset sum equal to target (DP- 14)": "partition-equal-subset-sum",
    "Count subsets with sum K": "count-subsets-with-sum-k",
    "Count partitions with given difference": "target-sum",
    "Unbounded knapsack": "unbounded-knapsack",
    "Rod Cutting Problem | (DP - 24)": "rod-cutting",
    "Longest common subsequence": "longest-common-subsequence",
    "Print Longest Common Subsequence | (DP - 26)": "longest-common-subsequence",
    "Longest common substring": "maximum-length-of-repeated-subarray",
    "Longest Increasing Subsequence |(DP-43)": "longest-increasing-subsequence",
    "Matrix chain multiplication": "matrix-chain-multiplication",
    "Matrix Chain Multiplication | Bottom-Up|(DP-49)": "matrix-chain-multiplication",

    // Tries exact HTML names
    "Trie Implementation and Advanced Operations": "implement-trie-prefix-tree",
    "Longest Word with All Prefixes": "longest-word-in-dictionary",
    "Number of distinct substrings in a string": "number-of-distinct-substrings",

    // Strings (Hard) exact HTML names
    "Z function": "z-function",
    "Shortest Palindrome": "shortest-palindrome",
};

// Build a case-insensitive lookup from the map
const normalizedSlugMap = {};
for (const key in NAME_TO_SLUG) {
    normalizedSlugMap[key.toLowerCase().trim()] = NAME_TO_SLUG[key];
}

// Iterate in document order
$('.tuf-accordion-title, .tuf-subrow-btn span, tr').each((i, el) => {
    const tag = el.tagName.toLowerCase();

    if ($(el).hasClass('tuf-accordion-title')) {
        const text = $(el).text().trim();
        if (text && text.length > 2) {
            currentCategory = text;
            currentSubCategory = text;
            if (!data[currentCategory]) data[currentCategory] = {};
        }
    } else if (tag === 'span' && $(el).parent().hasClass('tuf-subrow-btn')) {
        const text = $(el).text().trim();
        if (text && text.length > 0 && !text.includes('/')) {
            currentSubCategory = text;
            if (!data[currentCategory]) data[currentCategory] = {};
            if (!data[currentCategory][currentSubCategory]) data[currentCategory][currentSubCategory] = [];
        }
    } else if (tag === 'tr') {
        const tds = $(el).find('td');
        if (tds.length < 6) return; // header or invalid row

        // Problem name is in the 2nd td
        const problemTd = tds.eq(1);
        const problemLink = problemTd.find('a').first();
        let problemName = problemLink.text().trim() || problemTd.text().trim();
        if (!problemName || problemName === 'Problem') return;

        // Look for LeetCode link in the Practice column (6th td, index 5)
        let leetcodeUrl = '';
        const practiceTd = tds.eq(5);
        const practiceLinks = practiceTd.find('a[href*="leetcode.com"]');
        if (practiceLinks.length > 0) {
            leetcodeUrl = practiceLinks.first().attr('href');
            // Clean up the URL - remove query params and fragments
            if (leetcodeUrl) {
                const match = leetcodeUrl.match(/(https:\/\/leetcode\.com\/problems\/[^\/\?#]+)/);
                if (match) leetcodeUrl = match[1] + '/';
            }
            withLeetcode++;
        }

        // If no LeetCode URL found, try to construct one from the name-to-slug map
        if (!leetcodeUrl) {
            const normalizedName = problemName.toLowerCase().trim();
            const slug = normalizedSlugMap[normalizedName];
            if (slug) {
                leetcodeUrl = `https://leetcode.com/problems/${slug}/`;
                constructedLeetcode++;
            } else {
                // Try to auto-generate slug from the problem name
                const autoSlug = problemName.toLowerCase()
                    .replace(/[''"]/g, '')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                // Only use auto-slug if the name looks like a real LeetCode problem
                // (skip generic names like "Introduction to..." or very short names)
                if (autoSlug.length > 5 &&
                    !problemName.toLowerCase().startsWith('introduction') &&
                    !problemName.toLowerCase().startsWith('implement') &&
                    !problemName.toLowerCase().includes('using array') &&
                    !problemName.toLowerCase().includes('using linked')) {
                    // We'll leave it empty for non-LeetCode problems
                }
                noLeetcode++;
            }
        }

        if (!data[currentCategory]) data[currentCategory] = {};
        if (!data[currentCategory][currentSubCategory]) data[currentCategory][currentSubCategory] = [];

        // Deduplicate within subcategory
        if (!data[currentCategory][currentSubCategory].some(p => p.name === problemName)) {
            data[currentCategory][currentSubCategory].push({
                name: problemName,
                leetcodeUrl: leetcodeUrl,
                source: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
                leetcodeId: ''
            });
            totalCount++;
        }
    }
});

// Cleanup empty categories/subcategories
for (const cat in data) {
    for (const subCat in data[cat]) {
        if (data[cat][subCat].length === 0) delete data[cat][subCat];
    }
    if (Object.keys(data[cat]).length === 0) delete data[cat];
}

fs.writeFileSync('data/dsa/dsa_striver.json', JSON.stringify(data, null, 2));
console.log(`\n=== STRIVER EXTRACTION COMPLETE ===`);
console.log(`Total Problems: ${totalCount}`);
console.log(`With LeetCode link in HTML: ${withLeetcode}`);
console.log(`LeetCode URL constructed from knowledge: ${constructedLeetcode}`);
console.log(`No LeetCode URL: ${noLeetcode}`);
console.log(`Categories: ${Object.keys(data).length}`);
