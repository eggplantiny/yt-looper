import {
  Style,
  Tailwind
} from '@/types'

export function useColor (prefix: string, color: Tailwind.Color, colorLevel?: Tailwind.ColorLevel) {
  let result = `${prefix}-${color}`

  if (colorLevel) {
    result = `${result}-${colorLevel}`
  }

  return result
}

export function useSize (value: number, unit: Style.Size = 'px') {
  return `${value}${unit}`
}
