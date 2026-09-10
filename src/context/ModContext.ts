import { createContext, useContext } from 'react'
import type { ModDefinition } from '../mods/types'
import type { DataLookup } from '../utils/dataLookup'

export interface ModContextValue {
  mod: ModDefinition
  data: DataLookup
}

export const ModContext = createContext<ModContextValue | null>(null)

export function useMod(): ModContextValue {
  const context = useContext(ModContext)
  if (!context) throw new Error('useMod must be used inside ModProvider')
  return context
}
