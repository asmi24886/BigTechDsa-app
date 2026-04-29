const fs = require('fs');
const path = require('path');

const striverTxtPath = path.join(__dirname, '../data/dump/striver.txt');
const allProblemsDumpPath = path.join(__dirname, 'all_problems_dump.json');
const dsaStriverPath = path.join(__dirname, '../data/dsa/dsa_striver.json');

// Read problem names
const lines = fs.readFileSync(striverTxtPath, 'utf8').split('\n');
const parsedProblems = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^-\s*(Easy|Medium|Hard|medium|easy|hard)/i) || line === '-') {
        // Look back to find problem name
        let j = i - 1;
        while (j >= 0 && lines[j].trim() === '') j--;
        if (j >= 0) {
            const nameCandidate = lines[j].trim();
            if (nameCandidate && nameCandidate !== 'takeUforward' && nameCandidate !== '-' && nameCandidate !== 'Problem') {
                if (line !== '-') {
                    // It's a valid difficulty line
                    parsedProblems.push(nameCandidate);
                } else {
                     // In some cases, difficulty is just missing, but we still have a '-'
                     if (lines[i-1] && lines[i-1].trim() !== 'takeUforward' && lines[i-1].trim() !== '-') {
                        // parsedProblems.push(nameCandidate);
                     }
                }
            }
        }
    }
}

// remove duplicates
const uniqueParsed = [...new Set(parsedProblems)];
console.log(`Parsed ${uniqueParsed.length} unique problems from dump.`);

// Now let's try to match them against all_problems_dump.json
const allProblems = JSON.parse(fs.readFileSync(allProblemsDumpPath, 'utf8'));

// Create lookups
const slugToProblem = {};
const nameToProblem = {};

allProblems.forEach(p => {
    slugToProblem[p.slug] = p;
    nameToProblem[p.name.toLowerCase()] = p;
});

function getSlugFromName(name) {
    return name.toLowerCase()
        .replace(/['"()]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const matchedProblems = [];
const unmatchedProblems = [];

uniqueParsed.forEach(name => {
    let match = null;
    if (nameToProblem[name.toLowerCase()]) {
        match = nameToProblem[name.toLowerCase()];
    } else {
        const slug = getSlugFromName(name);
        if (slugToProblem[slug]) {
            match = slugToProblem[slug];
        }
    }

    if (match) {
        matchedProblems.push({
            name: name,
            slug: match.slug,
            cat: match.cat,
            sub: match.sub
        });
    } else {
        unmatchedProblems.push(name);
    }
});

console.log(`Matched ${matchedProblems.length} LeetCode problems.`);
console.log(`Unmatched ${unmatchedProblems.length} problems.`);

// Now we update dsa_striver.json
const striverData = JSON.parse(fs.readFileSync(dsaStriverPath, 'utf8'));

// To avoid duplicate, we build a set of existing slugs and names
const existingNames = new Set();
const existingSlugs = new Set();

for (const cat in striverData) {
    for (const sub in striverData[cat]) {
        striverData[cat][sub].forEach(p => {
            existingNames.add(p.name.toLowerCase());
            if (p.leetcodeUrl) {
                const m = p.leetcodeUrl.match(/leetcode\.com\/problems\/([^\/\?]+)/);
                if (m) existingSlugs.add(m[1].toLowerCase());
            }
        });
    }
}

let addedCount = 0;

matchedProblems.forEach(mp => {
    if (!existingSlugs.has(mp.slug) && !existingNames.has(mp.name.toLowerCase())) {
        const cat = mp.cat || "Arrays & Hashing";
        const sub = mp.sub || "Simulation / General Array";

        if (!striverData[cat]) striverData[cat] = {};
        if (!striverData[cat][sub]) striverData[cat][sub] = [];

        striverData[cat][sub].push({
            name: mp.name,
            leetcodeUrl: `https://leetcode.com/problems/${mp.slug}/`,
            source: "https://takeuforward.org/strivers-a2z-dsa-course",
            leetcodeId: ""
        });
        
        existingSlugs.add(mp.slug);
        existingNames.add(mp.name.toLowerCase());
        addedCount++;
    }
});

fs.writeFileSync(dsaStriverPath, JSON.stringify(striverData, null, 2));

console.log(`Successfully added ${addedCount} new problems to dsa_striver.json.`);
