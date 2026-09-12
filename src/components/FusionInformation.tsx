import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Card, FusionRecipe } from '../types'
import { CardImage } from './CardImage'

const INITIAL_RECIPE_COUNT = 12

interface FusionInformationProps {
  card: Card
  modId: string
  recipesForResult: FusionRecipe[]
  recipesUsingCard: FusionRecipe[]
  getCardById: (cardId: number) => Card | undefined
}

function FusionCardLink({ card, currentCardId, modId }: { card: Card; currentCardId: number; modId: string }) {
  const isCurrent = card.id === currentCardId
  return (
    <Link className={`fusion-card-link${isCurrent ? ' current' : ''}`} to={`/${modId}/cards/${card.id}`} title={isCurrent ? 'Current card' : undefined}>
      <CardImage cardId={card.id} cardName={card.name} size="small" decorative />
      <span className="fusion-card-text"><span>#{card.id}</span><strong>{card.name}</strong></span>
    </Link>
  )
}

function FusionRecipeRow({ recipe, currentCardId, modId, getCardById }: { recipe: FusionRecipe; currentCardId: number; modId: string; getCardById: FusionInformationProps['getCardById'] }) {
  const firstMaterial = getCardById(recipe.materialCardIds[0])
  const secondMaterial = getCardById(recipe.materialCardIds[1])
  const result = getCardById(recipe.resultCardId)
  if (!firstMaterial || !secondMaterial || !result) return null

  return (
    <article className="fusion-recipe-card">
      <FusionCardLink card={firstMaterial} currentCardId={currentCardId} modId={modId} />
      <span className="fusion-operator" aria-hidden="true">+</span>
      <FusionCardLink card={secondMaterial} currentCardId={currentCardId} modId={modId} />
      <span className="fusion-operator fusion-arrow" aria-hidden="true">→</span>
      <FusionCardLink card={result} currentCardId={currentCardId} modId={modId} />
    </article>
  )
}

function FusionRecipeGroup({ title, recipes, currentCardId, modId, getCardById }: { title: string; recipes: FusionRecipe[]; currentCardId: number; modId: string; getCardById: FusionInformationProps['getCardById'] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleRecipes = isExpanded ? recipes : recipes.slice(0, INITIAL_RECIPE_COUNT)
  return (
    <div className="fusion-recipe-group">
      <div className="fusion-group-heading"><h3>{title}</h3><span>{recipes.length}</span></div>
      <div className="fusion-recipe-list">
        {visibleRecipes.map((recipe) => (
          <FusionRecipeRow
            key={`${recipe.materialCardIds.join('-')}-${recipe.resultCardId}`}
            recipe={recipe}
            currentCardId={currentCardId}
            modId={modId}
            getCardById={getCardById}
          />
        ))}
      </div>
      {recipes.length > INITIAL_RECIPE_COUNT && (
        <button type="button" className="fusion-show-more" onClick={() => setIsExpanded((expanded) => !expanded)}>
          {isExpanded ? 'Show fewer' : `Show all ${recipes.length} recipes`}
        </button>
      )}
    </div>
  )
}

function getOtherMaterials(recipe: FusionRecipe, currentCardId: number, getCardById: FusionInformationProps['getCardById']): Card[] {
  const currentIsMaterial = recipe.materialCardIds.includes(currentCardId)
  let otherMaterialIds = currentIsMaterial
    ? recipe.materialCardIds.filter((cardId) => cardId !== currentCardId)
    : [...recipe.materialCardIds]
  if (currentIsMaterial && otherMaterialIds.length === 0) otherMaterialIds = [currentCardId]
  return otherMaterialIds.map(getCardById).filter((material): material is Card => Boolean(material))
}

function parseMinimum(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

export function FusionInformation({ card, modId, recipesForResult, recipesUsingCard, getCardById }: FusionInformationProps) {
  const recipeCount = recipesForResult.length + recipesUsingCard.length
  const allRecipes = [...recipesForResult, ...recipesUsingCard]
  const materialTypes = [...new Set(allRecipes.flatMap((recipe) =>
    getOtherMaterials(recipe, card.id, getCardById).map((material) => material.type).filter((type): type is string => Boolean(type)),
  ))].sort((left, right) => left.localeCompare(right))
  const [materialType, setMaterialType] = useState('')
  const [minimumAtk, setMinimumAtk] = useState<number | null>(null)
  const [minimumDef, setMinimumDef] = useState<number | null>(null)
  const hasFilters = Boolean(materialType) || minimumAtk !== null || minimumDef !== null
  const filterRecipes = (recipes: FusionRecipe[]) => recipes.filter((recipe) => {
    if (materialType && !getOtherMaterials(recipe, card.id, getCardById).some((material) => material.type === materialType)) return false
    const result = getCardById(recipe.resultCardId)
    if (!result) return false
    if (minimumAtk !== null && (result.atk === null || result.atk < minimumAtk)) return false
    if (minimumDef !== null && (result.def === null || result.def < minimumDef)) return false
    return true
  })
  const filteredForResult = filterRecipes(recipesForResult)
  const filteredUsingCard = filterRecipes(recipesUsingCard)
  const filteredCount = filteredForResult.length + filteredUsingCard.length
  const resetFilters = () => {
    setMaterialType('')
    setMinimumAtk(null)
    setMinimumDef(null)
  }
  return (
    <section className="detail-section fusion-information" aria-labelledby="fusion-information-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Card combinations</p><h2 id="fusion-information-heading">Fusions</h2></div>
        <span>{hasFilters ? `${filteredCount} / ${recipeCount}` : recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}</span>
      </div>
      {recipeCount ? (
        <>
          <div className="fusion-filters" aria-label="Fusion filters">
            <label><span>Other material</span><select aria-label="Other material type" value={materialType} onChange={(event) => setMaterialType(event.target.value)}><option value="">All types</option>{materialTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
            <label><span>Result ATK</span><input aria-label="Minimum result ATK" type="number" min="0" step="50" placeholder="Min" value={minimumAtk ?? ''} onChange={(event) => setMinimumAtk(parseMinimum(event.target.value))} /></label>
            <label><span>Result DEF</span><input aria-label="Minimum result DEF" type="number" min="0" step="50" placeholder="Min" value={minimumDef ?? ''} onChange={(event) => setMinimumDef(parseMinimum(event.target.value))} /></label>
            {hasFilters && <button type="button" onClick={resetFilters}>Clear</button>}
          </div>
          {filteredCount ? (
            <div className="fusion-recipe-groups">
              {filteredForResult.length > 0 && <FusionRecipeGroup key={`result-${materialType}-${minimumAtk}-${minimumDef}`} title="How to form this card" recipes={filteredForResult} currentCardId={card.id} modId={modId} getCardById={getCardById} />}
              {filteredUsingCard.length > 0 && <FusionRecipeGroup key={`material-${materialType}-${minimumAtk}-${minimumDef}`} title="Used to form other cards" recipes={filteredUsingCard} currentCardId={card.id} modId={modId} getCardById={getCardById} />}
            </div>
          ) : <div className="empty-state fusion-filter-empty">No fusion recipes match these filters.</div>}
        </>
      ) : <div className="empty-state fusion-empty-state">This card is not part of a known fusion recipe.</div>}
    </section>
  )
}
