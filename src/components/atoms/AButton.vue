<template>
  <button
    class="btn"
    :class="computedClass"
    :style="computedStyle"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, } from 'vue'
import { Tailwind } from '@/types'

import {
  useColor
} from '@/compositions/useStyle'

type TBtnColorOptions = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
type TBtnStateOptions = 'link' | 'ghost' | 'outline' | 'active' | 'disabled'

const props = withDefaults(defineProps<{
  color?: TBtnColorOptions
  text?: Tailwind.Color
  height?: number
}>(), {
  color: 'primary',
  text: 'white',
  height: 48
})

const computedClass = computed(() => {
  const bgClasses = [
    `btn-${props.color}`
  ]

  const textClasses = [
    useColor('text', props.text)
  ]

  return [...bgClasses, ...textClasses]
})

const computedStyle = computed(() => {
  const height = `${props.height}px`
  return {
    height
  }
})
</script>

<style scoped>
</style>
