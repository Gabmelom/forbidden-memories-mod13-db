import { useEffect, useRef, type ReactNode } from 'react'

interface MasterDetailLayoutProps {
  master: ReactNode
  detail: ReactNode
  hasSelection: boolean
  selectionKey?: string
  masterLabel: string
  detailLabel: string
  className?: string
}

export function MasterDetailLayout({
  master,
  detail,
  hasSelection,
  selectionKey,
  masterLabel,
  detailLabel,
  className,
}: MasterDetailLayoutProps) {
  const detailPaneRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (hasSelection && detailPaneRef.current) detailPaneRef.current.scrollTop = 0
  }, [hasSelection, selectionKey])

  return (
    <div className={`master-detail-layout${hasSelection ? ' has-selection' : ''}${className ? ` ${className}` : ''}`}>
      <aside className="master-pane" aria-label={masterLabel} tabIndex={0}>{master}</aside>
      <section ref={detailPaneRef} className="detail-pane" aria-label={detailLabel} tabIndex={0}>{detail}</section>
    </div>
  )
}
