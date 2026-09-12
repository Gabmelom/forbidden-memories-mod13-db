import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardImage } from '../components/CardImage'
import { CardImagePreview } from '../components/CardImagePreview'
import { CardInformation } from '../components/CardInformation'
import { DropRate } from '../components/DropRate'
import { DropNotes } from '../components/DropNotes'
import { DuelistImage } from '../components/DuelistImage'
import { EquipInformation } from '../components/EquipInformation'
import { FusionInformation } from '../components/FusionInformation'
import { RankBadge } from '../components/RankBadge'
import { RitualInformation } from '../components/RitualInformation'
import { useMod } from '../context/ModContext'

export function CardDetailPage() {
  const { cardId } = useParams()
  const { mod, data } = useMod()
  const { getCardById, getDropsForCard, getDuelistById, getRitualsForResult, getRitualsUsingCard, getEquipsForCard, getFusionsForResult, getFusionsUsingCard, getFusionRulesForResult, getFusionRulesUsingCard } = data
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
  const showNotes = mod.id === 'fm2-ghost'
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
        <div className="card-detail-overview">
          <p className="eyebrow">#{card.id}</p>
          <h1>{card.name}</h1>
          <CardInformation card={card} />
        </div>
      </header>
      <section className="detail-section">
        <div className="section-heading"><div><p className="eyebrow">Drop sources</p><h2>Where to farm</h2></div><span>{sources.length} {sources.length === 1 ? 'source' : 'sources'}</span></div>
        {sources.length ? (
          <div className="table-frame"><table className="drop-table">
            <thead><tr><th>Duelist</th><th>Rank</th><th>Weight</th><th>Per duel</th>{showNotes && <th>Requirements</th>}</tr></thead>
            <tbody>{sources.map(({ drop, duelist }) => {
              const isBest = drop.weight === highestWeight
              return <tr key={`${drop.duelistId}-${drop.rank}-${drop.weight}-${drop.condition ?? 'base'}`} className={isBest ? 'best-row' : ''}>
                <td data-label="Duelist"><div className="duelist-source"><Link className="duelist-source-link" to={`/${mod.id}/duelists/${duelist.slug}?rank=${drop.rank}`}><DuelistImage slug={duelist.slug} name={duelist.name} size="small" decorative /><span>{duelist.name}</span></Link>{isBest && <span className="best-badge">{bestCount > 1 ? 'BEST RATE' : 'BEST FARM'}</span>}</div></td>
                <td data-label="Rank"><RankBadge rank={drop.rank} /></td><td data-label="Weight"><DropRate weight={drop.weight} part="weight" /></td><td data-label="Per duel"><DropRate weight={drop.weight} part="duel" /></td>
                {showNotes && <td className="card-drop-notes-cell" data-label="Requirements"><DropNotes notes={drop.notes} /></td>}
              </tr>
            })}</tbody>
          </table></div>
        ) : <div className="empty-state">No {mod.label} drop sources found for this card.</div>}
      </section>
      {mod.rituals && (
        <RitualInformation
          card={card}
          modId={mod.id}
          recipesForResult={getRitualsForResult(card.id)}
          recipesUsingCard={getRitualsUsingCard(card.id)}
          getCardById={getCardById}
        />
      )}
      {mod.equips && <EquipInformation cards={getEquipsForCard(card.id)} modId={mod.id} />}
      {(mod.fusions || mod.fusionRules) && (
        <FusionInformation
          key={card.id}
          card={card}
          modId={mod.id}
          recipesForResult={getFusionsForResult(card.id)}
          recipesUsingCard={getFusionsUsingCard(card.id)}
          rulesForResult={getFusionRulesForResult(card.id)}
          rulesUsingCard={getFusionRulesUsingCard(card.id)}
          getCardById={getCardById}
        />
      )}
      {isPreviewOpen && <CardImagePreview cardId={card.id} cardName={card.name} onClose={closePreview} />}
    </article>
  )
}
