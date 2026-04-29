const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/dsa/merged_dsa.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// 1. Update existing problems with slightly different names to include 'NC'
function addSourceToExisting(slug, source) {
  for (const cat in data) {
    for (const sub in data[cat]) {
      for (const p of data[cat][sub]) {
        if (p.leetcodeUrl && p.leetcodeUrl.includes(slug)) {
          if (!p.sources.includes(source)) {
            p.sources.push(source);
            console.log(`Added ${source} to existing problem: ${p.name}`);
          }
          return true;
        }
      }
    }
  }
  return false;
}

addSourceToExisting('find-largest-value-in-each-tree-row', 'https://neetcode.io/practice/practice/allNC');
addSourceToExisting('max-points-on-a-line', 'https://neetcode.io/practice/practice/allNC');

// 2. Add the completely missing problems to their appropriate categories
const newProblems = [
  {
    cat: 'Arrays & Hashing', sub: 'String Manipulation',
    p: { name: 'Split Concatenated Strings', leetcodeUrl: 'https://leetcode.com/problems/split-concatenated-strings', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Design', sub: 'Design / Encodings',
    p: { name: 'Design Phone Directory', leetcodeUrl: 'https://leetcode.com/problems/design-phone-directory', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Design', sub: 'Design / Encodings',
    p: { name: 'Design Log Storage System', leetcodeUrl: 'https://leetcode.com/problems/design-log-storage-system', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Binary Search', sub: 'Binary Search on Answers',
    p: { name: 'Cutting Ribbons', leetcodeUrl: 'https://leetcode.com/problems/cutting-ribbons', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Linked List', sub: 'General Linked List',
    p: { name: 'Remove Duplicates From an Unsorted Linked List', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-an-unsorted-linked-list', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Trees', sub: 'Binary Tree',
    p: { name: 'Binary Tree Upside Down', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-upside-down', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Backtracking', sub: 'Combinations / Permutations',
    p: { name: 'Word Pattern II', leetcodeUrl: 'https://leetcode.com/problems/word-pattern-ii', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Backtracking', sub: 'Combinations / Permutations',
    p: { name: 'Android Unlock Patterns', leetcodeUrl: 'https://leetcode.com/problems/android-unlock-patterns', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Dynamic Programming', sub: '1D Array (Fibonacci Style)',
    p: { name: 'Coin Path', leetcodeUrl: 'https://leetcode.com/problems/coin-path', difficulty: 'Hard', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Greedy', sub: 'Sorting Based',
    p: { name: 'How Many Apples Can You Put into the Basket', leetcodeUrl: 'https://leetcode.com/problems/how-many-apples-can-you-put-into-the-basket', difficulty: 'Easy', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Math & Geometry', sub: 'Number Theory / Math',
    p: { name: 'Minimum Factorization', leetcodeUrl: 'https://leetcode.com/problems/minimum-factorization', difficulty: 'Medium', sources: ['https://neetcode.io/practice/practice/allNC'] }
  },
  {
    cat: 'Bit Manipulation', sub: 'Bitwise XOR - Finding Single/Missing Number',
    p: { name: 'Count Triplets with Even XOR Set Bits I', leetcodeUrl: 'https://leetcode.com/problems/count-triplets-with-even-xor-set-bits-i', difficulty: 'Easy', sources: ['https://neetcode.io/practice/practice/allNC'] }
  }
];

for (const np of newProblems) {
  if (!data[np.cat]) {
    data[np.cat] = {};
  }
  if (!data[np.cat][np.sub]) {
    data[np.cat][np.sub] = [];
  }
  
  // check if somehow it exists already by name
  const exists = data[np.cat][np.sub].some(existing => existing.name === np.p.name);
  if (!exists) {
    data[np.cat][np.sub].push(np.p);
    console.log(`Added new problem: ${np.p.name} to ${np.cat} -> ${np.sub}`);
  }
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully updated merged_dsa.json');
