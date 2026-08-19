import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DuelistImage } from '../components/DuelistImage'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { SearchInput } from '../components/SearchInput'
import { DROP_RANKS } from '../types'
import { duelists } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'
import { DuelistDetailPage } from './DuelistDetailPage'

export function DuelistsPage() {
  const { duelistSlug } = useParams()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const selectedRowRef = useRef<HTMLAnchorElement>(null)
  const initialSelectedSlug = useRef(duelistSlug)
  const revealedInitialSelection = useRef(false)
  const rankParam = searchParams.get('rank')
  const preservedRank = DROP_RANKS.some((rank) => rank === rankParam) ? rankParam : null

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query)
    return normalizedQuery
      ? duelists.filter((duelist) => normalizeSearch(duelist.name).includes(normalizedQuery))
      : duelists
  }, [query])

  useEffect(() => {
    if (
      initialSelectedSlug.current &&
      duelistSlug === initialSelectedSlug.current &&
      !revealedInitialSelection.current &&
      selectedRowRef.current
    ) {
      selectedRowRef.current.scrollIntoView({ block: 'nearest' })
      revealedInitialSelection.current = true
    }
  }, [duelistSlug, results])

  const master = (
    <div className="catalog-pane-content">
      <header className="catalog-header">
        <div className="catalog-title-row"><div><p className="eyebrow">Opponent database</p><h1>Duelists</h1></div><span>{results.length}</span></div>
        <SearchInput id="duelist-search" label="Search duelists" placeholder="Search duelists..." value={query} onChange={setQuery} />
      </header>
      {results.length ? (
        <div className="catalog-list" aria-label="Duelist results">
          {results.map((duelist) => {
            const isSelected = duelist.slug === duelistSlug
            const destination = `/duelists/${duelist.slug}${preservedRank ? `?rank=${preservedRank}` : ''}`
            return (
              <Link
                ref={isSelected ? selectedRowRef : undefined}
                className={`catalog-row duelist-catalog-row${isSelected ? ' selected' : ''}`}
                key={duelist.id}
                to={destination}
                aria-current={isSelected ? 'page' : undefined}
              >
                <DuelistImage slug={duelist.slug} name={duelist.name} size="medium" decorative />
                <span className="duelist-result-text"><strong>{duelist.name}</strong><span className="list-subtitle">View rank pools and drops</span></span>
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      ) : <div className="catalog-empty">No duelists found.</div>}
    </div>
  )

  const detail = duelistSlug ? (
    <DuelistDetailPage />
  ) : (
    <div className="workspace-empty-state"><div><span aria-hidden="true">♙</span><h2>Select a duelist</h2><p>Choose a duelist from the catalog to inspect their Mod 13 drop pools.</p></div></div>
  )

  return <MasterDetailLayout master={master} detail={detail} hasSelection={Boolean(duelistSlug)} selectionKey={duelistSlug} masterLabel="Duelist catalog" detailLabel="Duelist details" />
}
