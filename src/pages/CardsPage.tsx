import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardSummary } from '../components/CardSummary'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { SearchInput } from '../components/SearchInput'
import type { CardTypeFilter } from '../types'
import { cards } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'
import { CardDetailPage } from './CardDetailPage'

type CardCatalogSort = 'id' | 'name' | 'atk' | 'type'

export function CardsPage() {
  const { cardId } = useParams()
  const selectedCardId = Number(cardId)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<CardTypeFilter>('all')
  const [sort, setSort] = useState<CardCatalogSort>('id')
  const selectedRowRef = useRef<HTMLAnchorElement>(null)
  const initialSelectedId = useRef(cardId)
  const revealedInitialSelection = useRef(false)

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query)
    const filtered = cards.filter((card) => {
      if (normalizedQuery && !normalizeSearch(`${card.name} ${card.id}`).includes(normalizedQuery)) return false
      if (typeFilter === 'monsters') return card.atk !== null || card.def !== null
      if (typeFilter === 'magic') return card.type === 'Magic'
      if (typeFilter === 'trap') return card.type === 'Trap'
      return true
    })
    return [...filtered].sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name)
      if (sort === 'type') return left.type.localeCompare(right.type) || left.name.localeCompare(right.name)
      if (sort === 'atk') {
        if (left.atk === null) return right.atk === null ? left.name.localeCompare(right.name) : 1
        if (right.atk === null) return -1
        return right.atk - left.atk || left.name.localeCompare(right.name)
      }
      return left.id - right.id
    })
  }, [query, sort, typeFilter])

  useEffect(() => {
    if (
      initialSelectedId.current &&
      cardId === initialSelectedId.current &&
      !revealedInitialSelection.current &&
      selectedRowRef.current
    ) {
      selectedRowRef.current.scrollIntoView({ block: 'nearest' })
      revealedInitialSelection.current = true
    }
  }, [cardId, results])

  const master = (
    <div className="catalog-pane-content">
      <header className="catalog-header">
        <div className="catalog-title-row"><div><p className="eyebrow">Card database</p><h1>Cards</h1></div><span>{results.length}</span></div>
        <SearchInput id="card-search" label="Search cards" placeholder="Search cards by name or ID..." value={query} onChange={setQuery} />
        <div className="catalog-controls">
          <label className="select-control"><span>Type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as CardTypeFilter)}><option value="all">All</option><option value="monsters">Monsters</option><option value="magic">Magic</option><option value="trap">Trap</option></select></label>
          <label className="select-control"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as CardCatalogSort)}><option value="id">Card ID</option><option value="name">Card name</option><option value="atk">ATK</option><option value="type">Type</option></select></label>
        </div>
      </header>
      {results.length ? (
        <div className="catalog-list" aria-label="Card results">
          {results.map((card) => {
            const isSelected = card.id === selectedCardId
            return (
              <Link
                ref={isSelected ? selectedRowRef : undefined}
                className={`catalog-row${isSelected ? ' selected' : ''}`}
                key={card.id}
                to={`/cards/${card.id}`}
                aria-current={isSelected ? 'page' : undefined}
              >
                <CardSummary card={card} compact />
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      ) : <div className="catalog-empty">No cards found.</div>}
    </div>
  )

  const detail = cardId ? (
    <CardDetailPage />
  ) : (
    <div className="workspace-empty-state"><div><span aria-hidden="true">▱</span><h2>Select a card</h2><p>Choose a card from the catalog to see its stats, artwork, and Mod 13 drop sources.</p></div></div>
  )

  return <MasterDetailLayout master={master} detail={detail} hasSelection={Boolean(cardId)} selectionKey={cardId} masterLabel="Card catalog" detailLabel="Card details" />
}
