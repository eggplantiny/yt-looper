<template>
  <li
    class="py-2 px-4 block whitespace-nowrap"
    :class="computedClass"
  >
    <slot />
  </li>
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
} from "@/compositions/useTailwind"

export default {
  name: 'AListItem',
  props: {
    color: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo'
    },
    text: {
      type: String as PropType<Tailwind.Color>,
      default: 'black'
    }
  },
  setup (props) {
    const computedClass = computed(() => {
      const bgClasses = [
        useColor('bg', props.color, 300),
        useColor('hover:bg', props.color, 500)
      ]

      const textClasses = [
        useColor('text', props.text, 700)
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
