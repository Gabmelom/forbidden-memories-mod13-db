import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '../components/SearchInput'
import { duelists } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'

export function DuelistsPage() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query)
    return normalizedQuery ? duelists.filter((duelist) => normalizeSearch(duelist.name).includes(normalizedQuery)) : duelists
  }, [query])

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Opponent database</p><h1>Duelists</h1></div><span className="result-count">{results.length} {results.length === 1 ? 'duelist' : 'duelists'}</span></div>
      <SearchInput id="duelist-search" label="Search duelists" placeholder="Search duelists..." value={query} onChange={setQuery} />
      {results.length ? (
        <div className="result-list duelist-list">
          {results.map((duelist) => <Link className="result-row" key={duelist.id} to={`/duelists/${duelist.slug}`}><div><strong>{duelist.name}</strong><span className="list-subtitle">View rank pools and drops</span></div><span className="row-arrow" aria-hidden="true">→</span></Link>)}
        </div>
      ) : <div className="empty-state">No duelists found.</div>}
    </section>
  )
}
