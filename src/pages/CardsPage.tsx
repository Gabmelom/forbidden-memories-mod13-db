import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardSummary } from '../components/CardSummary'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { SearchInput } from '../components/SearchInput'
import { AdvancedCardFilters } from '../components/cards/AdvancedCardFilters'
import { useMod } from '../context/ModContext'
import {
  EMPTY_ADVANCED_CARD_FILTERS,
  countActiveAdvancedFilters,
  filterCards,
  getAvailableAttributes,
  getAvailableCardTypes,
  getAvailableGuardianStars,
  getNumericRange,
} from '../utils/cardFilters'
import { CardDetailPage } from './CardDetailPage'

type CardCatalogSort = 'id' | 'name' | 'atk' | 'type'

export function CardsPage() {
  const { cardId } = useParams()
  const { mod, data } = useMod()
  const { cards } = data
  const selectedCardId = Number(cardId)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sort, setSort] = useState<CardCatalogSort>('id')
  const [advancedFilters, setAdvancedFilters] = useState(() => ({ ...EMPTY_ADVANCED_CARD_FILTERS }))
  const selectedRowRef = useRef<HTMLAnchorElement>(null)
  const initialSelectedId = useRef(cardId)
  const revealedInitialSelection = useRef(false)
  const attributes = useMemo(() => getAvailableAttributes(cards), [cards])
  const guardianStars = useMemo(() => getAvailableGuardianStars(cards), [cards])
  const cardTypes = useMemo(() => getAvailableCardTypes(cards), [cards])
  const attackRange = useMemo(() => getNumericRange(cards, 'atk'), [cards])
  const defenseRange = useMemo(() => getNumericRange(cards, 'def'), [cards])
  const levelRange = useMemo(() => getNumericRange(cards, 'level'), [cards])
  const activeAdvancedCount = countActiveAdvancedFilters(advancedFilters)
  const hasActiveFilters = Boolean(query.trim()) || typeFilter !== 'all' || activeAdvancedCount > 0

  const results = useMemo(() => {
    const filtered = filterCards(cards, { search: query, type: typeFilter, advanced: advancedFilters })
    return [...filtered].sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name)
      if (sort === 'type') return (left.type ?? '').localeCompare(right.type ?? '') || left.name.localeCompare(right.name)
      if (sort === 'atk') {
        if (left.atk === null) return right.atk === null ? left.name.localeCompare(right.name) : 1
        if (right.atk === null) return -1
        return right.atk - left.atk || left.name.localeCompare(right.name)
      }
      return left.id - right.id
    })
  }, [advancedFilters, cards, query, sort, typeFilter])

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

  const clearAllFilters = () => {
    setQuery('')
    setTypeFilter('all')
    setAdvancedFilters({ ...EMPTY_ADVANCED_CARD_FILTERS })
  }

  const master = (
    <div className="catalog-pane-content">
      <header className="catalog-header">
        <div className="catalog-title-row"><div><p className="eyebrow">Card database</p><h1>Cards</h1></div><span>{hasActiveFilters ? `${results.length} / ${cards.length}` : cards.length}</span></div>
        <SearchInput id="card-search" label="Search cards" placeholder="Search cards by name or ID..." value={query} onChange={setQuery} />
        <div className="catalog-controls">
          <label className="select-control"><span>Type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All</option><option value="monsters">Monsters</option>{cardTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label className="select-control"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as CardCatalogSort)}><option value="id">Card ID</option><option value="name">Card name</option><option value="atk">ATK</option><option value="type">Type</option></select></label>
        </div>
        <AdvancedCardFilters
          filters={advancedFilters}
          attributes={attributes}
          guardianStars={guardianStars}
          attackRange={attackRange}
          defenseRange={defenseRange}
          levelRange={levelRange}
          onChange={setAdvancedFilters}
        />
      </header>
      {results.length ? (
        <div className="catalog-list card-catalog-grid" aria-label="Card results">
          {results.map((card) => {
            const isSelected = card.id === selectedCardId
            return (
              <Link
                ref={isSelected ? selectedRowRef : undefined}
                className={`catalog-row card-catalog-tile${isSelected ? ' selected' : ''}`}
                key={card.id}
                to={`/${mod.id}/cards/${card.id}`}
                aria-current={isSelected ? 'page' : undefined}
                aria-label={`#${card.id} ${card.name}`}
                title={`#${card.id} ${card.name}`}
              >
                <CardSummary card={card} grid />
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      ) : cards.length === 0 ? (
        <div className="catalog-empty">{mod.emptyDataMessage ?? `No card data is available for ${mod.label}.`}</div>
      ) : <div className="catalog-empty"><p>No cards match these filters.</p><button type="button" className="clear-catalog-filters" onClick={clearAllFilters}>Clear filters</button></div>}
    </div>
  )

  const detail = cardId ? (
    <CardDetailPage />
  ) : (
    <div className="workspace-empty-state"><div><span aria-hidden="true">▱</span><h2>{cards.length ? 'Select a card' : `${mod.label} cards`}</h2><p>{cards.length ? `Choose a card from the catalog to see its stats, artwork, and ${mod.label} drop sources.` : (mod.emptyDataMessage ?? `No card data is available for ${mod.label}.`)}</p></div></div>
  )

  return <MasterDetailLayout master={master} detail={detail} hasSelection={Boolean(cardId)} selectionKey={cardId} masterLabel="Card catalog" detailLabel="Card details" className="card-workspace" />
}
