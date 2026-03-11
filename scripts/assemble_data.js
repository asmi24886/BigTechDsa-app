const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/dsa');
const outputFile = path.join(dataDir, 'merged_dsa.json');

// ============================================================
// CANONICAL CATEGORY MAP
// Maps source-level category names to unified canonical names.
// ============================================================
const CANONICAL_CATEGORY = {
    // --- Arrays & Hashing ---
    "Arrays & Hashing": "Arrays & Hashing",
    "Arrays": "Arrays & Hashing",
    "Strings": "Arrays & Hashing",
    "Array / String": "Arrays & Hashing",
    "Hash Set / Hash Map": "Arrays & Hashing",
    "Hash Tables": "Arrays & Hashing",
    "Prefix Sum": "Arrays & Hashing",
    "Suffix Array": "Arrays & Hashing",
    "Array/Matrix Manipulation Patterns": "Arrays & Hashing",
    "String Manipulation Patterns": "Arrays & Hashing",
    "Matrix (2D Array)": "Arrays & Hashing",
    "Bucket Sort": "Arrays & Hashing",
    "Recursion": "Arrays & Hashing",
    "Divide and Conquer": "Arrays & Hashing",
    "Merge Sort": "Arrays & Hashing",
    // Striver categories -> Arrays
    "Solve Problems on Arrays [Easy -> Medium -> Hard]": "Arrays & Hashing",
    "Strings [Basic and Medium]": "Arrays & Hashing",
    "Learn Important Sorting Techniques": "Arrays & Hashing",
    "Learn the basics": "Arrays & Hashing",

    // --- Two Pointers ---
    "Two Pointers": "Two Pointers",
    "Two Pointer Patterns": "Two Pointers",
    "Fast and Slow Pointers": "Two Pointers",

    // --- Sliding Window ---
    "Sliding Window": "Sliding Window",
    "Sliding Window Patterns": "Sliding Window",
    "Sliding Window - Fixed Size": "Sliding Window",
    "Monotonic Queue": "Sliding Window",
    "Sliding Window & Two Pointer Combined Problems": "Sliding Window",

    // --- Stack & Queue ---
    "Stack": "Stack & Queue",
    "Stack Patterns": "Stack & Queue",
    "Stacks": "Stack & Queue",
    "Monotonic Stack": "Stack & Queue",
    "Queues": "Stack & Queue",
    "Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]": "Stack & Queue",

    // --- Binary Search ---
    "Binary Search": "Binary Search",
    "Binary Search Patterns": "Binary Search",
    "Binary Search [1D, 2D Arrays, Search Space]": "Binary Search",

    // --- Linked List ---
    "Linked List": "Linked List",
    "Linked List Manipulation Patterns": "Linked List",
    "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]": "Linked List",

    // --- Trees ---
    "Trees": "Trees",
    "Tree Traversal Patterns (DFS & BFS)": "Trees",
    "Tree Traversal - Pre-Order": "Trees",
    "Tree Traversal - In-Order": "Trees",
    "Tree Traversal - Post-Order": "Trees",
    "Tree Traversal - Pre Order": "Trees",
    "Tree Traversal - In Order": "Trees",
    "Tree Traversal - Level Order": "Trees",
    "BST / Ordered Set": "Trees",
    "Tries": "Trees",
    "Design Patterns": "Trees",
    "Binary Indexed Tree / Segment Tree": "Trees",
    "Binary Trees [Traversals, Medium and Hard Problems]": "Trees",
    "Binary Search Trees [Concept and Problems]": "Trees",
    "Trie": "Trees",

    // --- Heap / Priority Queue ---
    "Heap / Priority Queue": "Heap / Priority Queue",
    "Heap (Priority Queue) Patterns": "Heap / Priority Queue",
    "Heaps": "Heap / Priority Queue",
    "Two Heaps": "Heap / Priority Queue",
    "Top K Elements": "Heap / Priority Queue",
    "K-Way Merge": "Heap / Priority Queue",
    "Heaps [Learning, Medium, Hard Problems]": "Heap / Priority Queue",

    // --- Graphs ---
    "Graphs": "Graphs",
    "Advanced Graphs": "Graphs",
    "Graph Traversal Patterns (DFS & BFS)": "Graphs",
    "Depth First Search (DFS)": "Graphs",
    "Breadth First Search (BFS)": "Graphs",
    "Topological Sort": "Graphs",
    "Union Find": "Graphs",
    "Minimum Spanning Tree": "Graphs",
    "Shortest Path": "Graphs",
    "Eulerian Circuit": "Graphs",
    "Line Sweep": "Graphs",
    "Graphs [Concepts & Problems]": "Graphs",

    // --- Dynamic Programming ---
    "1-D Dynamic Programming": "Dynamic Programming",
    "2-D Dynamic Programming": "Dynamic Programming",
    "Dynamic Programming (DP) Patterns": "Dynamic Programming",
    "1-D DP": "Dynamic Programming",
    "Knapsack DP": "Dynamic Programming",
    "Unbounded Knapsack DP": "Dynamic Programming",
    "Longest Increasing Subsequence DP": "Dynamic Programming",
    "2D (Grid) DP": "Dynamic Programming",
    "String DP": "Dynamic Programming",
    "Tree / Graph DP": "Dynamic Programming",
    "Bitmask DP": "Dynamic Programming",
    "Digit DP": "Dynamic Programming",
    "Probability DP": "Dynamic Programming",
    "State Machine DP": "Dynamic Programming",
    "Kadane's Algorithm": "Dynamic Programming",
    "Dynamic Programming [Patterns and Problems]": "Dynamic Programming",

    // --- Backtracking ---
    "Backtracking": "Backtracking",
    "Backtracking Patterns": "Backtracking",
    "Recursion [PatternWise]": "Backtracking",

    // --- Greedy ---
    "Greedy": "Greedy",
    "Greedy Patterns": "Greedy",
    "Intervals": "Greedy",
    "Greedy Algorithms [Easy, Medium/Hard]": "Greedy",

    // --- Bit Manipulation ---
    "Bit Manipulation": "Bit Manipulation",
    "Bit Manipulation Patterns": "Bit Manipulation",
    "Bit Manipulation [Concepts & Problems]": "Bit Manipulation",

    // --- Math & Geometry ---
    "Math & Geometry": "Math & Geometry",
    "Maths / Geometry": "Math & Geometry",

    // --- Design ---
    "Data Structure Design": "Design",
    "String Matching": "Arrays & Hashing",
    "Intervals": "Greedy",

    // --- Educative 1 (Grokking Coding Interview) categories ---
    "In-Place Manipulation of a Linked List": "Linked List",
    "K-way Merge": "Heap / Priority Queue",
    "Modified Binary Search": "Binary Search",
    "Subsets": "Backtracking",
    "Greedy Techniques": "Greedy",
    "Cyclic Sort": "Arrays & Hashing",
    "Sort and Search": "Arrays & Hashing",
    "Matrices": "Arrays & Hashing",
    "Tree Depth-First Search": "Trees",
    "Tree Breadth-First Search": "Trees",
    "Hash Maps": "Arrays & Hashing",
    "Knowing What to Track": "Arrays & Hashing",
    "Custom Data Structures": "Design",
    "Bitwise Manipulation": "Bit Manipulation",
    "Math and Geometry": "Math & Geometry",
    "Challenge Yourself": "Arrays & Hashing",

    // --- Educative 2 (Grokking DP) categories ---
    "0/1 Knapsack": "Dynamic Programming",
    "Unbounded Knapsack": "Dynamic Programming",
    "Recursive Numbers": "Dynamic Programming",
    "Longest Common Substring": "Dynamic Programming",
    "Palindromic Subsequence": "Dynamic Programming",

    // --- AlgoExpert categories ---
    "Linked Lists": "Linked List",
    "Binary Trees": "Trees",
    "Binary Search Trees": "Trees",
    "Searching (Graphs/BFS/DFS)": "Graphs",
    "Sorting": "Arrays & Hashing",
    "Famous Algorithms": "Graphs",
    "Dynamic Programming": "Dynamic Programming",
};

// ============================================================
// CANONICAL SUBCATEGORY MAP
// Maps source-level subcategory names to unified canonical names.
// We prefer descriptive names (Thita style).
// ============================================================
const CANONICAL_SUBCATEGORY = {
    // --- Two Pointers subs ---
    "Opposite Ends (Meeting in the Middle)": "Converging (Sorted Array Target Sum)",
    "Two Pointers - Converging (Sorted Array Target Sum)": "Converging (Sorted Array Target Sum)",
    "Fast & Slow Pointers (Tortoise & Hare)": "Fast & Slow (Cycle Detection)",
    "Two Pointers - Fast & Slow (Cycle Detection)": "Fast & Slow (Cycle Detection)",
    "Fast & Slow Pointers": "Fast & Slow (Cycle Detection)",
    "Fast and Slow Pointers": "Fast & Slow (Cycle Detection)",
    "Same Direction Pointers": "In-place Array Modification",
    "Two Pointers - In-place Array Modification": "In-place Array Modification",
    "General Two Pointers": "General Two Pointers",
    "Two Pointers - Fixed Separation (Nth Node from End)": "Fixed Separation (Nth Node from End)",
    "Two Pointers - String Comparison with Backspaces": "String Comparison with Backspaces",
    "Two Pointers - Expanding From Center (Palindromes)": "Expanding From Center (Palindromes)",
    "Two Pointers - String Reversal": "String Reversal",

    // --- Sliding Window subs ---
    "Variable Size Window": "Variable Size (Condition-Based)",
    "Sliding Window - Variable Size (Condition-Based)": "Variable Size (Condition-Based)",
    "Fixed Size Window": "Fixed Size (Subarray Calculation)",
    "Sliding Window - Fixed Size (Subarray Calculation)": "Fixed Size (Subarray Calculation)",
    "Sliding Window - Fixed Size": "Fixed Size (Subarray Calculation)",
    "Sliding Window Maximum/Median (Deque/Heap)": "Monotonic Queue for Max/Min",
    "Sliding Window - Monotonic Queue for Max/Min": "Monotonic Queue for Max/Min",
    "Monotonic Queue": "Monotonic Queue for Max/Min",
    "General Sliding Window": "General Sliding Window",
    "Sliding Window - Character Frequency Matching": "Character Frequency Matching",

    // --- Binary Search subs ---
    "Binary Search on Answers (Min-Max/Max-Min)": "On Answer / Condition Function",
    "Binary Search - On Answer / Condition Function": "On Answer / Condition Function",
    "Binary Search on Rotated Arrays": "Find Min/Max in Rotated Sorted Array",
    "Binary Search - Find Min/Max in Rotated Sorted Array": "Find Min/Max in Rotated Sorted Array",
    "Binary Search on Matrices": "On Sorted Array/List",
    "Binary Search on Multiple Arrays": "Median and Kth of Two Sorted Arrays",
    "Binary Search - Median and Kth of Two Sorted Arrays": "Median and Kth of Two Sorted Arrays",
    "Binary Search on Arrays (Lower/Upper Bound)": "Find First/Last Occurrence",
    "Binary Search - Find First/Last Occurrence": "Find First/Last Occurrence",
    "Standard Binary Search": "On Sorted Array/List",
    "Binary Search - On Sorted Array/List": "On Sorted Array/List",

    // --- Stack subs ---
    "Monotonic Stack": "Monotonic Stack",
    "Stack - Monotonic Stack": "Monotonic Stack",
    "Parsing & Expression Evaluation": "Expression Evaluation (RPN/Infix)",
    "Stack - Expression Evaluation (RPN/Infix)": "Expression Evaluation (RPN/Infix)",
    "Design / Deque": "Min Stack Design",
    "Stack - Min Stack Design": "Min Stack Design",
    "General Stack/Queue": "General Stack/Queue",
    "Stacks": "General Stack/Queue",
    "Queues": "General Stack/Queue",
    "Stack - Valid Parentheses Matching": "Valid Parentheses Matching",
    "Stack - Simulation / Backtracking Helper": "Simulation / Backtracking Helper",
    "Stack - Largest Rectangle in Histogram": "Largest Rectangle in Histogram",

    // --- Linked List subs ---
    "In-place Reversal": "In-place Reversal",
    "Linked List - In-place Reversal": "In-place Reversal",
    "Merging/Math Lists": "Merging Two Sorted Lists",
    "Linked List - Merging Two Sorted Lists": "Merging Two Sorted Lists",
    "Design / Specialized Lists (Doubly/Random)": "Design / Specialized Lists",
    "General Linked List": "General Linked List",
    "Linked List - Addition of Numbers": "Addition of Numbers",
    "Linked List - Intersection Detection": "Intersection Detection",
    "Linked List - Reordering / Partitioning": "Reordering / Partitioning",

    // --- Tree subs ---
    "Tree BFS / Level Order Traversal": "BFS - Level Order Traversal",
    "Tree BFS - Level Order Traversal": "BFS - Level Order Traversal",
    "Tree Traversal - Level Order": "BFS - Level Order Traversal",
    "Tree Traversals (DFS)": "DFS - Preorder Traversal",
    "Tree DFS - Recursive Preorder Traversal": "DFS - Preorder Traversal",
    "Tree Traversal - Pre Order": "DFS - Preorder Traversal",
    "Tree DFS - Recursive Inorder Traversal": "DFS - Inorder Traversal",
    "Tree Traversal - In Order": "DFS - Inorder Traversal",
    "Tree DFS - Recursive Postorder Traversal": "DFS - Postorder Traversal",
    "Tree Properties & Structural DP": "Properties & Structural DP",
    "BST Properties": "BST Properties",
    "BST / Ordered Set": "BST Properties",
    "Tree DFS / General": "DFS - General",
    "Tree Path Problems": "Path Problems",
    "Tree Construction & Serialization": "Serialization & Deserialization",
    "Tree - Serialization and Deserialization": "Serialization & Deserialization",
    "Lowest Common Ancestor (LCA)": "Lowest Common Ancestor (LCA)",
    "Tree - Lowest Common Ancestor (LCA) Finding": "Lowest Common Ancestor (LCA)",
    "Segment Tree / BIT": "Segment Tree / BIT",
    "Tries": "Tries",

    // --- Heap subs ---
    "Top K Elements": "Top K Elements (Selection/Frequency)",
    "Heap - Top K Elements (Selection/Frequency)": "Top K Elements (Selection/Frequency)",
    "Two Heaps / Stream Median": "Two Heaps for Median Finding",
    "Heap - Two Heaps for Median Finding": "Two Heaps for Median Finding",
    "Scheduling / Greedy with Heap": "Scheduling / Minimum Cost (Greedy with PQ)",
    "Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)": "Scheduling / Minimum Cost (Greedy with PQ)",
    "General Priority Queue": "General Priority Queue",
    "K-Way Merge": "K-way Merge",
    "Heap - K-way Merge": "K-way Merge",

    // --- Graph subs ---
    "Matrix / Grid (BFS/DFS)": "DFS - Connected Components / Island Counting",
    "Graph DFS - Connected Components / Island Counting": "DFS - Connected Components / Island Counting",
    "Graph BFS - Connected Components / Island Counting": "BFS - Connected Components / Island Counting",
    "Matrix / Grid (Shortest Path)": "Shortest Path (Dijkstra's Algorithm)",
    "Topological Sort": "Topological Sort (Kahn's Algorithm)",
    "Graph BFS - Topological Sort (Kahn's Algorithm)": "Topological Sort (Kahn's Algorithm)",
    "Graph DFS - Cycle Detection (Directed Graph)": "Cycle Detection (Directed Graph)",
    "Adjacency List & General Graph Traversal": "General Graph Traversal",
    "Union Find (Disjoint Set)": "Union-Find (Disjoint Set Union - DSU)",
    "Graph - Union-Find (Disjoint Set Union - DSU)": "Union-Find (Disjoint Set Union - DSU)",
    "Union Find": "Union-Find (Disjoint Set Union - DSU)",
    "Minimum Spanning Tree (MST)": "Minimum Spanning Tree (Kruskal / Prim)",
    "Graph - Minimum Spanning Tree (Kruskal / Prim / DSU + heap)": "Minimum Spanning Tree (Kruskal / Prim)",
    "Bipartite Graph": "Bipartite Graph",
    "Graph Traversal / Cloning": "Deep Copy / Cloning",
    "Graph - Deep Copy / Cloning": "Deep Copy / Cloning",
    "Eulerian Path / Circuit": "Eulerian Path / Circuit",
    "Eulerian Circuit": "Eulerian Path / Circuit",
    "Shortest Path (Dijkstra / Bellman-Ford / BFS)": "Shortest Path (Dijkstra's Algorithm)",
    "Graph - Shortest Path (Dijkstra's Algorithm)": "Shortest Path (Dijkstra's Algorithm)",
    "Graph - Shortest Path (Bellman-Ford / BFS+K)": "Shortest Path (Bellman-Ford / BFS+K)",
    "Shortest Path": "Shortest Path (Dijkstra's Algorithm)",
    "Graph - Bridges & Articulation Points (Tarjan low-link)": "Bridges & Articulation Points (Tarjan)",
    "Graph - Bidirectional BFS (BFS optimization for known source & target)": "Bidirectional BFS",
    "Depth First Search (DFS)": "DFS - Connected Components / Island Counting",
    "Breadth First Search (BFS)": "BFS - Connected Components / Island Counting",
    "Line Sweep": "Line Sweep",

    // --- DP subs ---
    "Fibonacci DP": "1D Array (Fibonacci Style)",
    "DP - 1D Array (Fibonacci Style)": "1D Array (Fibonacci Style)",
    "1-D DP": "1D Array (Fibonacci Style)",
    "Kadane's / DP on Arrays": "Kadane's Algorithm (Max/Min Subarray)",
    "DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)": "Kadane's Algorithm (Max/Min Subarray)",
    "Kadane's Algorithm": "Kadane's Algorithm (Max/Min Subarray)",
    "LCS (Longest Common Subsequence)": "Longest Common Subsequence (LCS)",
    "DP - 2D Array (Longest Common Subsequence - LCS)": "Longest Common Subsequence (LCS)",
    "LIS (Longest Increasing Subsequence)": "Longest Increasing Subsequence (LIS)",
    "DP - Longest Increasing Subsequence (LIS)": "Longest Increasing Subsequence (LIS)",
    "Longest Increasing Subsequence DP": "Longest Increasing Subsequence (LIS)",
    "MCM & Partition DP": "Interval / Partition DP",
    "DP - Interval DP": "Interval / Partition DP",
    "MCM DP | Partition DP": "Interval / Partition DP",
    "Interval DP": "Interval / Partition DP",
    "0/1 Knapsack": "0/1 Knapsack (Subset Sum Style)",
    "Knapsack DP": "0/1 Knapsack (Subset Sum Style)",
    "DP - 1D Array (0/1 Knapsack Subset Sum Style)": "0/1 Knapsack (Subset Sum Style)",
    "Unbounded Knapsack": "Unbounded Knapsack (Coin Change Style)",
    "Unbounded Knapsack DP": "Unbounded Knapsack (Coin Change Style)",
    "DP - 1D Array (Coin Change / Unbounded Knapsack Style)": "Unbounded Knapsack (Coin Change Style)",
    "Grid DP": "2D Array (Grid Unique Paths)",
    "2D (Grid) DP": "2D Array (Grid Unique Paths)",
    "DP - 2D Array (Unique Paths on Grid)": "2D Array (Grid Unique Paths)",
    "DP on Squares": "2D Array (Grid Unique Paths)",
    "String DP": "String DP (Edit Distance / Word Break)",
    "DP - 2D Array (Edit Distance / Levenshtein Distance)": "String DP (Edit Distance / Word Break)",
    "DP - 1D Array (Word Break Style)": "String DP (Edit Distance / Word Break)",
    "Tree DP": "Tree / Graph DP",
    "Tree / Graph DP": "Tree / Graph DP",
    "Graph DP": "Tree / Graph DP",
    "State Machine & Stock DP": "Stock Problems (State Machine)",
    "DP - Stock problems": "Stock Problems (State Machine)",
    "State Machine DP": "Stock Problems (State Machine)",
    "Bitmask DP": "Bitmask DP",
    "Digit DP": "Digit DP",
    "Probability DP": "Probability DP",
    "DP - Catalan Numbers": "Catalan Numbers",
    // Striver DP subcategories
    "Introduction to DP": "1D Array (Fibonacci Style)",
    "1D DP": "1D Array (Fibonacci Style)",
    "DP on Subsequences": "0/1 Knapsack (Subset Sum Style)",
    "DP on Strings": "String DP (Edit Distance / Word Break)",
    "DP on Stocks": "Stock Problems (State Machine)",
    "DP on LIS": "Longest Increasing Subsequence (LIS)",
    // Educative 2 "General" subcategory - map to proper names
    "General": "General DP",

    // --- Backtracking subs ---
    "Combinations": "Combination Sum",
    "Backtracking - Combination Sum": "Combination Sum",
    "Permutations": "Permutations",
    "Backtracking - Permutations": "Permutations",
    "Subsets": "Subsets (Include/Exclude)",
    "Backtracking - Subsets (Include/Exclude)": "Subsets (Include/Exclude)",
    "Grid / Branching Backtracking": "Word Search / Path Finding in Grid",
    "Backtracking - Word Search / Path Finding in Grid": "Word Search / Path Finding in Grid",
    "Partitioning Backtracking": "Palindrome Partitioning",
    "Backtracking - Palindrome Partitioning": "Palindrome Partitioning",
    "Parentheses Generation": "Parentheses Generation",
    "Backtracking - Parentheses Generation": "Parentheses Generation",
    "State Exploration Backtracking": "General Backtracking",
    "Backtracking - N-Queens / Constraint Satisfaction": "N-Queens / Constraint Satisfaction",

    // --- Greedy subs ---
    "Array & Value Distribution Greedy": "Jump Game Reachability/Minimization",
    "Greedy - Jump Game Reachability/Minimization": "Jump Game Reachability/Minimization",
    "Intervals Greedy": "Interval Merging/Scheduling",
    "Greedy - Interval Merging/Scheduling": "Interval Merging/Scheduling",
    "Intervals": "Interval Merging/Scheduling",
    "Logic & Parsing Greedy": "General Greedy",
    "General Greedy": "General Greedy",
    "Greedy - Task Scheduling (Frequency Based)": "Task Scheduling (Frequency Based)",
    "Greedy - Sorting Based": "Sorting Based",
    "Greedy - Buy/Sell Stock": "Buy/Sell Stock",
    "Greedy - Gas Station Circuit": "Gas Station Circuit",

    // --- Bit Manipulation subs ---
    "Bitwise Operations": "Bitwise XOR - Finding Single/Missing Number",
    "Bitwise XOR - Finding Single/Missing Number": "Bitwise XOR - Finding Single/Missing Number",
    "Number Theory / Math": "Number Theory / Math",
    "Math / Geometry / General Bit Manipulation": "Math / Geometry / General",
    "Bitwise AND - Counting Set Bits (Hamming Weight)": "Counting Set Bits (Hamming Weight)",
    "Bitwise DP - Counting Bits Optimization": "Counting Bits Optimization",
    "Bitwise Operations - Power of Two/Four Check": "Power of Two/Four Check",

    // --- Arrays subs ---
    "Hash Map: Frequency/Counters": "Hash Map: Frequency/Counters",
    "Hash Set: Lookups/Uniqueness": "Hash Set: Lookups/Uniqueness",
    "Hash Tables": "Hash Map: Frequency/Counters",
    "Arrays": "Simulation / General Array",
    "Prefix Sums": "Prefix Sums",
    "Design / Encodings": "Design / Encodings",
    "Sorting & Intervals": "Sorting & Intervals",
    "Matrix Traversal & Math": "Matrix Traversal & Math",
    "Matrix (2D Array)": "Matrix Traversal & Math",
    "Simulation / General Array": "Simulation / General Array",
    "Data Structure Design": "Design / Encodings",
    "Bucket Sort": "Sorting & Intervals",
    "Recursion": "Simulation / General Array",
    "Divide and Conquer": "Simulation / General Array",
    "Merge Sort": "Sorting & Intervals",

    // --- Array/Matrix patterns from Thita ---
    "Array/Matrix - In-place Rotation": "Matrix Traversal & Math",
    "Array/Matrix - Spiral Traversal": "Matrix Traversal & Math",
    "Array/Matrix - Set Matrix Zeroes (In-place Marking)": "Matrix Traversal & Math",
    "Array - Product Except Self (Prefix/Suffix Products)": "Prefix Sums",
    "Array - Plus One (Handling Carry)": "Simulation / General Array",
    "Array - Merge Sorted Array (In-place from End)": "Simulation / General Array",
    "Array - Cyclic Sort": "Simulation / General Array",

    // --- String patterns from Thita ---
    "String - Palindrome Check (Two Pointers / Reverse)": "Simulation / General Array",
    "String - Anagram Check (Frequency Count/Sort)": "Hash Map: Frequency/Counters",
    "String - Roman to Integer Conversion/ String to Integer (atoi)": "Simulation / General Array",
    "String - Multiply Strings/Add Strings (Manual Simulation)": "Simulation / General Array",
    "String Matching - Naive / KMP / Rabin-Karp": "Simulation / General Array",
    "String - Repeated Substring Pattern Detection": "Simulation / General Array",
    "String Matching": "Simulation / General Array",
};

// ============================================================
// DP PROBLEM-LEVEL RECLASSIFICATION
// Maps specific problem slugs (from leetcodeUrl) or exact names
// (for non-LC problems) to their correct DP subcategory.
// This handles problems originally lumped into "General DP" or "General".
// ============================================================
const DP_PROBLEM_RECLASSIFY = {
    // --- 1D Array (Fibonacci Style) ---
    'n-th-tribonacci-number': '1D Array (Fibonacci Style)',
    'paint-house': '1D Array (Fibonacci Style)',
    'paint-fence': '1D Array (Fibonacci Style)',
    'filling-bookcase-shelves': '1D Array (Fibonacci Style)',
    'check-if-there-is-a-valid-partition-for-the-array': '1D Array (Fibonacci Style)',
    'minimum-cost-for-tickets': '1D Array (Fibonacci Style)',
    'solving-questions-with-brainpower': '1D Array (Fibonacci Style)',
    'count-ways-to-build-good-strings': '1D Array (Fibonacci Style)',
    'knight-dialer': '1D Array (Fibonacci Style)',
    '2-keys-keyboard': '1D Array (Fibonacci Style)',
    'integer-break': '1D Array (Fibonacci Style)',
    'ugly-number-ii': '1D Array (Fibonacci Style)',
    'count-vowels-permutation': '1D Array (Fibonacci Style)',
    'flip-string-to-monotone-increasing': '1D Array (Fibonacci Style)',
    'paint-house-ii': '1D Array (Fibonacci Style)',
    'student-attendance-record-ii': '1D Array (Fibonacci Style)',
    'count-strictly-increasing-subarrays': '1D Array (Fibonacci Style)',
    'k-inverse-pairs-array': '1D Array (Fibonacci Style)',
    '4-keys-keyboard': '1D Array (Fibonacci Style)',
    'number-of-ways-to-divide-a-long-corridor': '1D Array (Fibonacci Style)',
    'count-all-valid-pickup-and-delivery-options': '1D Array (Fibonacci Style)',
    'number-of-ways-to-rearrange-sticks-with-k-sticks-visible': '1D Array (Fibonacci Style)',
    'number-of-ways-to-stay-in-the-same-place-after-some-steps': '1D Array (Fibonacci Style)',
    // Educative 2 non-LC reclassify
    'Number Factors': '1D Array (Fibonacci Style)',
    'Count Ways to Score in a Game': '1D Array (Fibonacci Style)',

    // --- 2D Array (Grid Unique Paths) ---
    'maximum-number-of-points-with-cost': '2D Array (Grid Unique Paths)',
    'knight-probability-in-chessboard': '2D Array (Grid Unique Paths)',
    'out-of-boundary-paths': '2D Array (Grid Unique Paths)',
    'minimum-falling-path-sum-ii': '2D Array (Grid Unique Paths)',
    'dungeon-game': '2D Array (Grid Unique Paths)',

    // --- Interval / Partition DP ---
    'stone-game': 'Interval / Partition DP',
    'stone-game-ii': 'Interval / Partition DP',
    'stone-game-iii': 'Interval / Partition DP',
    'maximum-value-of-k-coins-from-piles': 'Interval / Partition DP',
    'minimum-difficulty-of-a-job-schedule': 'Interval / Partition DP',
    'encode-string-with-shortest-length': 'Interval / Partition DP',
    'freedom-trail': 'Interval / Partition DP',
    'maximize-score-after-n-operations': 'Interval / Partition DP',
    'Matrix Chain Multiplication': 'Interval / Partition DP',

    // --- Longest Increasing Subsequence (LIS) ---
    'best-team-with-no-conflicts': 'Longest Increasing Subsequence (LIS)',
    'find-the-longest-valid-obstacle-course-at-each-position': 'Longest Increasing Subsequence (LIS)',
    'count-number-of-teams': 'Longest Increasing Subsequence (LIS)',
    'longest-ideal-subsequence': 'Longest Increasing Subsequence (LIS)',
    'arithmetic-slices-ii-subsequence': 'Longest Increasing Subsequence (LIS)',
    'maximum-alternating-subsequence-sum': 'Longest Increasing Subsequence (LIS)',
    'Minimum Deletions to Make a Sequence Sorted': 'Longest Increasing Subsequence (LIS)',
    'Maximum Sum Increasing Subsequence': 'Longest Increasing Subsequence (LIS)',
    'Longest Bitonic Subsequence': 'Longest Increasing Subsequence (LIS)',
    'Building Bridges': 'Longest Increasing Subsequence (LIS)',

    // --- Longest Common Subsequence (LCS) ---
    'uncrossed-lines': 'Longest Common Subsequence (LCS)',
    'longest-repeating-subsequence': 'Longest Common Subsequence (LCS)',

    // --- String DP (Edit Distance / Word Break) ---
    'stickers-to-spell-word': 'String DP (Edit Distance / Word Break)',
    'concatenated-words': 'String DP (Edit Distance / Word Break)',
    'number-of-ways-to-form-a-target-string-given-a-dictionary': 'String DP (Edit Distance / Word Break)',
    'number-of-ways-to-form-target-string-given-a-dictionary': 'String DP (Edit Distance / Word Break)',
    'string-compression-ii': 'String DP (Edit Distance / Word Break)',
    'sentence-screen-fitting': 'String DP (Edit Distance / Word Break)',
    'Minimum Deletions in a String to make it a Palindrome': 'String DP (Edit Distance / Word Break)',

    // --- 0/1 Knapsack (Subset Sum Style) ---
    '0-1-knapsack': '0/1 Knapsack (Subset Sum Style)',
    'profitable-schemes': '0/1 Knapsack (Subset Sum Style)',
    'painting-the-walls': '0/1 Knapsack (Subset Sum Style)',
    'split-array-with-same-average': '0/1 Knapsack (Subset Sum Style)',
    'the-number-of-good-subsets': '0/1 Knapsack (Subset Sum Style)',
    'count-the-number-of-good-subsequences': '0/1 Knapsack (Subset Sum Style)',

    // --- Unbounded Knapsack (Coin Change Style) ---
    'Maximum Ribbon Cut': 'Unbounded Knapsack (Coin Change Style)',
    'Rod Cutting': 'Unbounded Knapsack (Coin Change Style)',

    // --- Probability DP ---
    'soup-servings': 'Probability DP',
    'new-21-game': 'Probability DP',

    // --- Bitmask DP ---
    'minimum-number-of-work-sessions-to-finish-the-tasks': 'Bitmask DP',
    'fair-distribution-of-cookies': 'Bitmask DP',
    'optimal-account-balancing': 'Bitmask DP',

    // --- Tree / Graph DP ---
    'longest-increasing-path-in-a-matrix': 'Tree / Graph DP',

    // --- Stock Problems (State Machine) ---
    'maximum-profit-in-job-scheduling': 'Stock Problems (State Machine)',

    // --- Catalan Numbers ---
    'handshakes-that-dont-cross': 'Catalan Numbers',
    'The Catalan Numbers': 'Catalan Numbers',

    // --- Kadane's Algorithm ---
    'maximum-sum-of-3-non-overlapping-subarrays': "Kadane's Algorithm (Max/Min Subarray)",
};

// ============================================================
// MERGE LOGIC
// ============================================================
const mergedData = {};
const globalProblemMap = {};

// Process order matters: Thita first (best subcategories), then Striver, then Algomaster, then NeetCode
const sourceFiles = ['dsa_thita.json', 'dsa_striver.json', 'dsa_algomaster.json', 'dsa_algoexpert.json', 'dsa_neetcode.json', 'dsa_educative1.json', 'dsa_educative2.json'];

sourceFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) return;

    const sourceData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const rawCategory in sourceData) {
        const canonicalCategory = CANONICAL_CATEGORY[rawCategory] || rawCategory;

        for (const rawSubcategory in sourceData[rawCategory]) {
            const canonicalSubcategory = CANONICAL_SUBCATEGORY[rawSubcategory] || rawSubcategory;
            const problems = sourceData[rawCategory][rawSubcategory];

            for (const p of problems) {
                // Determine unique key from leetcode URL slug
                let uniqueKey = '';
                if (p.leetcodeUrl && p.leetcodeUrl.includes('leetcode.com/problems/')) {
                    const match = p.leetcodeUrl.match(/leetcode\.com\/problems\/([^\/\?]+)/);
                    if (match) uniqueKey = match[1].toLowerCase();
                }
                if (!uniqueKey) {
                    uniqueKey = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                }

                if (!globalProblemMap[uniqueKey]) {
                    // First time seeing this problem
                    const newProblem = {
                        name: p.name,
                        leetcodeUrl: p.leetcodeUrl,
                        leetcodeId: p.leetcodeId || '',
                        sources: [p.source]
                    };

                    globalProblemMap[uniqueKey] = {
                        problem: newProblem,
                        category: canonicalCategory,
                        subcategory: canonicalSubcategory
                    };

                    if (!mergedData[canonicalCategory]) mergedData[canonicalCategory] = {};
                    if (!mergedData[canonicalCategory][canonicalSubcategory]) mergedData[canonicalCategory][canonicalSubcategory] = [];

                    mergedData[canonicalCategory][canonicalSubcategory].push(newProblem);

                } else {
                    // Already seen - just add source
                    const existing = globalProblemMap[uniqueKey].problem;
                    if (!existing.sources.includes(p.source)) {
                        existing.sources.push(p.source);
                    }
                }
            }
        }
    }
});

// ============================================================
// POST-PROCESS: Reclassify problems across ALL categories
// Uses DP_PROBLEM_RECLASSIFY for DP and PROBLEM_RECLASSIFY for all.
// ============================================================
const PROBLEM_RECLASSIFY = require('./reclassify_map.js');

function getSlug(p) {
    if (p.leetcodeUrl && p.leetcodeUrl.includes('leetcode.com/problems/')) {
        const match = p.leetcodeUrl.match(/leetcode\.com\/problems\/([^\/\?]+)/);
        if (match) return match[1].toLowerCase();
    }
    return null;
}

function getUniqueKey(p) {
    const slug = getSlug(p);
    if (slug) return slug;
    return p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

let totalReclassified = 0;
for (const cat in mergedData) {
    const lookupMap = cat === 'Dynamic Programming'
        ? { ...PROBLEM_RECLASSIFY, ...DP_PROBLEM_RECLASSIFY }
        : PROBLEM_RECLASSIFY;

    for (const sub in mergedData[cat]) {
        const toRemove = [];
        for (let i = 0; i < mergedData[cat][sub].length; i++) {
            const p = mergedData[cat][sub][i];
            let newSub = null;
            const slug = getSlug(p);
            if (slug) newSub = lookupMap[slug];
            if (!newSub) newSub = lookupMap[p.name];

            if (newSub && newSub !== sub) {
                if (!mergedData[cat][newSub]) mergedData[cat][newSub] = [];
                mergedData[cat][newSub].push(p);
                toRemove.push(i);
                totalReclassified++;
                const uniqueKey = getUniqueKey(p);
                if (globalProblemMap[uniqueKey]) {
                    globalProblemMap[uniqueKey].subcategory = newSub;
                }
            }
        }
        for (let i = toRemove.length - 1; i >= 0; i--) {
            mergedData[cat][sub].splice(toRemove[i], 1);
        }
        if (mergedData[cat][sub].length === 0) {
            delete mergedData[cat][sub];
        }
    }
}
console.log('Reclassified ' + totalReclassified + ' problems into specific subcategories.');


// Sort categories and subcategories for cleaner output
const sortedMerged = {};
const categoryOrder = [
    "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack & Queue",
    "Binary Search", "Linked List", "Trees", "Heap / Priority Queue",
    "Graphs", "Dynamic Programming", "Backtracking", "Greedy",
    "Bit Manipulation", "Math & Geometry", "Design"
];

categoryOrder.forEach(cat => {
    if (mergedData[cat]) {
        sortedMerged[cat] = mergedData[cat];
    }
});
// Add any remaining categories not in our order
for (const cat in mergedData) {
    if (!sortedMerged[cat]) sortedMerged[cat] = mergedData[cat];
}

fs.writeFileSync(outputFile, JSON.stringify(sortedMerged, null, 2));

// Stats
const totalUnique = Object.keys(globalProblemMap).length;
const multiSourceCount = Object.values(globalProblemMap).filter(e => e.problem.sources.length > 1).length;
const catCount = Object.keys(sortedMerged).length;
let subCatCount = 0;
for (const c in sortedMerged) subCatCount += Object.keys(sortedMerged[c]).length;

console.log(`\n=== MERGE COMPLETE ===`);
console.log(`Categories: ${catCount}`);
console.log(`Sub-categories: ${subCatCount}`);
console.log(`Total Unique Problems: ${totalUnique}`);
console.log(`Problems in Multiple Sources: ${multiSourceCount}`);
console.log(`\nOutput: ${outputFile}`);
