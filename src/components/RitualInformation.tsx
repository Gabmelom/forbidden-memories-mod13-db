import { Link } from 'react-router-dom'
import type { Card, RitualRecipe } from '../types'
import { CardImage } from './CardImage'

interface RitualInformationProps {
  card: Card
  modId: string
  recipesForResult: RitualRecipe[]
  recipesUsingCard: RitualRecipe[]
  getCardById: (cardId: number) => Card | undefined
}

function RitualCardLink({ card, currentCardId, modId, quantity = 1 }: { card: Card; currentCardId: number; modId: string; quantity?: number }) {
  const isCurrent = card.id === currentCardId
  return (
    <Link className={`ritual-card-link${isCurrent ? ' current' : ''}`} to={`/${modId}/cards/${card.id}`} title={isCurrent ? 'Current card' : undefined}>
      <CardImage cardId={card.id} cardName={card.name} size="small" decorative />
      <span className="ritual-card-text"><span>#{card.id}</span><strong>{card.name}</strong></span>
      {quantity > 1 && <span className="ritual-card-quantity">{quantity}×</span>}
    </Link>
  )
}

function RitualRecipeRow({ recipe, currentCardId, modId, getCardById }: { recipe: RitualRecipe; currentCardId: number; modId: string; getCardById: RitualInformationProps['getCardById'] }) {
  const ritualCard = getCardById(recipe.ritualCardId)
  const resultCard = getCardById(recipe.resultCardId)
  const groupedMaterials = recipe.materialCardIds.reduce<Array<{ cardId: number; quantity: number }>>((groups, cardId) => {
    const existing = groups.find((group) => group.cardId === cardId)
    if (existing) existing.quantity += 1
    else groups.push({ cardId, quantity: 1 })
    return groups
  }, [])
  const materials = groupedMaterials
    .map(({ cardId, quantity }) => ({ card: getCardById(cardId), quantity }))
    .filter((entry): entry is { card: Card; quantity: number } => Boolean(entry.card))

  if (!ritualCard || !resultCard || materials.length !== groupedMaterials.length) return null

  return (
    <article className="ritual-recipe-card">
      <div className="ritual-recipe-part">
        <span className="ritual-recipe-role">Ritual card</span>
        <RitualCardLink card={ritualCard} currentCardId={currentCardId} modId={modId} />
      </div>
      <div className="ritual-recipe-part">
        <span className="ritual-recipe-role">Materials</span>
        <div className="ritual-material-list">
          {materials.map(({ card, quantity }) => <RitualCardLink key={card.id} card={card} currentCardId={currentCardId} modId={modId} quantity={quantity} />)}
        </div>
      </div>
      <div className="ritual-recipe-part">
        <span className="ritual-recipe-role">Result</span>
        <RitualCardLink card={resultCard} currentCardId={currentCardId} modId={modId} />
      </div>
    </article>
  )
}

function RitualRecipeGroup({ title, recipes, currentCardId, modId, getCardById }: { title: string; recipes: RitualRecipe[]; currentCardId: number; modId: string; getCardById: RitualInformationProps['getCardById'] }) {
  return (
    <div className="ritual-recipe-group">
      <h3>{title}</h3>
      <div className="ritual-recipe-list">
        {recipes.map((recipe) => (
          <RitualRecipeRow
            key={`${recipe.ritualCardId}-${recipe.materialCardIds.join('-')}-${recipe.resultCardId}`}
            recipe={recipe}
            currentCardId={currentCardId}
            modId={modId}
            getCardById={getCardById}
          />
        ))}
      </div>
    </div>
  )
}

export function RitualInformation({ card, modId, recipesForResult, recipesUsingCard, getCardById }: RitualInformationProps) {
  const recipeCount = recipesForResult.length + recipesUsingCard.length
  return (
    <section className="detail-section ritual-information" aria-labelledby="ritual-information-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Card combinations</p><h2 id="ritual-information-heading">Rituals</h2></div>
        <span>{recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}</span>
      </div>
      {recipeCount ? (
        <div className="ritual-recipe-groups">
          {recipesForResult.length > 0 && <RitualRecipeGroup title="How to form this card" recipes={recipesForResult} currentCardId={card.id} modId={modId} getCardById={getCardById} />}
          {recipesUsingCard.length > 0 && <RitualRecipeGroup title="Used to form other cards" recipes={recipesUsingCard} currentCardId={card.id} modId={modId} getCardById={getCardById} />}
        </div>
      ) : <div className="empty-state ritual-empty-state">This card is not part of a known ritual recipe.</div>}
    </section>
  )
}
