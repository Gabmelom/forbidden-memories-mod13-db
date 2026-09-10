import { fm2Ghost } from './fm2-ghost'
import { mod13 } from './mod13'

export const DEFAULT_MOD_ID = mod13.id
export const MODS = [mod13, fm2Ghost]

export function getMod(id: string | undefined) {
  return MODS.find((mod) => mod.id === id)
}
