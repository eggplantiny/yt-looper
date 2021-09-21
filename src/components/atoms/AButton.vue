<template>
  <button
    class="font-bold py-2 px-4 rounded transition-colors"
    :class="computedClass"
    :style="computedStyle"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import {
  computed,
  PropType
} from 'vue'

import {
  Tailwind
} from '@/types'

import {
  useColor
} from "../../compositions/useStyle"

export default {
  name: 'AButton',
  props: {
    color: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo'
    },
    text: {
      type: String as PropType<Tailwind.Color>,
      default: 'white'
    },
    height: {
      type: Number,
      default: 48
    }
  },
  setup (props) {
    const computedClass = computed(() => {
      const bgClasses = [
        useColor('bg', props.color, 500),
        useColor('hover:bg', props.color, 700)
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

    return {
      computedClass,
      computedStyle
    }
  }
}
</script>

<style scoped>

</style>
