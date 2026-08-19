import {
  type AdvancedFilterCategory,
  type CardAdvancedFilters,
  countActiveAdvancedFilters,
} from '../../utils/cardFilters'

interface ActiveFilterChipsProps {
  filters: CardAdvancedFilters
  onRemove: (category: AdvancedFilterCategory) => void
  onClear: () => void
}

interface FilterChip {
  category: AdvancedFilterCategory
  label: string
  removeLabel: string
}

function formatRange(label: string, min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${label} ${min}–${max}`
  if (min !== null) return `${label} ≥ ${min}`
  return `${label} ≤ ${max}`
}

export function ActiveFilterChips({ filters, onRemove, onClear }: ActiveFilterChipsProps) {
  if (!countActiveAdvancedFilters(filters)) return null

  const chips: FilterChip[] = []
  if (filters.attribute) {
    chips.push({ category: 'attribute', label: filters.attribute, removeLabel: `Remove ${filters.attribute} attribute filter` })
  }
  if (filters.minAtk !== null || filters.maxAtk !== null) {
    chips.push({ category: 'atk', label: formatRange('ATK', filters.minAtk, filters.maxAtk), removeLabel: 'Remove ATK filter' })
  }
  if (filters.minDef !== null || filters.maxDef !== null) {
    chips.push({ category: 'def', label: formatRange('DEF', filters.minDef, filters.maxDef), removeLabel: 'Remove DEF filter' })
  }
  if (filters.minLevel !== null || filters.maxLevel !== null) {
    chips.push({ category: 'level', label: formatRange('Level', filters.minLevel, filters.maxLevel), removeLabel: 'Remove Level filter' })
  }
  if (filters.guardianStar) {
    chips.push({ category: 'guardianStar', label: filters.guardianStar, removeLabel: `Remove ${filters.guardianStar} guardian star filter` })
  }

  return (
    <div className="active-filter-summary" aria-label="Active advanced filters">
      <div className="filter-chip-list">
        {chips.map((chip) => (
          <button type="button" className="filter-chip" key={chip.category} aria-label={chip.removeLabel} onClick={() => onRemove(chip.category)}>
            <span>{chip.label}</span><span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button type="button" className="clear-filter-button" onClick={onClear}>Clear all</button>
    </div>
  )
}
