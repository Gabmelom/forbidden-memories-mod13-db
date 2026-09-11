interface SearchInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

export function SearchInput({ id, label, placeholder, value, onChange, autoFocus = false }: SearchInputProps) {
  return (
    <div className="search-field">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <span aria-hidden="true" className="search-icon">⌕</span>
      <input id={id} type="search" autoComplete="off" autoFocus={autoFocus} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
