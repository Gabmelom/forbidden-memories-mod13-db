import { Link, useParams } from 'react-router-dom'
import { DropRate } from '../components/DropRate'
import { RankBadge } from '../components/RankBadge'
import { getCardById, getDropsForCard, getDuelistById } from '../utils/dataLookup'

export function CardDetailPage() {
  const { cardId } = useParams()
  const card = getCardById(Number(cardId))
  if (!card) return <div className="empty-state not-found"><h1>Card not found</h1><Link className="button-link" to="/cards">Back to cards</Link></div>

  const sources = getDropsForCard(card.id)
    .map((drop) => ({ drop, duelist: getDuelistById(drop.duelistId) }))
    .filter((source): source is { drop: typeof source.drop; duelist: NonNullable<typeof source.duelist> } => Boolean(source.duelist))
    .sort((left, right) => right.drop.weight - left.drop.weight || left.duelist.name.localeCompare(right.duelist.name))
  const highestWeight = sources[0]?.drop.weight
  const bestCount = sources.filter((source) => source.drop.weight === highestWeight).length

  return (
    <article>
      <Link className="back-link" to="/cards">← All cards</Link>
      <header className="detail-heading">
        <div className="image-placeholder" aria-hidden="true"><span>#{card.id}</span></div>
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
                <td data-label="Duelist"><Link to={`/duelists/${duelist.slug}?rank=${drop.rank}`}>{duelist.name}</Link>{isBest && <span className="best-badge">{bestCount > 1 ? 'BEST RATE' : 'BEST FARM'}</span>}</td>
                <td data-label="Rank"><RankBadge rank={drop.rank} /></td><td data-label="Weight"><DropRate weight={drop.weight} part="weight" /></td><td data-label="Per reward"><DropRate weight={drop.weight} part="single" /></td><td data-label="Per duel"><DropRate weight={drop.weight} part="duel" /></td>
              </tr>
            })}</tbody>
          </table></div>
        ) : <div className="empty-state">No Mod 13 drop sources found for this card.</div>}
      </section>
    </article>
  )
}
