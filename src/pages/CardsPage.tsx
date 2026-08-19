import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardSummary } from '../components/CardSummary'
import { SearchInput } from '../components/SearchInput'
import { cards } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'

export function CardsPage() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query)
    if (!normalizedQuery) return cards
    return cards.filter((card) => normalizeSearch(card.name).includes(normalizedQuery) || String(card.id).includes(normalizedQuery))
  }, [query])

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Card database</p><h1>Cards</h1></div><span className="result-count">{results.length} {results.length === 1 ? 'card' : 'cards'}</span></div>
      <SearchInput id="card-search" label="Search cards" placeholder="Search by card name or ID..." value={query} onChange={setQuery} />
      {results.length ? (
        <div className="result-list">
          {results.map((card) => <Link className="result-row" key={card.id} to={`/cards/${card.id}`}><CardSummary card={card} compact /><span className="row-arrow" aria-hidden="true">→</span></Link>)}
        </div>
      ) : <div className="empty-state">No cards found.</div>}
    </section>
  )
}
