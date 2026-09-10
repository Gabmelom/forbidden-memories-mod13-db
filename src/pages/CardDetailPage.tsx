import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardImage } from '../components/CardImage'
import { CardImagePreview } from '../components/CardImagePreview'
import { DropRate } from '../components/DropRate'
import { DuelistImage } from '../components/DuelistImage'
import { RankBadge } from '../components/RankBadge'
import { useMod } from '../context/ModContext'

export function CardDetailPage() {
  const { cardId } = useParams()
  const { mod, data } = useMod()
  const { getCardById, getDropsForCard, getDuelistById } = data
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const previewTriggerRef = useRef<HTMLButtonElement>(null)
  const card = getCardById(Number(cardId))
  if (!card) return <div className="empty-state not-found"><h1>Card not found</h1><Link className="button-link" to={`/${mod.id}/cards`}>Back to cards</Link></div>

  const sources = getDropsForCard(card.id)
    .map((drop) => ({ drop, duelist: getDuelistById(drop.duelistId) }))
    .filter((source): source is { drop: typeof source.drop; duelist: NonNullable<typeof source.duelist> } => Boolean(source.duelist))
    .sort((left, right) => right.drop.weight - left.drop.weight || left.duelist.name.localeCompare(right.duelist.name))
  const highestWeight = sources[0]?.drop.weight
  const bestCount = sources.filter((source) => source.drop.weight === highestWeight).length
  const closePreview = () => {
    setIsPreviewOpen(false)
    requestAnimationFrame(() => previewTriggerRef.current?.focus())
  }

  return (
    <article className="workspace-detail-content">
      <Link className="back-link mobile-workspace-back" to={`/${mod.id}/cards`}>← Cards</Link>
      <header className="detail-heading">
        <button ref={previewTriggerRef} type="button" className="card-image-trigger" aria-label={`View larger image of ${card.name}`} onClick={() => setIsPreviewOpen(true)}>
          <CardImage cardId={card.id} cardName={card.name} size="large" loading="eager" />
        </button>
        <div><p className="eyebrow">#{card.id}</p><h1>{card.name}</h1><div className="card-meta detail-meta"><span>{card.type}</span>{(card.atk !== null || card.def !== null) && <span>ATK {card.atk ?? '—'} / DEF {card.def ?? '—'}</span>}</div></div>
      </header>
      <section className="detail-section">
        <div className="section-heading"><div><p className="eyebrow">Drop sources</p><h2>Where to farm</h2></div><span>{sources.length} {sources.length === 1 ? 'source' : 'sources'}</span></div>
        {sources.length ? (
          <div className="table-frame"><table className="drop-table">
            <thead><tr><th>Duelist</th><th>Rank</th><th>Weight</th><th>Per reward</th><th>Per duel</th></tr></thead>
            <tbody>{sources.map(({ drop, duelist }) => {
              const isBest = drop.weight === highestWeight
              return <tr key={`${drop.duelistId}-${drop.rank}`} className={isBest ? 'best-row' : ''}>
                <td data-label="Duelist"><div className="duelist-source"><Link className="duelist-source-link" to={`/${mod.id}/duelists/${duelist.slug}?rank=${drop.rank}`}><DuelistImage slug={duelist.slug} name={duelist.name} size="small" decorative /><span>{duelist.name}</span></Link>{isBest && <span className="best-badge">{bestCount > 1 ? 'BEST RATE' : 'BEST FARM'}</span>}</div></td>
                <td data-label="Rank"><RankBadge rank={drop.rank} /></td><td data-label="Weight"><DropRate weight={drop.weight} part="weight" /></td><td data-label="Per reward"><DropRate weight={drop.weight} part="single" /></td><td data-label="Per duel"><DropRate weight={drop.weight} part="duel" /></td>
              </tr>
            })}</tbody>
          </table></div>
        ) : <div className="empty-state">No {mod.label} drop sources found for this card.</div>}
      </section>
      {isPreviewOpen && <CardImagePreview cardId={card.id} cardName={card.name} onClose={closePreview} />}
    </article>
  )
}
