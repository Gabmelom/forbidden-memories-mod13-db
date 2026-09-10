import { useMemo, type ReactNode } from 'react'
import type { ModDefinition } from '../mods/types'
import { createDataLookup } from '../utils/dataLookup'
import { ModContext } from './ModContext'

export function ModProvider({ mod, children }: { mod: ModDefinition; children: ReactNode }) {
  const data = useMemo(() => createDataLookup(mod), [mod])
  return <ModContext.Provider value={{ mod, data }}>{children}</ModContext.Provider>
}
