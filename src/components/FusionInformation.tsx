import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Card, FusionCardMatcher, FusionRecipe, FusionRule } from '../types'
import { matchesFusionCard } from '../utils/fusionRules'
import { CardImage } from './CardImage'
import { CardTypeLabel } from './CardTypeLabel'

const INITIAL_SPECIFIC_RECIPE_COUNT = 8

interface FusionInformationProps {
  card: Card
  modId: string
  recipesForResult: FusionRecipe[]
  recipesUsingCard: FusionRecipe[]
  rulesForResult: FusionRule[]
  rulesUsingCard: FusionRule[]
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

function matcherConditions(matcher: FusionCardMatcher, getCardById: FusionInformationProps['getCardById']): { text: string; title?: string } {
  const conditions: string[] = []
  if (matcher.minAtkInclusive !== undefined) conditions.push(`ATK ≥ ${matcher.minAtkInclusive}`)
  if (matcher.maxAtkExclusive !== undefined) conditions.push(`ATK < ${matcher.maxAtkExclusive}`)
  if (matcher.minDefInclusive !== undefined) conditions.push(`DEF ≥ ${matcher.minDefInclusive}`)
  if (matcher.maxDefExclusive !== undefined) conditions.push(`DEF < ${matcher.maxDefExclusive}`)
  if (matcher.attribute !== undefined) conditions.push(matcher.attribute ? `${matcher.attribute} attribute` : 'No attribute')
  if (matcher.excludeCardIds?.length) conditions.push(`except ${matcher.excludeCardIds.length} ${matcher.excludeCardIds.length === 1 ? 'card' : 'cards'}`)
  const excludedNames = matcher.excludeCardIds
    ?.map((cardId) => getCardById(cardId)?.name)
    .filter((name): name is string => Boolean(name))
  return {
    text: conditions.length ? conditions.join(' · ') : 'Any card of this type',
    ...(excludedNames?.length ? { title: `Excluded: ${excludedNames.join(', ')}` } : {}),
  }
}

function FusionMatcherBlock({ matcher, currentCard, highlightCurrent, modId, getCardById }: {
  matcher: FusionCardMatcher
  currentCard: Card
  highlightCurrent: boolean
  modId: string
  getCardById: FusionInformationProps['getCardById']
}) {
  if (matcher.cardId !== undefined) {
    const exactCard = getCardById(matcher.cardId)
    return exactCard ? <FusionCardLink card={exactCard} currentCardId={highlightCurrent ? currentCard.id : -1} modId={modId} /> : null
  }
  if (!matcher.type) return null
  const conditions = matcherConditions(matcher, getCardById)
  const isCurrent = highlightCurrent && matchesFusionCard(currentCard, matcher)
  return (
    <div className={`fusion-rule-matcher${isCurrent ? ' current' : ''}`} title={conditions.title}>
      <CardTypeLabel cardType={matcher.type} />
      <span className="fusion-rule-conditions">{conditions.text}</span>
      {isCurrent && <span className="fusion-current-match">This card</span>}
    </div>
  )
}

function FusionRuleRow({ rule, currentCard, currentAsMaterial, modId, getCardById }: {
  rule: FusionRule
  currentCard: Card
  currentAsMaterial: boolean
  modId: string
  getCardById: FusionInformationProps['getCardById']
}) {
  const result = getCardById(rule.resultCardId)
  if (!result) return null
  const currentMatchesLeft = currentAsMaterial && matchesFusionCard(currentCard, rule.left)
  const currentMatchesRight = currentAsMaterial && matchesFusionCard(currentCard, rule.right)
  const [firstMatcher, secondMatcher] = currentMatchesRight && !currentMatchesLeft
    ? [rule.right, rule.left]
    : [rule.left, rule.right]

  return (
    <article className="fusion-recipe-card fusion-rule-card" data-rule-id={rule.id}>
      <span className="fusion-entry-kind">Rule</span>
      <FusionMatcherBlock matcher={firstMatcher} currentCard={currentCard} highlightCurrent={currentAsMaterial} modId={modId} getCardById={getCardById} />
      <span className="fusion-operator" aria-hidden="true">+</span>
      <FusionMatcherBlock matcher={secondMatcher} currentCard={currentCard} highlightCurrent={currentAsMaterial} modId={modId} getCardById={getCardById} />
      <span className="fusion-operator fusion-arrow" aria-hidden="true">→</span>
      <FusionCardLink card={result} currentCardId={currentAsMaterial ? -1 : currentCard.id} modId={modId} />
    </article>
  )
}

function FusionRecipeRow({ recipe, currentCardId, modId, getCardById }: {
  recipe: FusionRecipe
  currentCardId: number
  modId: string
  getCardById: FusionInformationProps['getCardById']
}) {
  const firstMaterial = getCardById(recipe.materialCardIds[0])
  const secondMaterial = getCardById(recipe.materialCardIds[1])
  const result = getCardById(recipe.resultCardId)
  if (!firstMaterial || !secondMaterial || !result) return null

  return (
    <article className="fusion-recipe-card fusion-specific-card">
      <span className="fusion-entry-kind specific">Specific</span>
      <FusionCardLink card={firstMaterial} currentCardId={currentCardId} modId={modId} />
      <span className="fusion-operator" aria-hidden="true">+</span>
      <FusionCardLink card={secondMaterial} currentCardId={currentCardId} modId={modId} />
      <span className="fusion-operator fusion-arrow" aria-hidden="true">→</span>
      <FusionCardLink card={result} currentCardId={currentCardId} modId={modId} />
    </article>
  )
}

function FusionEntryGroup({ title, rules, recipes, currentCard, currentAsMaterial, modId, getCardById }: {
  title: string
  rules: FusionRule[]
  recipes: FusionRecipe[]
  currentCard: Card
  currentAsMaterial: boolean
  modId: string
  getCardById: FusionInformationProps['getCardById']
}) {
  const [specificExpanded, setSpecificExpanded] = useState(false)
  const visibleRecipes = specificExpanded ? recipes : recipes.slice(0, INITIAL_SPECIFIC_RECIPE_COUNT)
  return (
    <div className="fusion-recipe-group">
      <div className="fusion-group-heading">
        <h3>{title}</h3>
        <span>{rules.length ? `${rules.length} ${rules.length === 1 ? 'rule' : 'rules'}` : ''}{rules.length && recipes.length ? ' · ' : ''}{recipes.length ? `${recipes.length} specific` : ''}</span>
      </div>
      <div className="fusion-recipe-list">
        {rules.map((rule) => (
          <FusionRuleRow key={rule.id} rule={rule} currentCard={currentCard} currentAsMaterial={currentAsMaterial} modId={modId} getCardById={getCardById} />
        ))}
        {visibleRecipes.map((recipe) => (
          <FusionRecipeRow key={`${recipe.materialCardIds.join('-')}-${recipe.resultCardId}`} recipe={recipe} currentCardId={currentCard.id} modId={modId} getCardById={getCardById} />
        ))}
      </div>
      {recipes.length > INITIAL_SPECIFIC_RECIPE_COUNT && (
        <button type="button" className="fusion-show-more" onClick={() => setSpecificExpanded((expanded) => !expanded)}>
          {specificExpanded ? 'Show fewer specific recipes' : `Show all ${recipes.length} specific recipes`}
        </button>
      )}
    </div>
  )
}

export function FusionInformation({ card, modId, recipesForResult, recipesUsingCard, rulesForResult, rulesUsingCard, getCardById }: FusionInformationProps) {
  const ruleCount = rulesForResult.length + rulesUsingCard.length
  const specificCount = recipesForResult.length + recipesUsingCard.length
  const entryCount = ruleCount + specificCount
  return (
    <section className="detail-section fusion-information" aria-labelledby="fusion-information-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Card combinations</p><h2 id="fusion-information-heading">Fusions</h2></div>
        <span>{ruleCount ? `${ruleCount} ${ruleCount === 1 ? 'rule' : 'rules'}` : ''}{ruleCount && specificCount ? ' · ' : ''}{specificCount ? `${specificCount} specific` : ''}</span>
      </div>
      {entryCount ? (
        <div className="fusion-recipe-groups">
          {(rulesForResult.length > 0 || recipesForResult.length > 0) && (
            <FusionEntryGroup title="How to form this card" rules={rulesForResult} recipes={recipesForResult} currentCard={card} currentAsMaterial={false} modId={modId} getCardById={getCardById} />
          )}
          {(rulesUsingCard.length > 0 || recipesUsingCard.length > 0) && (
            <FusionEntryGroup title="Used to form other cards" rules={rulesUsingCard} recipes={recipesUsingCard} currentCard={card} currentAsMaterial modId={modId} getCardById={getCardById} />
          )}
        </div>
      ) : <div className="empty-state fusion-empty-state">This card is not part of a known fusion rule or specific recipe.</div>}
    </section>
  )
}
