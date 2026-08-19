import type { DropSort } from '../types'

export function SortSelect({ value, onChange }: { value: DropSort; onChange: (value: DropSort) => void }) {
  return (
    <label className="select-control">
      <span>Sort</span>
      <select value={value} onChange={(event) => onChange(event.target.value as DropSort)}>
        <option value="rate">Drop rate</option><option value="name">Card name</option><option value="id">Card ID</option><option value="atk">ATK</option>
      </select>
    </label>
  )
}
