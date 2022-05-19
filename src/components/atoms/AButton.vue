<template>
  <button
    class="btn btn-primary"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineProps, withDefaults } from 'vue'
import { BtnColor } from '@/types/daisyui.type'

withDefaults(defineProps<{
  color?: BtnColor
}>(), {
  color: 'btn-primary'
})
</script>

<style scoped>

</style>
