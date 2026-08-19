import { useState } from 'react'
import {
  EMPTY_ADVANCED_CARD_FILTERS,
  type AdvancedFilterCategory,
  type CardAdvancedFilters,
  type NumericRange,
  countActiveAdvancedFilters,
  isValidRange,
  removeAdvancedFilter,
} from '../../utils/cardFilters'
import { ActiveFilterChips } from './ActiveFilterChips'

interface AdvancedCardFiltersProps {
  filters: CardAdvancedFilters
  attributes: string[]
  guardianStars: string[]
  attackRange: NumericRange | null
  defenseRange: NumericRange | null
  levelRange: NumericRange | null
  onChange: (filters: CardAdvancedFilters) => void
}

interface NumericRangeFieldsProps {
  id: string
  label: string
  minValue: number | null
  maxValue: number | null
  allowedRange: NumericRange | null
  step: number
  onMinChange: (value: number | null) => void
  onMaxChange: (value: number | null) => void
}

function parseNumericInput(value: string): number | null | undefined {
  if (value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function NumericRangeFields({
  id,
  label,
  minValue,
  maxValue,
  allowedRange,
  step,
  onMinChange,
  onMaxChange,
}: NumericRangeFieldsProps) {
  const isValid = isValidRange(minValue, maxValue)
  const errorId = `${id}-range-error`
  const handleChange = (value: string, onChange: (next: number | null) => void) => {
    const parsed = parseNumericInput(value)
    if (parsed !== undefined) onChange(parsed)
  }

  return (
    <fieldset className="advanced-range-field" aria-describedby={isValid ? undefined : errorId}>
      <legend>{label}</legend>
      <div className="advanced-range-inputs">
        <label><span>Min</span><input id={`${id}-min`} type="number" min={allowedRange?.min ?? 0} max={allowedRange?.max} step={step} value={minValue ?? ''} aria-invalid={!isValid} onChange={(event) => handleChange(event.target.value, onMinChange)} /></label>
        <label><span>Max</span><input id={`${id}-max`} type="number" min={allowedRange?.min ?? 0} max={allowedRange?.max} step={step} value={maxValue ?? ''} aria-invalid={!isValid} onChange={(event) => handleChange(event.target.value, onMaxChange)} /></label>
      </div>
      {!isValid && <span className="filter-range-error" id={errorId}>Minimum cannot be greater than maximum.</span>}
    </fieldset>
  )
}

export function AdvancedCardFilters({
  filters,
  attributes,
  guardianStars,
  attackRange,
  defenseRange,
  levelRange,
  onChange,
}: AdvancedCardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const activeCount = countActiveAdvancedFilters(filters)
  const update = (changes: Partial<CardAdvancedFilters>) => onChange({ ...filters, ...changes })
  const remove = (category: AdvancedFilterCategory) => onChange(removeAdvancedFilter(filters, category))
  const reset = () => onChange({ ...EMPTY_ADVANCED_CARD_FILTERS })

  return (
    <div className="advanced-filters">
      <button
        type="button"
        className="advanced-filter-toggle"
        aria-expanded={isExpanded}
        aria-controls="advanced-card-filters"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>Advanced filters {activeCount > 0 && <span className="advanced-filter-count">{activeCount}</span>}</span>
        <span aria-hidden="true">{isExpanded ? '▴' : '▾'}</span>
      </button>

      <ActiveFilterChips filters={filters} onRemove={remove} onClear={reset} />

      {isExpanded && (
        <div className="advanced-filter-panel" id="advanced-card-filters">
          <label className="advanced-select-field">
            <span>Attribute</span>
            <select value={filters.attribute ?? ''} onChange={(event) => update({ attribute: event.target.value || null })}>
              <option value="">All attributes</option>
              {attributes.map((attribute) => <option key={attribute} value={attribute}>{attribute}</option>)}
            </select>
          </label>

          <NumericRangeFields id="card-atk" label="ATK" minValue={filters.minAtk} maxValue={filters.maxAtk} allowedRange={attackRange} step={50} onMinChange={(minAtk) => update({ minAtk })} onMaxChange={(maxAtk) => update({ maxAtk })} />
          <NumericRangeFields id="card-def" label="DEF" minValue={filters.minDef} maxValue={filters.maxDef} allowedRange={defenseRange} step={50} onMinChange={(minDef) => update({ minDef })} onMaxChange={(maxDef) => update({ maxDef })} />
          <NumericRangeFields id="card-level" label="Level" minValue={filters.minLevel} maxValue={filters.maxLevel} allowedRange={levelRange} step={1} onMinChange={(minLevel) => update({ minLevel })} onMaxChange={(maxLevel) => update({ maxLevel })} />

          <label className="advanced-select-field">
            <span>Guardian star</span>
            <select value={filters.guardianStar ?? ''} onChange={(event) => update({ guardianStar: event.target.value || null })}>
              <option value="">Any guardian star</option>
              {guardianStars.map((star) => <option key={star} value={star}>{star}</option>)}
            </select>
          </label>

          <button type="button" className="reset-advanced-button" disabled={!activeCount} onClick={reset}>Reset advanced filters</button>
        </div>
      )}
    </div>
  )
}
