import { useState, useEffect, useMemo } from 'react'

/* ── Types ── */
interface Problem {
  name: string
  leetcodeUrl: string
  leetcodeId: string
  sources: string[]
  difficulty: string
  alternatePatterns?: string[]
  recommended?: boolean
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
  'https://www.algoexpert.io/questions': 'AlgoExpert',
  'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z': 'Striver',
  'https://www.educative.io/courses/grokking-coding-interview': 'Educative',
  'https://www.educative.io/courses/grokking-dynamic-programming-interview': 'Educative DP',
}

/* Source definitions for filtering */
interface SourceDef {
  key: string
  label: string
  matcher: (s: string) => boolean
  color: string
}

const SOURCE_DEFS: SourceDef[] = [
  { key: 'neetcode', label: 'NeetCode', matcher: s => s.includes('neetcode'), color: '#f59e0b' },
  { key: 'thita', label: 'Thita', matcher: s => s.includes('thita'), color: '#10b981' },
  { key: 'algomaster', label: 'AlgoMaster', matcher: s => s.includes('algomaster'), color: '#3b82f6' },
  { key: 'algoexpert', label: 'AlgoExpert', matcher: s => s.includes('algoexpert'), color: '#ef4444' },
  { key: 'educative', label: 'Educative', matcher: s => s.includes('educative') || s.includes('grokking'), color: '#ec4899' },
  { key: 'striver', label: 'TUF (Striver)', matcher: s => s.includes('takeuforward'), color: '#8b5cf6' },
]

function App() {
  const [data, setData] = useState<MergedData | null>(null)
  const [openCats, setOpenCats] = useState<Set<string>>(new Set())
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set())
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('All')
  const [catFilter, setCatFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<Set<string>>(new Set())
  const [picksFilter, setPicksFilter] = useState(false)

  useEffect(() => {
    fetch('/merged_dsa.json')
      .then(r => r.json())
      .then(d => setData(d))
  }, [])

  /* ── Helper: does problem match a source key? ── */
  const problemMatchesSource = (p: Problem, srcKey: string): boolean => {
    const def = SOURCE_DEFS.find(s => s.key === srcKey)
    if (!def) return false
    return p.sources.some(def.matcher)
  }

  /* ── Global stats (unfiltered, for reference) ── */
  const globalStats = useMemo(() => {
    if (!data) return null
    let total = 0
    const srcCounts: Record<string, number> = {}
    SOURCE_DEFS.forEach(s => srcCounts[s.key] = 0)

    for (const cat in data) {
      for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
          total++
          SOURCE_DEFS.forEach(sd => {
            if (p.sources.some(sd.matcher)) srcCounts[sd.key]++
          })
        }
      }
    }
    return { total, srcCounts }
  }, [data])

  /* ── Base-filtered data: category + difficulty + search, but NO source filter ── */
  /* This is used to calculate how many problems each source would contribute */
  const baseFilteredProblems = useMemo(() => {
    if (!data) return [] as Problem[]
    const q = search.toLowerCase().trim()
    const result: Problem[] = []

    for (const cat in data) {
      if (catFilter !== 'All' && cat !== catFilter) continue
      for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
          if (diffFilter !== 'All' && p.difficulty !== diffFilter) continue
          if (q && !p.name.toLowerCase().includes(q)) continue
          if (picksFilter && !p.recommended) continue
          result.push(p)
        }
      }
    }
    return result
  }, [data, diffFilter, catFilter, search, picksFilter])

  /* ── Stats from base-filtered (for source chip counts) ── */
  const baseStats = useMemo(() => {
    let total = 0
    let easy = 0, medium = 0, hard = 0, unknown = 0
    const srcCounts: Record<string, number> = {}
    SOURCE_DEFS.forEach(s => srcCounts[s.key] = 0)

    for (const p of baseFilteredProblems) {
      total++
      if (p.difficulty === 'Easy') easy++
      else if (p.difficulty === 'Medium') medium++
      else if (p.difficulty === 'Hard') hard++
      else unknown++
      SOURCE_DEFS.forEach(sd => {
        if (p.sources.some(sd.matcher)) srcCounts[sd.key]++
      })
    }
    return { total, easy, medium, hard, unknown, srcCounts }
  }, [baseFilteredProblems])

  /* ── Toggle source filter ── */
  const toggleSource = (key: string) => {
    setSourceFilter(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  /* ── Clear all source filters ── */
  const clearSourceFilters = () => {
    setSourceFilter(new Set())
  }

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

        // Source filter (AND logic: problem must appear in ALL selected sources)
        if (sourceFilter.size > 0) {
          problems = problems.filter(p => {
            for (const srcKey of sourceFilter) {
              if (!problemMatchesSource(p, srcKey)) return false
            }
            return true
          })
        }

        // Picks filter
        if (picksFilter) {
          problems = problems.filter(p => p.recommended)
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
  }, [data, diffFilter, catFilter, search, sourceFilter, picksFilter])

  /* ── Filtered count ── */
  const filteredCount = useMemo(() => {
    if (!filteredData) return 0
    let c = 0
    for (const cat in filteredData)
      for (const sub in filteredData[cat])
        c += filteredData[cat][sub].length
    return c
  }, [filteredData])

  /* ── Filtered stats (all filters including source — for total and difficulty counts display) ── */
  const filteredStats = useMemo(() => {
    if (!filteredData) return null
    let total = 0
    let easy = 0, medium = 0, hard = 0, unknown = 0
    const srcCounts: Record<string, number> = {}
    SOURCE_DEFS.forEach(s => srcCounts[s.key] = 0)

    for (const cat in filteredData) {
      for (const sub in filteredData[cat]) {
        for (const p of filteredData[cat][sub]) {
          total++
          if (p.difficulty === 'Easy') easy++
          else if (p.difficulty === 'Medium') medium++
          else if (p.difficulty === 'Hard') hard++
          else unknown++
          SOURCE_DEFS.forEach(sd => {
            if (p.sources.some(sd.matcher)) srcCounts[sd.key]++
          })
        }
      }
    }
    return { total, easy, medium, hard, unknown, srcCounts }
  }, [filteredData])

  /* ── Category counts for the dropdown (respecting current filters except category) ── */
  const categoryCounts = useMemo(() => {
    if (!data) return {} as Record<string, number>
    const q = search.toLowerCase().trim()
    const counts: Record<string, number> = {}

    for (const cat in data) {
      let catTotal = 0
      for (const sub in data[cat]) {
        for (const p of data[cat][sub]) {
          if (diffFilter !== 'All' && p.difficulty !== diffFilter) continue
          if (q && !p.name.toLowerCase().includes(q)) continue
          if (sourceFilter.size > 0) {
            let matchesAll = true
            for (const srcKey of sourceFilter) {
              if (!problemMatchesSource(p, srcKey)) { matchesAll = false; break }
            }
            if (!matchesAll) continue
          }
          if (picksFilter && !p.recommended) continue
          catTotal++
        }
      }
      counts[cat] = catTotal
    }
    return counts
  }, [data, diffFilter, search, sourceFilter, picksFilter])

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

  const hasActiveFilters = diffFilter !== 'All' || search || sourceFilter.size > 0 || catFilter !== 'All' || picksFilter

  if (!data || !globalStats || !filteredData || !filteredStats || !baseStats) {
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
          {hasActiveFilters ? `${filteredCount} of ${globalStats.total}` : globalStats.total} problems from 6 curated sources <br />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Problems updated every 6 months)</span>
        </p>
      </header>

      {/* Stats / Source Filter Bar */}
      <div className="stats-bar">
        <span
          className={`stat-chip total-chip ${sourceFilter.size === 0 ? 'active' : ''}`}
          onClick={clearSourceFilters}
          title="Click to clear source filters"
        >
          <span className="count">{sourceFilter.size > 0 ? filteredCount : baseStats.total}</span> Total
        </span>
        {SOURCE_DEFS.map(sd => {
          const isActive = sourceFilter.has(sd.key)
          const count = baseStats.srcCounts[sd.key]
          return (
            <span
              key={sd.key}
              className={`stat-chip source-chip ${isActive ? 'active' : ''}`}
              onClick={() => toggleSource(sd.key)}
              style={{
                '--chip-color': sd.color,
                '--chip-bg': `${sd.color}22`,
                '--chip-border': isActive ? sd.color : undefined,
              } as React.CSSProperties}
              title={isActive ? `Click to remove ${sd.label} filter` : `Click to filter by ${sd.label}`}
            >
              <span className="count" style={{ color: sd.color }}>{count}</span> {sd.label}
              {isActive && <span className="chip-check">✓</span>}
            </span>
          )
        })}
      </div>

      {/* Active source filter hint */}
      {sourceFilter.size > 0 && (
        <div className="source-filter-hint">
          <span>Showing problems in: <strong>{Array.from(sourceFilter).map(k => SOURCE_DEFS.find(s => s.key === k)?.label).join(' ∩ ')}</strong></span>
          <button className="clear-filter-btn" onClick={clearSourceFilters}>Clear ✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <select
          className="cat-select"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="All">All Categories ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})</option>
          {categoriesList.map(c => (
            <option key={c} value={c}>{c} ({categoryCounts[c] ?? 0})</option>
          ))}
        </select>

        <div className="diff-buttons">
          {(['All', 'Easy', 'Medium', 'Hard', 'Unknown'] as DifficultyFilter[]).map(d => {
            const countVal = d === 'All'
              ? filteredCount
              : (filteredStats?.[d.toLowerCase() as keyof typeof filteredStats] ?? 0)
            return (
              <button
                key={d}
                className={`filter-btn ${d.toLowerCase()} ${diffFilter === d ? 'active' : ''}`}
                onClick={() => setDiffFilter(d)}
              >
                {d} ({countVal as number})
              </button>
            )
          })}
        </div>

        {/* BigTechDsa Picks Toggle */}
        <button
          className={`filter-btn picks ${picksFilter ? 'active' : ''}`}
          onClick={() => setPicksFilter(f => !f)}
          title={picksFilter ? 'Showing curated picks — click to show all' : 'Show only BigTechDsa curated picks (399)'}
        >
          ★ BigTechDsa Picks {picksFilter && '✓'}
        </button>
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
        {hasActiveFilters && (
          <p className="results-count">
            Showing {filteredCount} of {globalStats.total} problems
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
                                        {p.recommended && <span className="pick-star" title="BigTechDsa Pick">★ </span>}
                                        {p.name}
                                      </a>
                                    ) : (
                                      <span className="problem-name no-link" title={p.name}>
                                        {p.recommended && <span className="pick-star" title="BigTechDsa Pick">★ </span>}
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
                                          s.includes('algoexpert') ? 'AE' :
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
          materials belong to their respective platforms (LeetCode, NeetCode, Striver/TUF, AlgoMaster, AlgoExpert, Thita, Educative).
        </p>
      </footer>
    </>
  )
}

export default App
