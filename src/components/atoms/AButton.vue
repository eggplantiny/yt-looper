<template>
  <button
    class="font-bold py-2 px-4 rounded"
    :class="computedClass"
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

    return {
      computedClass
    }
  }
}
</script>

<style scoped>

</style>
