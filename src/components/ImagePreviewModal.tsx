import { useEffect, useRef, type ReactNode } from 'react'

interface ImagePreviewModalProps {
  title: string
  caption: string
  onClose: () => void
  children: ReactNode
}

export function ImagePreviewModal({ title, caption, onClose, children }: ImagePreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="image-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="image-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <button ref={closeButtonRef} type="button" className="image-dialog-close" aria-label="Close image preview" onClick={onClose}>×</button>
        {children}
        <p>{caption}</p>
      </div>
    </div>
  )
}
