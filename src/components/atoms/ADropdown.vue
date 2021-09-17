<template>
  <ul
    class="dropdown-menu absolute hidden text-grey-700 pt-1"
  >
    <slot />
  </ul>
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
  name: 'ADropdown',
  props: {
    color: {
      type: String as PropType<Tailwind.Color>,
      default: 'indigo'
    },
    text: {
      type: String as PropType<Tailwind.Color>,
      default: 'gray'
    }
  },
  setup (props) {
    const computedClass = computed(() => {
      const bgClasses = [
        useColor('bg', props.color, 500),
        useColor('hover:bg', props.color, 700)
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
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
