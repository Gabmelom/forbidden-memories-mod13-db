import type { DropNote } from '../types'

export function DropNotes({ notes }: { notes?: DropNote[] }) {
  if (!notes?.length) return <span className="drop-notes-empty" aria-label="No special requirements">—</span>

  return (
    <div className="drop-note-list">
      {notes.map((note) => (
        <span
          key={`${note.type}-${note.label}`}
          className={`drop-note-chip drop-note-${note.type}`}
          aria-label={note.detail}
          title={note.detail}
        >
          {note.label}
        </span>
      ))}
    </div>
  )
}
