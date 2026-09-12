import { useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CardFactIcon, type CardFactIconName } from '../components/CardFactIcon'
import { DropRate } from '../components/DropRate'
import { CardImage } from '../components/CardImage'
import { CardTypeLabel } from '../components/CardTypeLabel'
import { DuelistImage } from '../components/DuelistImage'
import { ImagePreviewModal } from '../components/ImagePreviewModal'
import { SearchInput } from '../components/SearchInput'
import { useMod } from '../context/ModContext'
import { DROP_RANKS, type CardTypeFilter, type DropRank } from '../types'
import type { CardDropRow } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'
import { RANK_LABELS } from '../utils/rankLabels'

type DuelistDropSortKey = 'card' | 'type' | 'atk' | 'def' | 'weight' | 'duel'
type SortDirection = 'asc' | 'desc'

interface DuelistDropSort {
  key: DuelistDropSortKey
  direction: SortDirection
}

const DEFAULT_SORT_DIRECTIONS: Record<DuelistDropSortKey, SortDirection> = {
  card: 'asc',
  type: 'asc',
  atk: 'desc',
  def: 'desc',
  weight: 'desc',
  duel: 'desc',
}

function compareNullableNumbers(left: number | null, right: number | null, direction: SortDirection): number {
  if (left === null) return right === null ? 0 : 1
  if (right === null) return -1
  return direction === 'asc' ? left - right : right - left
}

function sortDuelistDrops(rows: CardDropRow[], sort: DuelistDropSort): CardDropRow[] {
  return [...rows].sort((left, right) => {
    let comparison = 0
    if (sort.key === 'card') comparison = left.card.name.localeCompare(right.card.name)
    else if (sort.key === 'type') comparison = (left.card.type ?? '').localeCompare(right.card.type ?? '')
    else if (sort.key === 'atk') comparison = compareNullableNumbers(left.card.atk, right.card.atk, sort.direction)
    else if (sort.key === 'def') comparison = compareNullableNumbers(left.card.def, right.card.def, sort.direction)
    else comparison = sort.direction === 'asc' ? left.drop.weight - right.drop.weight : right.drop.weight - left.drop.weight

    if (sort.key === 'card' || sort.key === 'type') comparison *= sort.direction === 'asc' ? 1 : -1
    return comparison || left.card.name.localeCompare(right.card.name)
  })
}

function SortableColumnHeader({ label, sortKey, sort, onSort, icon }: { label: string; sortKey: DuelistDropSortKey; sort: DuelistDropSort; onSort: (key: DuelistDropSortKey) => void; icon?: CardFactIconName }) {
  const isActive = sort.key === sortKey
  return (
    <th aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button type="button" className={isActive ? 'active' : ''} onClick={() => onSort(sortKey)}>
        <span className="sortable-column-label">{icon && <CardFactIcon name={icon} />}{label}</span>
        <span className="sort-direction" aria-hidden="true">{isActive ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )
}

function isDropRank(value: string | null): value is DropRank {
  return DROP_RANKS.some((rank) => rank === value)
}

export function DuelistDetailPage() {
  const { duelistSlug = '' } = useParams()
  const { mod, data } = useMod()
  const { getCardById, getDropsForDuelistAndRank, getDuelistBySlug } = data
  const [searchParams, setSearchParams] = useSearchParams()
  const duelist = getDuelistBySlug(duelistSlug)
  const rankParam = searchParams.get('rank')
  const selectedRank: DropRank = isDropRank(rankParam) ? rankParam : 'SA_POW'
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<DuelistDropSort>({ key: 'weight', direction: 'desc' })
  const [typeFilter, setTypeFilter] = useState<CardTypeFilter>('all')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const previewTriggerRef = useRef<HTMLButtonElement>(null)

  const rows = useMemo(() => {
    if (!duelist) return []
    const normalizedQuery = normalizeSearch(query)
    const joined = getDropsForDuelistAndRank(duelist.id, selectedRank)
      .map((drop) => ({ drop, card: getCardById(drop.cardId) }))
      .filter((row): row is { drop: typeof row.drop; card: NonNullable<typeof row.card> } => Boolean(row.card))
      .filter(({ card }) => {
        if (normalizedQuery && !normalizeSearch(`${card.name} ${card.id}`).includes(normalizedQuery)) return false
        if (typeFilter === 'monsters') return card.atk !== null || card.def !== null
        if (typeFilter === 'magic') return card.type === 'Magic'
        if (typeFilter === 'trap') return card.type === 'Trap'
        return true
      })
    return sortDuelistDrops(joined, sort)
  }, [duelist, getCardById, getDropsForDuelistAndRank, query, selectedRank, sort, typeFilter])

  if (!duelist) return <div className="empty-state not-found"><h1>Duelist not found</h1><Link className="button-link" to={`/${mod.id}/duelists`}>Back to duelists</Link></div>

  const selectRank = (rank: DropRank) => { setSearchParams({ rank }); setQuery('') }
  const selectSort = (key: DuelistDropSortKey) => setSort((current) => current.key === key
    ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    : { key, direction: DEFAULT_SORT_DIRECTIONS[key] })
  const closePreview = () => {
    setIsPreviewOpen(false)
    requestAnimationFrame(() => previewTriggerRef.current?.focus())
  }

  return (
    <article className="workspace-detail-content">
      <Link className="back-link mobile-workspace-back" to={`/${mod.id}/duelists`}>← Duelists</Link>
      <header className="duelist-heading">
        <button ref={previewTriggerRef} type="button" className="duelist-image-trigger" aria-label={`View larger portrait of ${duelist.name}`} onClick={() => setIsPreviewOpen(true)}>
          <DuelistImage slug={duelist.slug} name={duelist.name} size="large" loading="eager" />
        </button>
        <div><p className="eyebrow">Duelist drops</p><h1>{duelist.name}</h1></div>
      </header>
      <div className="rank-tabs" role="tablist" aria-label="Drop rank">
        {DROP_RANKS.map((rank) => <button type="button" role="tab" aria-selected={rank === selectedRank} className={rank === selectedRank ? 'active' : ''} key={rank} onClick={() => selectRank(rank)}>{RANK_LABELS[rank]}</button>)}
      </div>
      <section className="detail-section" role="tabpanel">
        <div className="drop-tools">
          <SearchInput id="duelist-drop-search" label="Search this duelist's drops" placeholder="Search this duelist's drops..." value={query} onChange={setQuery} />
          <div className="filter-row">
            <label className="select-control"><span>Type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as CardTypeFilter)}><option value="all">All</option><option value="monsters">Monsters</option><option value="magic">Magic</option><option value="trap">Trap</option></select></label>
          </div>
        </div>
        {rows.length ? (
          <div className="table-frame"><table className="drop-table duelist-drops">
            <thead><tr>
              <SortableColumnHeader label="Card" sortKey="card" sort={sort} onSort={selectSort} />
              <SortableColumnHeader label="Type" sortKey="type" sort={sort} onSort={selectSort} />
              <SortableColumnHeader label="ATK" sortKey="atk" sort={sort} onSort={selectSort} icon="sword" />
              <SortableColumnHeader label="DEF" sortKey="def" sort={sort} onSort={selectSort} icon="shield" />
              <SortableColumnHeader label="Weight" sortKey="weight" sort={sort} onSort={selectSort} />
              <SortableColumnHeader label="Per duel" sortKey="duel" sort={sort} onSort={selectSort} />
            </tr></thead>
            <tbody>{rows.map(({ card, drop }) => <tr key={card.id}>
              <td data-label="Card"><Link className="table-card-link" to={`/${mod.id}/cards/${card.id}`}><CardImage cardId={card.id} cardName={card.name} size="small" decorative /><span className="table-card-text"><span className="table-card-name">{card.name}</span><span className="table-card-meta">#{card.id}</span></span></Link></td>
              <td data-label="Type"><CardTypeLabel cardType={card.type} /></td>
              <td className="duelist-card-stat" data-label="ATK">{card.atk ?? '—'}</td>
              <td className="duelist-card-stat" data-label="DEF">{card.def ?? '—'}</td>
              <td data-label="Weight"><DropRate weight={drop.weight} part="weight" /></td><td data-label="Per duel"><DropRate weight={drop.weight} part="duel" /></td>
            </tr>)}</tbody>
          </table></div>
        ) : <div className="empty-state">No drops found for this rank.</div>}
      </section>
      {isPreviewOpen && (
        <ImagePreviewModal title={`${duelist.name} portrait preview`} caption={duelist.name} onClose={closePreview}>
          <DuelistImage slug={duelist.slug} name={duelist.name} size="large" loading="eager" />
        </ImagePreviewModal>
      )}
    </article>
  )
}
