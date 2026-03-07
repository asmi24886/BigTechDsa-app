import { useState, useEffect, useMemo } from 'react'

/* ── Types ── */
interface Problem {
  name: string
  leetcodeUrl: string
  leetcodeId: string
  sources: string[]
  difficulty: string
  alternatePatterns?: string[]
}

type MergedData = Record<string, Record<string, Problem[]>>

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard' | 'Unknown'

const DIFF_ORDER: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Unknown: 3,
}



const SOURCE_NAME: Record<string, string> = {
  'https://neetcode.io': 'NeetCode',
  'https://thita.io': 'Thita',
  'https://algomaster.io': 'Algomaster',
  'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z': 'Striver',
  'https://www.educative.io/courses/grokking-coding-interview': 'Educative',
  'https://www.educative.io/courses/grokking-dynamic-programming-interview': 'Educative DP',
}

function App() {
  const [data, setData] = useState<MergedData | null>(null)
  const [openCats, setOpenCats] = useState<Set<string>>(new Set())
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set())
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('All')
  const [catFilter, setCatFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/merged_dsa.json')
      .then(r => r.json())
      .then(d => setData(d))
  }, [])

  /* ── Global stats ── */
  const stats = useMemo(() => {
    if (!data) return null
    let total = 0
    let easy = 0, medium = 0, hard = 0, unknown = 0 // Keep difficulty for filters
    let srcNeetcode = 0
    let srcThita = 0
    let srcAlgomaster = 0
    let srcEducative = 0
    let srcStriver = 0

    for (const cat in data) {
      for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
          total++
          // Difficulty metrics needed for the filter buttons
          if (p.difficulty === 'Easy') easy++
          else if (p.difficulty === 'Medium') medium++
          else if (p.difficulty === 'Hard') hard++
          else unknown++

          // Source occurrences
          if (p.sources.some(s => s.includes('neetcode'))) srcNeetcode++
          if (p.sources.some(s => s.includes('thita'))) srcThita++
          if (p.sources.some(s => s.includes('algomaster'))) srcAlgomaster++
          if (p.sources.some(s => s.includes('educative') || s.includes('grokking'))) srcEducative++
          if (p.sources.some(s => s.includes('takeuforward'))) srcStriver++
        }
      }
    }
    return { total, easy, medium, hard, unknown, srcNeetcode, srcThita, srcAlgomaster, srcEducative, srcStriver }
  }, [data])

  /* ── Filter + search logic ── */
  const filteredData = useMemo(() => {
    if (!data) return null
    const q = search.toLowerCase().trim()
    const result: MergedData = {}

    for (const cat in data) {
      if (catFilter !== 'All' && cat !== catFilter) continue

      const filteredCat: Record<string, Problem[]> = {}
      for (const sub in data[cat]) {
        let problems = data[cat][sub]

        // Difficulty filter
        if (diffFilter !== 'All') {
          problems = problems.filter(p => p.difficulty === diffFilter)
        }

        // Search filter
        if (q) {
          problems = problems.filter(p => p.name.toLowerCase().includes(q))
        }

        // Sort by difficulty
        problems = [...problems].sort(
          (a, b) => (DIFF_ORDER[a.difficulty] ?? 3) - (DIFF_ORDER[b.difficulty] ?? 3)
        )

        if (problems.length > 0) {
          filteredCat[sub] = problems
        }
      }
      if (Object.keys(filteredCat).length > 0) {
        result[cat] = filteredCat
      }
    }
    return result
  }, [data, diffFilter, catFilter, search])

  /* ── Filtered count ── */
  const filteredCount = useMemo(() => {
    if (!filteredData) return 0
    let c = 0
    for (const cat in filteredData)
      for (const sub in filteredData[cat])
        c += filteredData[cat][sub].length
    return c
  }, [filteredData])

  /* ── Categories List ── */
  const categoriesList = useMemo(() => {
    if (!data) return []
    return Object.keys(data).sort()
  }, [data])

  /* ── Toggle helpers ── */
  const toggleCat = (cat: string) => {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const toggleSub = (key: string) => {
    setOpenSubs(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const expandAll = () => {
    if (!filteredData) return
    const allCats = new Set<string>()
    const allSubs = new Set<string>()
    for (const cat in filteredData) {
      allCats.add(cat)
      for (const sub in filteredData[cat]) {
        allSubs.add(`${cat}::${sub}`)
      }
    }
    setOpenCats(allCats)
    setOpenSubs(allSubs)
  }

  const collapseAll = () => {
    setOpenCats(new Set())
    setOpenSubs(new Set())
  }

  if (!data || !stats || !filteredData) {
    return (
      <div className="empty-state">
        <p>Loading problems…</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <h1>Big Tech DSA</h1>
        <p>
          {stats.total} problems from 5 curated sources <br />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Problems updated every 6 months)</span>
        </p>
      </header>

      {/* Stats */}
      <div className="stats-bar">
        <span className="stat-chip">
          <span className="count">{stats.total}</span> Total
        </span>
        <span className="stat-chip">
          <span className="count" style={{ color: '#f59e0b' }}>{stats.srcNeetcode}</span> NeetCode
        </span>
        <span className="stat-chip">
          <span className="count" style={{ color: '#10b981' }}>{stats.srcThita}</span> Thita
        </span>
        <span className="stat-chip">
          <span className="count" style={{ color: '#3b82f6' }}>{stats.srcAlgomaster}</span> AlgoMaster
        </span>
        <span className="stat-chip">
          <span className="count" style={{ color: '#ec4899' }}>{stats.srcEducative}</span> Educative
        </span>
        <span className="stat-chip">
          <span className="count" style={{ color: '#8b5cf6' }}>{stats.srcStriver}</span> TUF (Striver)
        </span>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <select
          className="cat-select"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="All">All Categories ({stats.total})</option>
          {categoriesList.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="diff-buttons">
          {(['All', 'Easy', 'Medium', 'Hard', 'Unknown'] as DifficultyFilter[]).map(d => (
            <button
              key={d}
              className={`filter-btn ${d.toLowerCase()} ${diffFilter === d ? 'active' : ''}`}
              onClick={() => setDiffFilter(d)}
            >
              {d}
              {d !== 'All' && ` (${stats[d.toLowerCase() as keyof typeof stats]})`}
              {d === 'All' && ` (${stats.total})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Search problems…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Expand/Collapse Controls & Result count */}
      <div className="controls-row">
        {(diffFilter !== 'All' || search) && (
          <p className="results-count">
            Showing {filteredCount} of {stats.total} problems
          </p>
        )}
        <div className="expand-controls">
          <button className="expand-btn" onClick={expandAll}>Expand All</button>
          <button className="expand-btn" onClick={collapseAll}>Collapse All</button>
        </div>
      </div>

      {/* Categories */}
      {Object.keys(filteredData).length === 0 ? (
        <div className="empty-state">No problems match your filters.</div>
      ) : (
        Object.entries(filteredData).map(([cat, subs]) => {
          const catOpen = openCats.has(cat)
          const catCount = Object.values(subs).reduce((s, arr) => s + arr.length, 0)

          return (
            <div className="category" key={cat}>
              <div
                className={`category-header ${catOpen ? 'open' : ''}`}
                onClick={() => toggleCat(cat)}
              >
                <span className="category-name">
                  {cat}
                  <span className="category-count">{catCount}</span>
                </span>
                <span className={`chevron ${catOpen ? 'open' : ''}`}>▼</span>
              </div>

              {catOpen && (
                <div className="category-body">
                  {Object.entries(subs).map(([sub, problems]) => {
                    const subKey = `${cat}::${sub}`
                    const subOpen = openSubs.has(subKey)

                    return (
                      <div className="subcategory" key={subKey}>
                        <div
                          className="subcategory-header"
                          onClick={() => toggleSub(subKey)}
                        >
                          <span className="subcategory-name">
                            <span className={`sub-chevron ${subOpen ? 'open' : ''}`}>▶</span>
                            {sub}
                          </span>
                          <span className="subcategory-count">{problems.length}</span>
                        </div>

                        {subOpen && (
                          <div className="problem-list">
                            {problems.map((p, i) => (
                              <div className="problem-item" key={i}>
                                <div className="problem-left">
                                  <span className={`diff-badge ${p.difficulty.toLowerCase()}`}>
                                    {p.difficulty === 'Unknown' ? '?' : p.difficulty[0]}
                                  </span>
                                  <div className="problem-info">
                                    {p.leetcodeUrl ? (
                                      <a
                                        className="problem-name"
                                        href={p.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={p.name}
                                      >
                                        {p.name}
                                      </a>
                                    ) : (
                                      <span className="problem-name no-link" title={p.name}>
                                        {p.name}
                                      </span>
                                    )}
                                    {p.alternatePatterns && p.alternatePatterns.length > 0 && (
                                      <div className="pattern-tags">
                                        <span className="pattern-label">Also:</span>
                                        {p.alternatePatterns.map((pat, idx) => (
                                          <span key={idx} className="pattern-tag">{pat}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="source-badges">
                                  {p.sources.map((s, j) => {
                                    const shortName = s.includes('neetcode') ? 'NC' :
                                      s.includes('thita') ? 'TH' :
                                        s.includes('algomaster') ? 'AM' :
                                          s.includes('takeuforward') ? 'TU' :
                                            s.includes('grokking-dynamic-programming') ? 'EDP' :
                                              s.includes('educative') ? 'ED' : 'SRC';
                                    return (
                                      <a
                                        key={j}
                                        href={s}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`source-badge ${shortName.toLowerCase()}`}
                                        title={SOURCE_NAME[s] || s}
                                      >
                                        {shortName}
                                      </a>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Footer Disclaimer */}
      <footer className="footer-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This project is a personal study tool and an aggregation
          of Data Structures and Algorithms problems that are freely available online. It does not contain
          paywalled or premium content, nor is it an act of piracy or theft. All rights and original
          materials belong to their respective platforms (LeetCode, NeetCode, Striver/TUF, AlgoMaster, Thita, Educative).
        </p>
      </footer>
    </>
  )
}

export default App
