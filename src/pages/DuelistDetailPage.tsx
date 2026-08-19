import { useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DropRate } from '../components/DropRate'
import { CardImage } from '../components/CardImage'
import { DuelistImage } from '../components/DuelistImage'
import { ImagePreviewModal } from '../components/ImagePreviewModal'
import { SearchInput } from '../components/SearchInput'
import { SortSelect } from '../components/SortSelect'
import { DROP_RANKS, type CardTypeFilter, type DropRank, type DropSort } from '../types'
import { getCardById, getDropsForDuelistAndRank, getDuelistBySlug, sortCardDropRows } from '../utils/dataLookup'
import { normalizeSearch } from '../utils/search'
import { RANK_LABELS } from '../utils/rankLabels'

function isDropRank(value: string | null): value is DropRank {
  return DROP_RANKS.some((rank) => rank === value)
}

export function DuelistDetailPage() {
  const { duelistSlug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const duelist = getDuelistBySlug(duelistSlug)
  const rankParam = searchParams.get('rank')
  const selectedRank: DropRank = isDropRank(rankParam) ? rankParam : 'SA_POW'
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<DropSort>('rate')
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
    return sortCardDropRows(joined, sort)
  }, [duelist, query, selectedRank, sort, typeFilter])

  if (!duelist) return <div className="empty-state not-found"><h1>Duelist not found</h1><Link className="button-link" to="/duelists">Back to duelists</Link></div>

  const selectRank = (rank: DropRank) => { setSearchParams({ rank }); setQuery('') }
  const closePreview = () => {
    setIsPreviewOpen(false)
    requestAnimationFrame(() => previewTriggerRef.current?.focus())
  }

  return (
    <article>
      <Link className="back-link" to="/duelists">← All duelists</Link>
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
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
        {rows.length ? (
          <div className="table-frame"><table className="drop-table duelist-drops">
            <thead><tr><th>Card</th><th>Weight</th><th>Per reward</th><th>Per duel</th></tr></thead>
            <tbody>{rows.map(({ card, drop }) => <tr key={card.id}>
              <td data-label="Card"><Link className="table-card-link" to={`/cards/${card.id}`}><CardImage cardId={card.id} cardName={card.name} size="small" decorative /><span className="table-card-text"><span className="table-card-name">{card.name}</span><span className="table-card-meta">#{card.id} · {card.type}{card.atk !== null ? ` · ATK ${card.atk}` : ''}</span></span></Link></td>
              <td data-label="Weight"><DropRate weight={drop.weight} part="weight" /></td><td data-label="Per reward"><DropRate weight={drop.weight} part="single" /></td><td data-label="Per duel"><DropRate weight={drop.weight} part="duel" /></td>
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
