import {
  Tailwind
} from '@/types'

export function useColor (prefix: string, color: Tailwind.Color, colorLevel?: Tailwind.ColorLevel) {
  let result = `${prefix}-${color}`

  if (colorLevel) {
    result = `${result}-${colorLevel}`
  }

  return result
}
