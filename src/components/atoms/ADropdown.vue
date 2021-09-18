<template>
  <ul
    class="dropdown-menu absolute hidden text-grey-700 pt-1 rounded-lg"
    :style="computedStyle"
  >
    <slot />
  </ul>
</template>

<script lang="ts">
import {
  computed,
} from 'vue'

import {
  useSize
} from "@/compositions/useStyle"

export default {
  name: 'ADropdown',
  props: {
    width: {
      type: Number,
      default: 100
    }
  },
  setup (props) {
    const computedStyle = computed(() => {
      const minWidth = useSize(props.width)
      const width = useSize(100, '%')

      return {
        minWidth,
        width
      }
    })

    return {
      computedStyle
    }
  }
}
</script>

<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  border-radius: 2em;
}

</style>
