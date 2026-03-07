# Big Tech DSA

A comprehensive aggregation of LeetCode, NeetCode, Thita, Striver (TUF), Algomaster, and Educative.io DSA problem sets in one place.

## Features
- Over 1,300 unique DSA problems.
- Deduplicated results (LeetCode-based matching).
- Mapped to 15 canonical categories and 171 sub-categories.
- Difficulty tracking (94% coverage).
- Linked directly to LeetCode and the original curated source.
- Alternate solving patterns (e.g., Stack vs. Two Pointers).
- Dark/Terracotta themed interactive dashboard with category filtering, difficulty toggles, and search.

## Technology Stack
- **Frontend**: React, TypeScript, Vite.
- **Data Pipeline**: Node.js, Cheerio (for parsing sources).
- **Styling**: Vanilla CSS (Custom Terracotta theme).

## Project Structure
```text
├── data/dsa/           # Enriched problem datasets (JSON)
├── scripts/            # Data extraction and processing pipeline
└── web/                # React dashboard source code
```

## Running Locally
### Prerequisites
- Node.js (v18+)

### Steps
1. Clone the repository.
2. Navigate to the `web` directory: `cd web`.
3. Install dependencies: `npm install`.
4. Run the development server: `npm run dev`.
5. Access the app at `http://localhost:5173`.

## Disclaimer
This project is an aggregation of DSA problems that are freely available online. It does not contain paywalled or premium content, nor is it an act of piracy or theft. All rights and original materials belong to their respective platforms.
