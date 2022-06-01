<script lang="ts">
import type {
  PropType,
} from 'vue'
import {
  computed,
} from 'vue'

import type {
  Tailwind,
} from '@/types'

import {
  useColor,
} from '@/compositions/useStyle'

export default {
  name: 'AListItem',
  props: {
    color: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo',
    },
    text: {
      type: String as PropType<Tailwind.Color>,
      default: 'black',
    },
  },
  setup(props) {
    const computedClass = computed(() => {
      const bgClasses = [
        useColor('bg', props.color, 300),
        useColor('hover:bg', props.color, 500),
      ]

      const textClasses = [
        useColor('text', props.text, 700),
        useColor('hover:text', 'white'),
      ]

      return [...bgClasses, ...textClasses]
    })

    return {
      computedClass,
    }
  },
}
</script>

<template>
  <li
    class="py-2 px-4 block whitespace-nowrap cursor-pointer"
    :class="computedClass"
  >
    <slot />
  </li>
</template>

<style scoped>

</style>
